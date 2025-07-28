import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, tiktok_highlights, youtube_highlights, x_highlights, linkedin_highlights')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // Return the highlights data for testing
    return NextResponse.json({
      profile_id: profile.id,
      tiktok_highlights: profile.tiktok_highlights,
      tiktok_highlights_type: typeof profile.tiktok_highlights,
      youtube_highlights: profile.youtube_highlights,
      x_highlights: profile.x_highlights,
      linkedin_highlights: profile.linkedin_highlights,
      message: 'TikTok highlights test endpoint'
    });

  } catch (error) {
    console.error('Error in test TikTok highlights endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 