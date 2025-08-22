import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function DELETE(request) {
  try {
    console.log('🔥 FORCE DELETE: Starting forced account deletion');

    // Check for service role key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: 'Service role key required for forced deletion' },
        { status: 500 }
      );
    }

    // Get user ID from request body
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    console.log('🔥 FORCE DELETE: Target user ID:', userId);

    // Create admin client with service role key
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKey,
      {
        cookies: {
          get() { return undefined; },
          set() {},
          remove() {},
        },
      }
    );

    console.log('🔑 FORCE DELETE: Admin client created');

    // Step 1: Get profile to confirm it exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, name')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ FORCE DELETE: Profile not found:', profileError);
      return NextResponse.json(
        { error: 'Profile not found', details: profileError },
        { status: 404 }
      );
    }

    console.log('✅ FORCE DELETE: Profile found:', profile);

    // Step 2: Force delete profile with admin privileges
    console.log('🗑️ FORCE DELETE: Deleting profile with admin privileges...');
    
    const { error: deleteError, count } = await supabaseAdmin
      .from('profiles')
      .delete({ count: 'exact' })
      .eq('id', userId);

    if (deleteError) {
      console.error('❌ FORCE DELETE: Profile deletion failed:', deleteError);
      return NextResponse.json(
        { error: 'Profile deletion failed', details: deleteError },
        { status: 500 }
      );
    }

    console.log('✅ FORCE DELETE: Profile deleted, rows affected:', count);

    // Step 3: Delete related data
    const deletionTasks = [
      { table: 'analytics', column: 'profile_id' },
      { table: 'testimonials', column: 'user_id' }
    ];

    const deletionResults = {};

    for (const task of deletionTasks) {
      try {
        console.log(`🗑️ FORCE DELETE: Deleting from ${task.table}...`);
        const { error, count } = await supabaseAdmin
          .from(task.table)
          .delete({ count: 'exact' })
          .eq(task.column, userId);

        deletionResults[task.table] = {
          success: !error,
          count: count || 0,
          error: error?.message
        };

        console.log(`✅ FORCE DELETE: ${task.table} - deleted ${count || 0} rows`);
      } catch (error) {
        console.error(`❌ FORCE DELETE: ${task.table} deletion failed:`, error);
        deletionResults[task.table] = {
          success: false,
          count: 0,
          error: error.message
        };
      }
    }

    // Step 4: Try to delete from auth
    let authDeleted = false;
    try {
      console.log('🗑️ FORCE DELETE: Deleting user from auth...');
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('❌ FORCE DELETE: Auth deletion failed:', authError);
      } else {
        console.log('✅ FORCE DELETE: User deleted from auth');
        authDeleted = true;
      }
    } catch (error) {
      console.error('❌ FORCE DELETE: Auth deletion exception:', error);
    }

    console.log('🎉 FORCE DELETE: Forced deletion completed');

    return NextResponse.json({
      success: true,
      message: 'Account forcefully deleted',
      details: {
        userId,
        profileDeleted: count > 0,
        authDeleted,
        deletionResults,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 FORCE DELETE: Error:', error);
    return NextResponse.json(
      { error: 'Force deletion failed', details: error.message },
      { status: 500 }
    );
  }
}
