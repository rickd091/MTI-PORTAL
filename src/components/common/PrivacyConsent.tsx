import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Box, Button, Checkbox, FormControlLabel, Paper, Typography, Link } from '@mui/material';
import { auditLog } from '@/middleware/audit';

interface PrivacyConsentProps {
  userId?: string;
}

const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ userId }) => {
  const [showConsent, setShowConsent] = useState<boolean>(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [essentialConsent, setEssentialConsent] = useState<boolean>(true); // Essential cookies always required
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(false);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if consent has been given previously
    const checkConsent = async () => {
      if (userId) {
        const { data } = await supabase
          .from('user_consents')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (data) {
          setConsentGiven(true);
          setAnalyticsConsent(data.analytics_consent);
          setMarketingConsent(data.marketing_consent);
        } else {
          setShowConsent(true);
        }
      } else {
        // Check local storage for anonymous users
        const storedConsent = localStorage.getItem('privacyConsent');
        if (storedConsent) {
          const parsedConsent = JSON.parse(storedConsent);
          setConsentGiven(true);
          setAnalyticsConsent(parsedConsent.analytics);
          setMarketingConsent(parsedConsent.marketing);
        } else {
          setShowConsent(true);
        }
      }
    };
    
    checkConsent();
  }, [userId]);
  
  const handleSubmit = async () => {
    if (userId) {
      // Store consent in database for logged-in users
      await supabase.from('user_consents').upsert([
        {
          user_id: userId,
          essential_consent: true, // Always required
          analytics_consent: analyticsConsent,
          marketing_consent: marketingConsent,
          consent_date: new Date().toISOString(),
          ip_address: 'client-ip', // This would be captured properly in production
        },
      ]);
      
      // Log consent in audit trail
      auditLog(
        userId,
        'PRIVACY_CONSENT_UPDATED',
        'users',
        userId,
        {
          analytics: analyticsConsent,
          marketing: marketingConsent,
        },
        'client-ip'
      );
    } else {
      // Store consent in localStorage for anonymous users
      localStorage.setItem('privacyConsent', JSON.stringify({
        essential: true,
        analytics: analyticsConsent,
        marketing: marketingConsent,
        date: new Date().toISOString(),
      }));
    }
    
    setConsentGiven(true);
    setShowConsent(false);
  };
  
  const openConsentSettings = () => {
    setShowConsent(true);
  };
  
  if (!showConsent && consentGiven) {
    return (
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={openConsentSettings}
        >
          Privacy Settings
        </Button>
      </Box>
    );
  }
  
  if (!showConsent) return null;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        p: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Privacy Consent Settings
        </Typography>
        <Typography variant="body2" paragraph>
          We use cookies and similar technologies to help personalize content, enhance your experience, 
          and collect information about how you interact with our services. Please select which cookies you consent to:
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={essentialConsent}
                disabled={true} // Cannot be disabled
              />
            }
            label={
              <>
                <Typography variant="body2" fontWeight="bold">Essential Cookies (Required)</Typography>
                <Typography variant="caption" display="block">
                  These cookies are necessary for the website to function and cannot be disabled.
                </Typography>
              </>
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
              />
            }
            label={
              <>
                <Typography variant="body2" fontWeight="bold">Analytics Cookies</Typography>
                <Typography variant="caption" display="block">
                  These cookies allow us to count visits and traffic sources, to measure and improve the performance of our site.
                </Typography>
              </>
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
              />
            }
            label={
              <>
                <Typography variant="body2" fontWeight="bold">Marketing Cookies</Typography>
                <Typography variant="caption" display="block">
                  These cookies may be set by our advertising partners to build a profile of your interests.
                </Typography>
              </>
            }
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Link href="/privacy-policy" target="_blank" underline="hover">
            View Privacy Policy
          </Link>
          <Box>
            <Button 
              variant="outlined" 
              sx={{ mr: 1 }}
              onClick={() => {
                setAnalyticsConsent(false);
                setMarketingConsent(false);
                handleSubmit();
              }}
            >
              Reject All
            </Button>
            <Button 
              variant="outlined" 
              sx={{ mr: 1 }}
              onClick={() => {
                setAnalyticsConsent(true);
                setMarketingConsent(true);
                handleSubmit();
              }}
            >
              Accept All
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save Preferences
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PrivacyConsent;
