import { NextResponse } from 'next/server';
import { supabase } from '../../../src/lib/supabase';

// This route handles the callback after email verification
export async function GET(request) {
  // Get the code and next URL from the URL search parameters
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        // Redirect to login with an error message
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent('Failed to verify email. Please try again.')}`
        );
      }
      
      // If successful, redirect to the dashboard or the next URL
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } catch (error) {
      console.error('Unexpected error during auth callback:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('An unexpected error occurred.')}`
      );
    }
  }

  // If no code is provided, redirect to the login page
  return NextResponse.redirect(`${requestUrl.origin}/login`);
} 