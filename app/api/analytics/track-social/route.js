import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { profileId, platform, source = 'direct' } = await request.json();
    
    if (!profileId || !platform) {
      return new Response(JSON.stringify({ error: 'Profile ID and platform are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create anonymous Supabase client (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // First check if the profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found:', profileId, profileError);
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert social click
    const { error } = await supabase
      .from('analytics_social_clicks')
      .insert({
        profile_id: profileId,
        platform: platform,
        viewer_ip: ip,
        user_agent: userAgent
      });

    if (error) {
      console.error('Social tracking error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to track social click',
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Social click tracked successfully:', { profileId, platform, source });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Social tracking error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 