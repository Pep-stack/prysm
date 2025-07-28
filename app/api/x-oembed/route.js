import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tweetUrl = searchParams.get('url');

    if (!tweetUrl) {
      return NextResponse.json({ error: 'Tweet URL is required' }, { status: 400 });
    }

    // Validate that it's a valid X/Twitter URL
    const xUrlPattern = /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[^\/]+\/status\/\d+/;
    if (!xUrlPattern.test(tweetUrl)) {
      return NextResponse.json({ error: 'Invalid X/Twitter URL' }, { status: 400 });
    }

    // Fetch tweet data from X oEmbed API
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}&theme=dark&hide_thread=true&hide_media=false&omit_script=true`;
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Prysma/1.0)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('X oEmbed API error:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Failed to fetch tweet data',
        status: response.status 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Return the tweet data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tweet data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tweet data',
      details: error.message 
    }, { status: 500 });
  }
} 