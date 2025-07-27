import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    // Create anonymous Supabase client (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Test direct insertion
    const { data, error } = await supabase
      .from('analytics_views')
      .insert({
        profile_id: 'c90222b4-8900-4f58-9923-bda88825bb69',
        viewer_ip: '127.0.0.1',
        user_agent: 'test-agent',
        device_type: 'desktop',
        browser: 'chrome',
        referrer: 'test',
        source: 'test'
      })
      .select();

    if (error) {
      console.error('Test insert error:', error);
      return new Response(JSON.stringify({ 
        error: 'Insert failed', 
        details: error.message,
        code: error.code
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Test insert error:', error);
    return new Response(JSON.stringify({ 
      error: 'Test failed', 
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 