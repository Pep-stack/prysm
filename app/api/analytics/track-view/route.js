import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { profileId, ip: clientIp, userAgent, referrer } = await request.json();

    if (!profileId) {
      return Response.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    // Get client IP server-side
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = clientIp === 'client-ip' ? 
      (forwarded ? forwarded.split(',')[0] : realIp || 'unknown') : 
      clientIp;

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get geographic data from IP
    let geographicData = {
      country: null,
      city: null,
      latitude: null,
      longitude: null
    };

    try {
      // Use a free IP geolocation service
      const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        if (geoData.status === 'success') {
          geographicData = {
            country: geoData.country,
            city: geoData.city,
            latitude: geoData.lat,
            longitude: geoData.lon
          };
          console.log('Real geographic data:', geographicData);
        }
      }
    } catch (geoError) {
      console.log('Geographic data fetch failed:', geoError.message);
      // Only use mock data if geolocation completely fails
      if (process.env.NODE_ENV === 'development') {
        const mockLocations = [
          { country: 'Netherlands', city: 'Rotterdam', lat: 51.9225, lng: 4.4792 },
          { country: 'Netherlands', city: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
          { country: 'Netherlands', city: 'The Hague', lat: 52.0705, lng: 4.3007 },
          { country: 'Netherlands', city: 'Utrecht', lat: 52.0907, lng: 5.1214 },
          { country: 'Netherlands', city: 'Eindhoven', lat: 51.4416, lng: 5.4697 },
          { country: 'United States', city: 'New York', lat: 40.7128, lng: -74.0060 },
          { country: 'United Kingdom', city: 'London', lat: 51.5074, lng: -0.1278 },
          { country: 'Germany', city: 'Berlin', lat: 52.5200, lng: 13.4050 },
          { country: 'France', city: 'Paris', lat: 48.8566, lng: 2.3522 }
        ];
        const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
        geographicData = {
          country: randomLocation.country,
          city: randomLocation.city,
          latitude: randomLocation.lat,
          longitude: randomLocation.lng
        };
        console.log('Using mock geographic data:', geographicData);
      }
    }

    // Insert analytics data with geographic information
    const { error: insertError } = await supabase
      .from('analytics_views')
      .insert({
        profile_id: profileId,
        viewer_ip: ip,
        user_agent: userAgent,
        referrer: referrer,
        country: geographicData.country,
        city: geographicData.city,
        latitude: geographicData.latitude,
        longitude: geographicData.longitude,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Analytics insert error:', insertError);
      return Response.json({ 
        error: 'Failed to track view', 
        details: insertError.message,
        code: insertError.code 
      }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return Response.json({ error: 'Failed to track view' }, { status: 500 });
  }
} 