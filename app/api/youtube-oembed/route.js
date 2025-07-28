import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    // Validate that it's a valid YouTube URL
    const youtubeUrlPattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[^&\s]+/;
    if (!youtubeUrlPattern.test(videoUrl)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Extract video ID from various YouTube URL formats
    let videoId = null;
    const watchMatch = videoUrl.match(/youtube\.com\/watch\?v=([^&\s]+)/);
    const shortMatch = videoUrl.match(/youtu\.be\/([^&\s]+)/);
    const embedMatch = videoUrl.match(/youtube\.com\/embed\/([^&\s]+)/);
    
    if (watchMatch) {
      videoId = watchMatch[1];
    } else if (shortMatch) {
      videoId = shortMatch[1];
    } else if (embedMatch) {
      videoId = embedMatch[1];
    }

    if (!videoId) {
      return NextResponse.json({ error: 'Could not extract video ID from URL' }, { status: 400 });
    }

    // Fetch video data from YouTube oEmbed API
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Prysma/1.0)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('YouTube oEmbed API error:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Failed to fetch video data',
        status: response.status 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Add video ID and thumbnail URL to the response
    const enhancedData = {
      ...data,
      video_id: videoId,
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      embed_url: `https://www.youtube.com/embed/${videoId}`,
      watch_url: `https://www.youtube.com/watch?v=${videoId}`
    };
    
    // Return the enhanced video data
    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error('Error fetching YouTube video data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch video data',
      details: error.message 
    }, { status: 500 });
  }
} 