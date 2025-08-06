import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || '7d';

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get profile IDs for the user
    let profileIds = [];
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId);

    if (profilesError || !profiles || profiles.length === 0) {
      // Try using the userId as a profile ID directly
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return Response.json({ error: 'No profiles found' }, { status: 404 });
      }
      
      profileIds = [profile.id];
    } else {
      profileIds = profiles.map(p => p.id);
    }

    // Total views query
    const { data: totalViewsData, error: totalViewsError } = await supabase
      .from('analytics_views')
      .select('id')
      .in('profile_id', profileIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    console.log('Total views query result:', { 
      totalViews: totalViewsData?.length || 0, 
      error: totalViewsError 
    });

    // Unique visitors query
    const { data: uniqueVisitorsData, error: uniqueVisitorsError } = await supabase
      .from('analytics_views')
      .select('viewer_ip')
      .in('profile_id', profileIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    console.log('Unique visitors query result:', { 
      uniqueVisitors: uniqueVisitorsData ? new Set(uniqueVisitorsData.map(v => v.viewer_ip)).size : 0, 
      error: uniqueVisitorsError 
    });

    // Device breakdown query
    const { data: deviceData, error: deviceError } = await supabase
      .from('analytics_views')
      .select('user_agent')
      .in('profile_id', profileIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    console.log('Device data query result:', { 
      deviceData: deviceData?.length || 0, 
      error: deviceError 
    });

    // Referrer breakdown query (including source column)
    const { data: referrerData, error: referrerError } = await supabase
      .from('analytics_views')
      .select('referrer, source')
      .in('profile_id', profileIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    console.log('Referrer data query result:', { 
      referrerData: referrerData?.length || 0, 
      error: referrerError 
    });

    // Social clicks query
    const { data: socialData, error: socialError } = await supabase
      .from('analytics_social_clicks')
      .select('platform')
      .in('profile_id', profileIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    console.log('Social data query result:', { 
      socialData: socialData?.length || 0, 
      error: socialError 
    });

    // Geographic data query
    const { data: geographicData, error: geographicError } = await supabase
      .from('analytics_views')
      .select('country, city, latitude, longitude')
      .in('profile_id', profileIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    console.log('Geographic data query result:', { 
      geographicData: geographicData?.length || 0, 
      error: geographicError
    });
    
    if (geographicData) {
      console.log('Raw geographic data:', geographicData);
    }

    // Daily views query
    const { data: dailyViewsData, error: dailyViewsError } = await supabase
      .from('analytics_views')
      .select('created_at')
      .in('profile_id', profileIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Process device breakdown
    const deviceBreakdown = {};
    if (deviceData) {
      deviceData.forEach(view => {
        const userAgent = view.user_agent || '';
        let deviceType = 'desktop';
        if (userAgent.includes('Mobile')) deviceType = 'mobile';
        else if (userAgent.includes('Tablet')) deviceType = 'tablet';
        
        deviceBreakdown[deviceType] = (deviceBreakdown[deviceType] || 0) + 1;
      });
    }

    // Process referrer breakdown (prioritize source column over referrer detection)
    const referrerBreakdown = {};
    if (referrerData) {
      referrerData.forEach(view => {
        let referrerSource = 'direct';
        const source = view.source || '';
        const referrer = view.referrer || '';
        
        // First check if we have an explicit source (like qr_code)
        if (source && source !== 'direct') {
          referrerSource = source;
        } else if (!referrer || referrer === '') {
          referrerSource = 'direct';
        } else if (referrer.includes('instagram.com')) {
          referrerSource = 'instagram';
        } else if (referrer.includes('linkedin.com')) {
          referrerSource = 'linkedin';
        } else if (referrer.includes('twitter.com') || referrer.includes('x.com')) {
          referrerSource = 'x';
        } else if (referrer.includes('facebook.com')) {
          referrerSource = 'facebook';
        } else if (referrer.includes('tiktok.com')) {
          referrerSource = 'tiktok';
        } else if (referrer.includes('youtube.com')) {
          referrerSource = 'youtube';
        } else if (referrer.includes('github.com')) {
          referrerSource = 'github';
        } else if (referrer.includes('google.com')) {
          referrerSource = 'google';
        } else if (referrer.includes('whatsapp.com') || referrer.includes('wa.me')) {
          referrerSource = 'whatsapp';
        } else if (referrer.includes('t.me') || referrer.includes('telegram')) {
          referrerSource = 'telegram';
        } else if (referrer.includes('reddit.com')) {
          referrerSource = 'reddit';
        } else if (referrer.includes('dribbble.com')) {
          referrerSource = 'dribbble';
        } else if (referrer.includes('behance.net')) {
          referrerSource = 'behance';
        } else if (referrer.includes('snapchat.com')) {
          referrerSource = 'snapchat';
        } else if (referrer.includes('discord.com') || referrer.includes('discord.gg')) {
          referrerSource = 'discord';
        } else if (referrer.includes('twitch.tv')) {
          referrerSource = 'twitch';
        } else if (referrer.includes('pinterest.com')) {
          referrerSource = 'pinterest';
        } else if (referrer.includes('safari') || referrer.includes('apple')) {
          referrerSource = 'safari';
        } else if (referrer.includes('gmail.com') || referrer.includes('mail.')) {
          referrerSource = 'email';
        } else {
          // Extract domain for other referrers
          try {
            const url = new URL(referrer);
            referrerSource = url.hostname.replace('www.', '');
          } catch {
            referrerSource = 'other';
          }
        }
        
        referrerBreakdown[referrerSource] = (referrerBreakdown[referrerSource] || 0) + 1;
      });
    }

    // Process social breakdown
    const socialBreakdown = {};
    if (socialData) {
      socialData.forEach(click => {
        const platform = click.platform;
        socialBreakdown[platform] = (socialBreakdown[platform] || 0) + 1;
      });
    }

    // Process geographic breakdown
    const countryBreakdown = {};
    const cityBreakdown = {};
    const geographicPoints = [];
    
    console.log('Processing geographic data:', geographicData);
    
    if (geographicData) {
      geographicData.forEach((view, index) => {
        console.log(`Processing view ${index}:`, view);
        
        if (view.country) {
          countryBreakdown[view.country] = (countryBreakdown[view.country] || 0) + 1;
          console.log(`Added country: ${view.country}, count: ${countryBreakdown[view.country]}`);
        }
        if (view.city) {
          cityBreakdown[view.city] = (cityBreakdown[view.city] || 0) + 1;
          console.log(`Added city: ${view.city}, count: ${cityBreakdown[view.city]}`);
        }
        
        // Use real coordinates if available, otherwise skip
        if (view.country && view.city) {
          let coordinates = null;
          
          // Only use real coordinates from the database
          if (view.latitude && view.longitude) {
            coordinates = {
              lat: parseFloat(view.latitude),
              lng: parseFloat(view.longitude)
            };
            console.log(`Using real coordinates for ${view.city}, ${view.country}:`, coordinates);
          } else {
            console.log(`Skipping ${view.city}, ${view.country} - no real coordinates available`);
          }
          
          if (coordinates) {
            geographicPoints.push({
              lat: coordinates.lat,
              lng: coordinates.lng,
              country: view.country,
              city: view.city
            });
            console.log(`Added geographic point:`, {
              lat: coordinates.lat,
              lng: coordinates.lng,
              country: view.country,
              city: view.city
            });
          }
        }
      });
    }
    
    console.log('Final geographic breakdown:', {
      countryBreakdown,
      cityBreakdown,
      geographicPointsCount: geographicPoints.length
    });

    // Simple test - return raw geographic data
    console.log('TEST: Raw geographic data being returned:', geographicData);
    console.log('TEST: Profile IDs being used:', profileIds);

    // Process daily views
    const dailyViews = [];
    if (dailyViewsData) {
      const viewsByDate = {};
      dailyViewsData.forEach(view => {
        const date = new Date(view.created_at).toISOString().split('T')[0];
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
      });
      
      Object.entries(viewsByDate).forEach(([date, views]) => {
        dailyViews.push({ date, views });
      });
    }

    // Calculate totals and rates
    const totalViews = totalViewsData?.length || 0;
    const uniqueVisitors = uniqueVisitorsData ? new Set(uniqueVisitorsData.map(v => v.viewer_ip)).size : 0;
    const totalSocialClicks = socialData?.length || 0;
    const socialConversionRate = totalViews > 0 ? Math.round((totalSocialClicks / totalViews) * 100) : 0;

    const result = {
      totalViews,
      uniqueVisitors,
      deviceBreakdown,
      referrerBreakdown,
      socialBreakdown,
      totalSocialClicks,
      socialConversionRate,
      dailyViews,
      // Geographic data
      countryBreakdown,
      cityBreakdown,
      geographicPoints,
      period
    };

    console.log('Final result:', result);
    return Response.json(result);

  } catch (error) {
    console.error('Analytics data fetch error:', error);
    return Response.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
} 