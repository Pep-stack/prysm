import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    console.log('🎬 YouTube oEmbed request:', { videoUrl });

    if (!videoUrl) {
      console.error('❌ No YouTube URL provided');
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    // Validate that it's a valid YouTube URL
    const youtubeUrlPattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[^&\s]+/;
    if (!youtubeUrlPattern.test(videoUrl)) {
      console.error('❌ Invalid YouTube URL format:', videoUrl);
      return NextResponse.json({ 
        error: 'Invalid YouTube URL format',
        providedUrl: videoUrl,
        expectedFormats: [
          'https://www.youtube.com/watch?v=VIDEO_ID',
          'https://youtu.be/VIDEO_ID',
          'https://www.youtube.com/embed/VIDEO_ID'
        ]
      }, { status: 400 });
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
      console.error('❌ Could not extract video ID from URL:', videoUrl);
      return NextResponse.json({ 
        error: 'Could not extract video ID from URL',
        providedUrl: videoUrl
      }, { status: 400 });
    }

    console.log('✅ Extracted video ID:', videoId);

    // Fetch video data from YouTube oEmbed API
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    console.log('🌐 Fetching from YouTube oEmbed API:', oembedUrl);
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Prysma/1.0)',
        'Accept': 'application/json',
      },
    });

    console.log('📡 YouTube API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ YouTube oEmbed API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      
      return NextResponse.json({ 
        error: 'Failed to fetch video data from YouTube',
        status: response.status,
        statusText: response.statusText,
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ YouTube API data received:', {
      title: data.title,
      author_name: data.author_name,
      videoId: videoId
    });
    
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
    console.error('💥 Error in YouTube oEmbed API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch video data',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 