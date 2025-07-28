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

    // Clean the URL by removing query parameters that might cause issues
    const cleanUrl = postUrl.split('?')[0];
    
    // Extract post ID and author from URL for better fallback data
    let postId = null;
    let authorName = 'LinkedIn User';
    let postTitle = 'LinkedIn Post';
    
    const activityMatch = cleanUrl.match(/activity_(\d+)/);
    const updateMatch = cleanUrl.match(/update\/([^&\s]+)/);
    const authorMatch = cleanUrl.match(/posts\/([^_]+)/);
    
    if (activityMatch) {
      postId = activityMatch[1];
    } else if (updateMatch) {
      postId = updateMatch[1];
    }
    
    if (authorMatch) {
      authorName = authorMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Try to extract title from URL if it contains descriptive text
    const titleMatch = cleanUrl.match(/posts\/[^_]+_([^-\/]+)/);
    if (titleMatch) {
      const urlTitle = titleMatch[1].replace(/-/g, ' ').replace(/_/g, ' ');
      if (urlTitle.length > 10) { // Only use if it's substantial
        postTitle = urlTitle.charAt(0).toUpperCase() + urlTitle.slice(1);
      }
    }

    // Try multiple LinkedIn oEmbed endpoints to get better data
    const oembedUrls = [
      `https://www.linkedin.com/embeds/posts/oembed?url=${encodeURIComponent(cleanUrl)}`,
      `https://www.linkedin.com/embeds/posts/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`,
      `https://www.linkedin.com/embeds/posts/oembed?url=${encodeURIComponent(cleanUrl)}&maxwidth=600&maxheight=400`
    ];
    
    let response = null;
    let oembedData = null;

    // Try each endpoint until we get data
    for (const oembedUrl of oembedUrls) {
      try {
        response = await fetch(oembedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.linkedin.com/',
          },
        });

        if (response.ok) {
          oembedData = await response.json();
          console.log('LinkedIn oEmbed data received:', oembedData);
          break; // Stop if we get data
        }
      } catch (error) {
        console.error('LinkedIn oEmbed fetch error:', error);
        continue;
      }
    }

    if (!response || !response.ok) {
      console.error('LinkedIn oEmbed API error:', response?.status, response?.statusText);
      
      // Return enhanced fallback data with better title
      const fallbackData = {
        title: postTitle !== 'LinkedIn Post' ? postTitle : `LinkedIn Post by ${authorName}`,
        author_name: authorName,
        provider_name: 'LinkedIn',
        provider_url: 'https://www.linkedin.com',
        html: `<div style="color: #666; font-style: italic;">${postTitle !== 'LinkedIn Post' ? postTitle : `LinkedIn post by ${authorName}`}</div>`,
        post_id: postId,
        original_url: postUrl
      };
      
      return NextResponse.json(fallbackData);
    }

    // Add post ID and enhanced metadata to the response
    const enhancedData = {
      ...oembedData,
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