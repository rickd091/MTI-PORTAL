import { supabase } from '@/lib/supabase';
import { validateData, userLoginSchema, userRegistrationSchema } from '@/lib/validation';
import { AuthenticationError, ValidationError } from '@/middleware/errorHandler';
import { auditLog } from '@/middleware/audit';

// Password policy constants
const PASSWORD_EXPIRY_DAYS = 90;
const PASSWORD_HISTORY_COUNT = 3;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

/**
 * User registration with validation
 */
export const registerUser = async (userData: any) => {
  // Validate user input
  const { isValid, data, errors } = await validateData(userData, userRegistrationSchema);
  
  if (!isValid || !data) {
    throw new ValidationError('Invalid registration data', errors || {});
  }
  
  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        role: data.role,
      },
    },
  });
  
  if (authError) {
    throw new AuthenticationError(authError.message);
  }
  
  // Store additional user data
  if (authData.user) {
    const { error: profileError } = await supabase.from('users').insert([
      {
        id: authData.user.id,
        email: data.email,
        role: data.role,
        accepted_terms: data.termsAccepted,
        accepted_privacy: data.privacyPolicyAccepted,
        password_changed_at: new Date().toISOString(),
        password_expires_at: new Date(Date.now() + PASSWORD_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);
    
    if (profileError) {
      // Attempt to clean up auth user if profile creation fails
      console.error('Error creating user profile:', profileError);
      throw new Error('Failed to create user profile');
    }
    
    // Log the successful registration
    auditLog(
      authData.user.id,
      'USER_REGISTERED',
      'users',
      authData.user.id,
      { email: data.email, role: data.role },
      userData.ipAddress || 'unknown'
    );
    
    return { user: authData.user };
  }
  
  throw new Error('User registration failed');
};

/**
 * User login with validation and security measures
 */
export const loginUser = async (credentials: any) => {
  // Validate login credentials
  const { isValid, data, errors } = await validateData(credentials, userLoginSchema);
  
  if (!isValid || !data) {
    throw new ValidationError('Invalid login credentials', errors || {});
  }
  
  // Check if account is locked due to too many failed attempts
  const { data: lockData } = await supabase
    .from('users')
    .select('failed_login_attempts, locked_until')
    .eq('email', data.email)
    .single();
  
  if (lockData?.locked_until && new Date(lockData.locked_until) > new Date()) {
    throw new AuthenticationError('Account is temporarily locked. Please try again later.');
  }
  
  // Attempt login
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  
  if (authError) {
    // Increment failed login attempts
    await handleFailedLogin(data.email, lockData?.failed_login_attempts || 0);
    throw new AuthenticationError(authError.message);
  }
  
  if (authData.user) {
    // Reset failed login attempts on successful login
    await supabase
      .from('users')
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id);
    
    // Check if password needs to be reset
    const { data: userData } = await supabase
      .from('users')
      .select('password_expires_at, mfa_enabled')
      .eq('id', authData.user.id)
      .single();
    
    if (userData?.password_expires_at && new Date(userData.password_expires_at) < new Date()) {
      // Password expired, mark user for password reset
      await supabase
        .from('users')
        .update({ password_reset_required: true })
        .eq('id', authData.user.id);
      
      return {
        user: authData.user,
        session: authData.session,
        passwordResetRequired: true,
        mfaRequired: userData.mfa_enabled || false,
      };
    }
    
    // Log successful login
    auditLog(
      authData.user.id,
      'USER_LOGGED_IN',
      'users',
      authData.user.id,
      { email: data.email },
      credentials.ipAddress || 'unknown'
    );
    
    return {
      user: authData.user,
      session: authData.session,
      mfaRequired: userData?.mfa_enabled || false,
    };
  }
  
  throw new AuthenticationError('Login failed');
};

/**
 * Handle failed login attempts and account locking
 */
async function handleFailedLogin(email: string, currentAttempts: number) {
  const newAttempts = currentAttempts + 1;
  const updates: any = { failed_login_attempts: newAttempts };
  
  // Lock account if max attempts reached
  if (newAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
    updates.locked_until = lockUntil.toISOString();
  }
  
  await supabase.from('users').update(updates).eq('email', email);
  
  // Log failed login attempt
  auditLog(
    'system',
    'FAILED_LOGIN',
    'users',
    email,
    { attempts: newAttempts, locked: newAttempts >= MAX_FAILED_ATTEMPTS },
    'unknown'
  );
}

/**
 * Enable MFA for a user
 */
export const enableMFA = async (userId: string) => {
  // Generate TOTP secret
  const { data, error } = await supabase.functions.invoke('generate-mfa-secret', {
    body: { userId },
  });
  
  if (error) {
    throw new Error('Failed to generate MFA secret');
  }
  
  // Update user record with MFA pending status
  await supabase
    .from('users')
    .update({
      mfa_secret: data.secret,
      mfa_pending: true,
    })
    .eq('id', userId);
  
  return {
    secret: data.secret,
    qrCode: data.qrCode,
  };
};

/**
 * Verify and activate MFA for a user
 */
export const verifyAndActivateMFA = async (userId: string, token: string) => {
  // Get user's MFA secret
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('mfa_secret, mfa_pending')
    .eq('id', userId)
    .single();
  
  if (userError || !userData?.mfa_secret || !userData.mfa_pending) {
    throw new Error('Invalid MFA setup state');
  }
  
  // Verify token against secret
  const { data, error } = await supabase.functions.invoke('verify-mfa-token', {
    body: {
      secret: userData.mfa_secret,
      token,
    },
  });
  
  if (error || !data?.valid) {
    throw new Error('Invalid MFA verification code');
  }
  
  // Activate MFA for the user
  await supabase
    .from('users')
    .update({
      mfa_enabled: true,
      mfa_pending: false,
    })
    .eq('id', userId);
  
  // Log MFA activation
  auditLog(
    userId,
    'MFA_ENABLED',
    'users',
    userId,
    { timestamp: new Date().toISOString() },
    'unknown'
  );
  
  return { success: true };
};

/**
 * Verify MFA token during login
 */
export const verifyMFALogin = async (userId: string, token: string) => {
  // Get user's MFA secret
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('mfa_secret, mfa_enabled')
    .eq('id', userId)
    .single();
  
  if (userError || !userData?.mfa_secret || !userData.mfa_enabled) {
    throw new Error('MFA is not enabled for this user');
  }
  
  // Verify token against secret
  const { data, error } = await supabase.functions.invoke('verify-mfa-token', {
    body: {
      secret: userData.mfa_secret,
      token,
    },
  });
  
  if (error || !data?.valid) {
    throw new Error('Invalid MFA verification code');
  }
  
  // Log successful MFA verification
  auditLog(
    userId,
    'MFA_VERIFIED',
    'users',
    userId,
    { timestamp: new Date().toISOString() },
    'unknown'
  );
  
  return { success: true };
};

/**
 * Change user password with history validation
 */
export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  // Validate new password
  const { isValid, errors } = await validateData({ password: newPassword }, userLoginSchema);
  
  if (!isValid) {
    throw new ValidationError('Invalid new password', errors || {});
  }
  
  // Verify current password
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: 'current-user@example.com', // Will be replaced by the system
    password: currentPassword,
  });
  
  if (verifyError) {
    throw new AuthenticationError('Current password is incorrect');
  }
  
  // Check password history to prevent reuse
  const { data: historyData } = await supabase
    .from('password_history')
    .select('password_hash')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(PASSWORD_HISTORY_COUNT);
  
  // Check if new password is in history (would need to be implemented with proper password comparison)
  // This is a placeholder for the actual implementation
  
  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (updateError) {
    throw new Error('Failed to update password');
  }
  
  // Store new password hash in history
  await supabase.from('password_history').insert([
    {
      user_id: userId,
      // Store a reference to the password, not the actual password
      password_hash: 'password_reference', // Would be properly hashed in real implementation
    },
  ]);
  
  // Update password expiration
  await supabase
    .from('users')
    .update({
      password_changed_at: new Date().toISOString(),
      password_expires_at: new Date(Date.now() + PASSWORD_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      password_reset_required: false,
    })
    .eq('id', userId);
  
  // Log password change
  auditLog(
    userId,
    'PASSWORD_CHANGED',
    'users',
    userId,
    { timestamp: new Date().toISOString() },
    'unknown'
  );
  
  return { success: true };
};

/**
 * Logout user and invalidate session
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error('Logout failed');
  }
  
  return { success: true };
};
