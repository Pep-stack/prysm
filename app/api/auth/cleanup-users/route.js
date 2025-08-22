import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request) {
  try {
    console.log('🧹 Auth user cleanup job started');
    
    // Check for service role key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: 'Service role key required for cleanup operations' },
        { status: 500 }
      );
    }

    // Create admin client
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

    console.log('🔑 Admin client created for cleanup');

    // Get pending cleanup requests
    const { data: cleanupRequests, error: fetchError } = await supabaseAdmin
      .from('auth_user_cleanup_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10); // Process max 10 at a time

    if (fetchError) {
      console.error('❌ Error fetching cleanup requests:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch cleanup requests' },
        { status: 500 }
      );
    }

    if (!cleanupRequests || cleanupRequests.length === 0) {
      console.log('✅ No pending auth user cleanups');
      return NextResponse.json({
        success: true,
        message: 'No pending cleanups',
        processed: 0
      });
    }

    console.log(`🗑️ Processing ${cleanupRequests.length} auth user cleanups`);

    const results = [];

    // Process each cleanup request
    for (const request of cleanupRequests) {
      const userId = request.user_id;
      console.log(`🗑️ Processing auth deletion for user: ${userId}`);

      try {
        // Delete user from auth
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        
        if (authDeleteError) {
          console.error(`❌ Failed to delete auth user ${userId}:`, authDeleteError);
          
          // Mark as failed
          await supabaseAdmin
            .from('auth_user_cleanup_queue')
            .update({
              status: 'failed',
              processed_at: new Date().toISOString(),
              error_message: authDeleteError.message
            })
            .eq('id', request.id);

          results.push({
            userId,
            success: false,
            error: authDeleteError.message
          });
        } else {
          console.log(`✅ Successfully deleted auth user: ${userId}`);
          
          // Mark as completed
          await supabaseAdmin
            .from('auth_user_cleanup_queue')
            .update({
              status: 'completed',
              processed_at: new Date().toISOString()
            })
            .eq('id', request.id);

          results.push({
            userId,
            success: true
          });
        }
      } catch (error) {
        console.error(`❌ Exception deleting auth user ${userId}:`, error);
        
        // Mark as failed
        await supabaseAdmin
          .from('auth_user_cleanup_queue')
          .update({
            status: 'failed',
            processed_at: new Date().toISOString(),
            error_message: error.message
          })
          .eq('id', request.id);

        results.push({
          userId,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`🎉 Cleanup completed: ${successCount} success, ${failureCount} failures`);

    return NextResponse.json({
      success: true,
      message: `Processed ${cleanupRequests.length} cleanup requests`,
      results: {
        processed: cleanupRequests.length,
        successful: successCount,
        failed: failureCount,
        details: results
      }
    });

  } catch (error) {
    console.error('💥 Error during auth user cleanup:', error);
    return NextResponse.json(
      { error: 'Cleanup job failed', details: error.message },
      { status: 500 }
    );
  }
}
