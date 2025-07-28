import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if the column exists by trying to select it
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, linkedin_highlights, youtube_highlights, x_highlights')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Database error:', error);
      return Response.json({
        error: 'Failed to fetch profile',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      profile: {
        id: profile.id,
        linkedin_highlights: profile.linkedin_highlights,
        youtube_highlights: profile.youtube_highlights,
        x_highlights: profile.x_highlights,
        linkedin_highlights_type: typeof profile.linkedin_highlights,
        youtube_highlights_type: typeof profile.youtube_highlights,
        x_highlights_type: typeof profile.x_highlights
      }
    });
  } catch (error) {
    console.error('Test API error:', error);
    return Response.json({
      error: 'Failed to test LinkedIn highlights',
      details: error.message
    }, { status: 500 });
  }
} 