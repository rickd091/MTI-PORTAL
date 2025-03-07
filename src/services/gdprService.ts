import { supabase } from '@/lib/supabase';
import { auditLog } from '@/middleware/audit';
import { AuthorizationError } from '@/middleware/errorHandler';

/**
 * Service to handle GDPR-related functionality
 * Manages data access, export, and deletion requests
 */

// Types of data subject requests
export enum DataRequestType {
  ACCESS = 'ACCESS',
  EXPORT = 'EXPORT',
  DELETE = 'DELETE',
  RECTIFY = 'RECTIFY',
}

// Status of data requests
export enum DataRequestStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

/**
 * Submit a new data subject request (access, export, delete)
 */
export const submitDataRequest = async (userId: string, type: DataRequestType, details?: string) => {
  // Create a new data request record
  const { data, error } = await supabase.from('data_subject_requests').insert([
    {
      user_id: userId,
      request_type: type,
      status: DataRequestStatus.PENDING,
      details: details,
      requested_at: new Date().toISOString(),
    },
  ]).select();
  
  if (error) {
    throw new Error(`Failed to submit data request: ${error.message}`);
  }
  
  // Log the request in the audit trail
  auditLog(
    userId,
    'DATA_REQUEST_SUBMITTED',
    'data_subject_requests',
    data[0].id,
    { type, details },
    'client-ip'
  );
  
  return data[0];
};

/**
 * Get user data for export or access request
 */
