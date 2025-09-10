import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Test API: Request received');
  
  return NextResponse.json({ 
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}
