import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { profileId, contactType, source = 'direct' } = await request.json();
    
    if (!profileId || !contactType) {
      return new Response(JSON.stringify({ error: 'Profile ID and contact type are required' }), {
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

    // Insert contact click
    const { error } = await supabase
      .from('analytics_contacts')
      .insert({
        profile_id: profileId,
        contact_type: contactType,
        viewer_ip: ip,
        user_agent: userAgent
      });

    if (error) {
      console.error('Contact tracking error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to track contact click',
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Contact click tracked successfully:', { profileId, contactType, source });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact tracking error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 