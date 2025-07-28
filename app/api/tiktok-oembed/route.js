import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json({ error: 'TikTok URL is required' }, { status: 400 });
    }

    // Validate that it's a valid TikTok URL
    const tiktokUrlPattern = /^https?:\/\/(www\.)?(tiktok\.com\/@[^\/]+\/video\/\d+|vm\.tiktok\.com\/[^&\s]+)/;
    if (!tiktokUrlPattern.test(videoUrl)) {
      return NextResponse.json({ error: 'Invalid TikTok URL' }, { status: 400 });
    }

    // Extract video ID from various TikTok URL formats
    let videoId = null;
    let username = null;
    
    // Match TikTok URL patterns
    const tiktokMatch = videoUrl.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/);
    const vmMatch = videoUrl.match(/vm\.tiktok\.com\/([^&\s]+)/);
    
    if (tiktokMatch) {
      username = tiktokMatch[1];
      videoId = tiktokMatch[2];
    } else if (vmMatch) {
      // For vm.tiktok.com URLs, we need to follow the redirect to get the actual URL
      try {
        const response = await fetch(videoUrl, { 
          method: 'HEAD',
          redirect: 'follow'
        });
        const finalUrl = response.url;
        const finalMatch = finalUrl.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/);
        if (finalMatch) {
          username = finalMatch[1];
          videoId = finalMatch[2];
        }
      } catch (error) {
        console.error('Error following TikTok redirect:', error);
      }
    }

    if (!videoId) {
      return NextResponse.json({ error: 'Could not extract video ID from URL' }, { status: 400 });
    }

    // Fetch video data from TikTok oEmbed API
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Prysma/1.0)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('TikTok oEmbed API error:', response.status, response.statusText);
      
      // Return fallback data if API fails
      const fallbackData = {
        title: username ? `@${username}'s TikTok` : 'TikTok Video',
        author_name: username || 'TikTok User',
        provider_name: 'TikTok',
        provider_url: 'https://www.tiktok.com',
        html: `<div style="color: #666; font-style: italic;">TikTok video by ${username || 'TikTok User'}</div>`,
        video_id: videoId,
        username: username,
        original_url: videoUrl,
        thumbnail_url: `https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/${videoId}/image`
      };
      
      return NextResponse.json(fallbackData);
    }

    const data = await response.json();
    
    // Generate thumbnail URL if not provided by oEmbed
    let thumbnailUrl = data.thumbnail_url;
    if (!thumbnailUrl && videoId) {
      // Try multiple TikTok thumbnail URL patterns
      const thumbnailPatterns = [
        `https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/${videoId}/image`,
        `https://p16-sign.tiktokcdn.com/obj/tos-maliva-p-0068/${videoId}/image`,
        `https://p19-sign.tiktokcdn.com/obj/tos-maliva-p-0068/${videoId}/image`
      ];
      thumbnailUrl = thumbnailPatterns[0]; // Use first pattern as fallback
    }
    
    // Add video ID, username and enhanced metadata to the response
    const enhancedData = {
      ...data,
      video_id: videoId,
      username: username,
      provider_name: 'TikTok',
      provider_url: 'https://www.tiktok.com',
      original_url: videoUrl,
      thumbnail_url: thumbnailUrl
    };
    
    // Return the enhanced video data
    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error('Error fetching TikTok video data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch video data',
      details: error.message 
    }, { status: 500 });
  }
} 