import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postUrl = searchParams.get('url');

    if (!postUrl) {
      return NextResponse.json({ error: 'LinkedIn URL is required' }, { status: 400 });
    }

    // Validate that it's a valid LinkedIn URL
    const linkedinUrlPattern = /^https?:\/\/(www\.)?linkedin\.com\/(posts|feed\/update|pulse)\/[^&\s]+/;
    if (!linkedinUrlPattern.test(postUrl)) {
      return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 });
    }

    // Fetch post data from LinkedIn oEmbed API
    const oembedUrl = `https://www.linkedin.com/embeds/posts/oembed?url=${encodeURIComponent(postUrl)}`;

    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Prysma/1.0)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('LinkedIn oEmbed API error:', response.status, response.statusText);
      return NextResponse.json({
        error: 'Failed to fetch post data',
        status: response.status
      }, { status: response.status });
    }

    const data = await response.json();

    // Extract post ID from URL for additional metadata
    let postId = null;
    const activityMatch = postUrl.match(/activity_(\d+)/);
    const updateMatch = postUrl.match(/update\/([^&\s]+)/);
    
    if (activityMatch) {
      postId = activityMatch[1];
    } else if (updateMatch) {
      postId = updateMatch[1];
    }

    // Add post ID and enhanced metadata to the response
    const enhancedData = {
      ...data,
      post_id: postId,
      provider_name: 'LinkedIn',
      provider_url: 'https://www.linkedin.com',
      original_url: postUrl
    };

    // Return the enhanced post data
    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error('Error fetching LinkedIn post data:', error);
    return NextResponse.json({
      error: 'Failed to fetch post data',
      details: error.message
    }, { status: 500 });
  }
} 