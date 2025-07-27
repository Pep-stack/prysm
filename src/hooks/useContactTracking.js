import { useCallback } from 'react';

export function useContactTracking(profileId) {
  const trackSocialClick = useCallback(async (platform, source = 'direct') => {
    if (!profileId || !platform) {
      console.error('Missing profileId or platform for tracking');
      return;
    }

    try {
      const response = await fetch('/api/analytics/track-social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          platform,
          source
        })
      });

      if (!response.ok) {
        console.error('Failed to track social click:', response.status);
        return;
      }

      console.log('Social click tracked successfully:', { platform, source });
    } catch (error) {
      console.error('Social tracking error:', error);
    }
  }, [profileId]);

  return { trackSocialClick };
} 