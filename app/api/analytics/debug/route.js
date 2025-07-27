import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get all analytics views
    const { data: allViews, error: allError } = await supabase
      .from('analytics_views')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (allError) {
      return new Response(JSON.stringify({ 
        error: 'Failed to get analytics views', 
        details: allError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get specific user views
    const { data: userViews, error: userError } = await supabase
      .from('analytics_views')
      .select('*')
      .eq('profile_id', 'c90222b4-8900-4f58-9923-bda88825bb69')
      .order('created_at', { ascending: false });

    return new Response(JSON.stringify({ 
      success: true, 
      allViews: allViews || [],
      userViews: userViews || [],
      allViewsCount: allViews?.length || 0,
      userViewsCount: userViews?.length || 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Debug failed', 
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 