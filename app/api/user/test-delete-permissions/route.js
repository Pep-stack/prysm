import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request) {
  try {
    console.log('🧪 Testing delete permissions');

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Create Supabase client with the token
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get() { return undefined; },
          set() {},
          remove() {},
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token', details: authError?.message },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Test 1: Can we read our profile?
    const { data: profile, error: readError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('📖 Read test:', { success: !readError, error: readError });

    // Test 2: Can we update our profile?
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id);

    console.log('✏️ Update test:', { success: !updateError, error: updateError });

    // Test 3: Create a test row that we can delete
    const testId = `test-${Date.now()}`;
    const { error: insertError } = await supabase
      .from('analytics')
      .insert({
        id: testId,
        profile_id: user.id,
        event_type: 'test',
        created_at: new Date().toISOString()
      });

    console.log('➕ Insert test:', { success: !insertError, error: insertError });

    // Test 4: Try to delete the test row
    let deleteTestResult = null;
    if (!insertError) {
      const { error: deleteError, count } = await supabase
        .from('analytics')
        .delete({ count: 'exact' })
        .eq('id', testId);

      deleteTestResult = { success: !deleteError, error: deleteError, count };
      console.log('🗑️ Delete test:', deleteTestResult);
    }

    // Test 5: Try to delete from profiles (without actually doing it)
    const { count: profileCount, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('id', user.id);

    console.log('📊 Profile count test:', { count: profileCount, error: countError });

    return NextResponse.json({
      success: true,
      userId: user.id,
      tests: {
        read: { success: !readError, error: readError?.message },
        update: { success: !updateError, error: updateError?.message },
        insert: { success: !insertError, error: insertError?.message },
        delete: deleteTestResult,
        profileCount: { count: profileCount, error: countError?.message }
      },
      profile: profile ? {
        id: profile.id,
        email: profile.email,
        name: profile.name
      } : null
    });

  } catch (error) {
    console.error('💥 Test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    );
  }
}