export const getUserData = async (userId: string, requestId: string) => {
  // Verify the request exists and is valid
  const { data: request, error: requestError } = await supabase
    .from('data_subject_requests')
    .select('*')
    .eq('id', requestId)
    .eq('user_id', userId)
    .single();
  
  if (requestError || !request) {
    throw new Error('Invalid data request');
  }
  
  if (![DataRequestType.ACCESS, DataRequestType.EXPORT].includes(request.request_type as DataRequestType)) {
    throw new Error('Invalid request type for data access');
  }
  
  // Update request status to processing
  await supabase
    .from('data_subject_requests')
    .update({ status: DataRequestStatus.PROCESSING })
    .eq('id', requestId);
  
  // Collect user data from various tables
  const userData: any = {};
  
  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  userData.profile = profile;
  
  // Get user's institution data if applicable
  const { data: institutions } = await supabase
    .from('institutions')
    .select('*')
    .eq('user_id', userId);
    
  userData.institutions = institutions;
  
  // Get documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId);
    
  userData.documents = documents;
  
  // Get inspection records
  const { data: inspections } = await supabase
    .from('inspections')
    .select('*')
    .eq('inspector_id', userId);
    
  userData.inspections = inspections;
  
  // Get course data
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('created_by', userId);
    
  userData.courses = courses;
  
  // Get audit logs
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId);
    
  userData.auditLogs = auditLogs;
  
  // Get consents
  const { data: consents } = await supabase
    .from('user_consents')
    .select('*')
    .eq('user_id', userId);
    
  userData.consents = consents;
  
  // Update request status to completed
  await supabase
    .from('data_subject_requests')
    .update({
      status: DataRequestStatus.COMPLETED,
      completed_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  
  // Log the data access in the audit trail
  auditLog(
    userId,
    'DATA_ACCESSED',
    'data_subject_requests',
    requestId,
    { requestType: request.request_type },
    'system'
  );
  
  return userData;
};

/**
 * Delete user data (right to be forgotten)
 */
export const deleteUserData = async (userId: string, requestId: string, adminId?: string) => {
  // Only admins or the user themselves can request deletion
  if (adminId && adminId !== userId) {
    // Verify admin has permission
    const { data: adminData } = await supabase
      .from('users')
      .select('role')
      .eq('id', adminId)
      .single();
      
    if (!adminData || adminData.role !== 'ADMIN') {
      throw new AuthorizationError('Only administrators can process deletion requests for other users');
    }
  }
  
  // Verify the request exists and is valid
  const { data: request, error: requestError } = await supabase
    .from('data_subject_requests')
    .select('*')
    .eq('id', requestId)
    .eq('user_id', userId)
    .single();
  
  if (requestError || !request) {
    throw new Error('Invalid data request');
  }
  
  if (request.request_type !== DataRequestType.DELETE) {
    throw new Error('Invalid request type for data deletion');
  }
  
  // Update request status to processing
  await supabase
    .from('data_subject_requests')
    .update({ status: DataRequestStatus.PROCESSING })
    .eq('id', requestId);
  
  // Begin transaction for data deletion
  // Note: This would be implemented with a proper database transaction in production
  
  // Archive user data in a separate table for compliance purposes
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  await supabase.from('deleted_user_archives').insert([{
    user_id: userId,
    deletion_date: new Date().toISOString(),
    request_id: requestId,
    processed_by: adminId || userId,
    data_snapshot: {
      profile,
      // Other data would be included here
      deletion_reason: request.details,
    },
  }]);
  
  // Delete or anonymize user data across tables
  // This is a simplified version - a complete implementation would handle all tables
  
  // Anonymize documents rather than delete
  await supabase
    .from('documents')
    .update({
      user_id: 'anonymized',
      anonymized: true,
      anonymized_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
  
  // Delete sensitive user data
  await supabase.from('user_consents').delete().eq('user_id', userId);
  
  // Finally, anonymize the user account
  await supabase
    .from('users')
    .update({
      email: `anonymized-${userId}@deleted.example.com`,
      first_name: 'Anonymized',
      last_name: 'User',
      phone_number: null,
      address: null,
      deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', userId);
  
  // Update request status to completed
  await supabase
    .from('data_subject_requests')
    .update({
      status: DataRequestStatus.COMPLETED,
      completed_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  
  // Log the deletion in the audit trail
  auditLog(
    adminId || 'system',
    'USER_DATA_DELETED',
    'users',
    userId,
    { requestId },
    'system'
  );
  
  return { success: true };
};

/**
 * Update/rectify user data
 */
export const rectifyUserData = async (userId: string, requestId: string, updates: any) => {
  // Verify the request exists and is valid
  const { data: request, error: requestError } = await supabase
    .from('data_subject_requests')
    .select('*')
    .eq('id', requestId)
    .eq('user_id', userId)
    .single();
  
  if (requestError || !request) {
    throw new Error('Invalid data request');
  }
  
  if (request.request_type !== DataRequestType.RECTIFY) {
    throw new Error('Invalid request type for data rectification');
  }
  
  // Update request status to processing
  await supabase
    .from('data_subject_requests')
    .update({ status: DataRequestStatus.PROCESSING })
    .eq('id', requestId);
  
  // Safety check - don't allow updating certain fields
  const safeUpdates = { ...updates };
  ['id', 'role', 'created_at'].forEach(field => {
    if (safeUpdates[field]) delete safeUpdates[field];
  });
  
  // Update user data
  const { error: updateError } = await supabase
    .from('users')
    .update(safeUpdates)
    .eq('id', userId);
    
  if (updateError) {
    throw new Error(`Failed to update user data: ${updateError.message}`);
  }
  
  // Update request status to completed
  await supabase
    .from('data_subject_requests')
    .update({
      status: DataRequestStatus.COMPLETED,
      completed_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  
  // Log the update in the audit trail
  auditLog(
    userId,
    'USER_DATA_UPDATED',
    'users',
    userId,
    { fields: Object.keys(safeUpdates), requestId },
    'system'
  );
  
  return { success: true };
};

/**
 * Get the status of all data requests for a user
 */
export const getUserDataRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('data_subject_requests')
    .select('*')
    .eq('user_id', userId)
    .order('requested_at', { ascending: false });
    
  if (error) {
    throw new Error(`Failed to get data requests: ${error.message}`);
  }
  
  return data;
};

/**
 * Admin function to get all pending data requests
 */
export const getPendingDataRequests = async () => {
  const { data, error } = await supabase
    .from('data_subject_requests')
    .select('*, users(email)')
    .in('status', [DataRequestStatus.PENDING, DataRequestStatus.PROCESSING])
    .order('requested_at', { ascending: true });
    
  if (error) {
    throw new Error(`Failed to get pending data requests: ${error.message}`);
  }
  
  return data;
};
