import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with error handling
let supabase = null;
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('API: Supabase URL available:', !!supabaseUrl);
  console.log('API: Supabase Key available:', !!supabaseKey);
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('API: Supabase client initialized successfully');
  } else {
    console.log('API: Supabase environment variables missing, using fallback');
  }
} catch (error) {
  console.error('API: Failed to initialize Supabase client:', error);
}

export async function GET(request) {
  try {
    console.log('API: Request received');
    
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    console.log('API: Checking availability for name:', name);

    if (!name || name.length < 2) {
      console.log('API: Name too short');
      return NextResponse.json({ available: false, error: 'Name too short' });
    }

    const formattedName = name.toLowerCase();
    console.log('API: Formatted name:', formattedName);

    // For now, always use fallback to test if API works
    console.log('API: Using fallback system');
    const commonNames = ['admin', 'test', 'demo', 'user', 'pep', 'john', 'jane'];
    const available = !commonNames.includes(formattedName);
    
    console.log('API: Fallback result - available:', available);
    
    return NextResponse.json({ 
      available,
      name: formattedName,
      debug: {
        searchedFor: formattedName,
        fallback: true,
        commonNames,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API: Availability check error:', error);
    return NextResponse.json({ 
      available: false, 
      error: 'Internal server error',
      debug: {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    });
  }
}
