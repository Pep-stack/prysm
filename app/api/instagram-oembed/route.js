export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postUrl = searchParams.get('url');

  if (!postUrl) {
    return Response.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Instagram oEmbed endpoint
    const oembedUrl = `https://www.instagram.com/oembed/?url=${encodeURIComponent(postUrl)}`;
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.log('Instagram oEmbed API error:', response.status, response.statusText);
      
      // Return fallback data for Instagram posts
      const postId = extractPostId(postUrl);
      const username = extractUsername(postUrl);
      
      return Response.json({
        type: 'instagram',
        title: 'Instagram Post',
        author_name: username || 'Instagram User',
        author_url: username ? `https://www.instagram.com/${username}/` : 'https://www.instagram.com/',
        provider_name: 'Instagram',
        provider_url: 'https://www.instagram.com',
        html: '<div style="color: #666; font-style: italic;">Instagram post content</div>',
        post_id: postId,
        username: username,
        original_url: postUrl,
        thumbnail_url: null,
        width: 540,
        height: 540,
        version: '1.0'
      });
    }

    // Check if response is JSON or HTML
    const contentType = response.headers.get('content-type');
    
    let rawData = {};
    
    if (contentType && contentType.includes('application/json')) {
      try {
        rawData = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        rawData = {};
      }
    } else {
      // Instagram returns HTML instead of JSON, so we'll use fallback data
      console.log('Instagram returned HTML instead of JSON, using fallback data');
      rawData = {};
    }
    
    // Safely extract data to avoid cyclic references
    const data = {
      title: rawData.title || null,
      author_name: rawData.author_name || null,
      author_url: rawData.author_url || null,
      html: rawData.html || null,
      thumbnail_url: rawData.thumbnail_url || null,
      width: rawData.width || null,
      height: rawData.height || null
    };
    
    // Extract additional information from the URL
    const postId = extractPostId(postUrl);
    const username = extractUsername(postUrl);
    
    // Format the response to match our expected structure
    const formattedData = {
      type: 'instagram',
      title: data.title || 'Instagram Post',
      author_name: data.author_name || username || 'Instagram User',
      author_url: data.author_url || (username ? `https://www.instagram.com/${username}/` : 'https://www.instagram.com/'),
      provider_name: 'Instagram',
      provider_url: 'https://www.instagram.com',
      html: data.html || '<div style="color: #666; font-style: italic;">Instagram post content</div>',
      post_id: postId,
      username: username,
      original_url: postUrl,
      thumbnail_url: data.thumbnail_url || null,
      width: data.width || 540,
      height: data.height || 540,
      version: '1.0'
    };

    // Ensure no cyclic references by creating a clean object
    const cleanFormattedData = JSON.parse(JSON.stringify(formattedData));

    return Response.json(cleanFormattedData);

  } catch (error) {
    console.error('Error fetching Instagram post data:', error);
    
    // Return fallback data
    const postId = extractPostId(postUrl);
    const username = extractUsername(postUrl);
    
    const fallbackData = {
      type: 'instagram',
      title: 'Instagram Post',
      author_name: username || 'Instagram User',
      author_url: username ? `https://www.instagram.com/${username}/` : 'https://www.instagram.com/',
      provider_name: 'Instagram',
      provider_url: 'https://www.instagram.com',
      html: '<div style="color: #666; font-style: italic;">Instagram post content</div>',
      post_id: postId,
      username: username,
      original_url: postUrl,
      thumbnail_url: null,
      width: 540,
      height: 540,
      version: '1.0'
    };
    
    // Ensure no cyclic references by creating a clean object
    const cleanFallbackData = JSON.parse(JSON.stringify(fallbackData));
    
    return Response.json(cleanFallbackData);
  }
}

// Helper function to extract post ID from Instagram URL
function extractPostId(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Handle different Instagram URL formats
    // https://www.instagram.com/p/POST_ID/
    // https://www.instagram.com/reel/POST_ID/
    // https://www.instagram.com/tv/POST_ID/
    
    for (let i = 0; i < pathParts.length; i++) {
      if (['p', 'reel', 'tv'].includes(pathParts[i]) && pathParts[i + 1]) {
        return pathParts[i + 1];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting post ID:', error);
    return null;
  }
}

// Helper function to extract username from Instagram URL
function extractUsername(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(part => part);
    
    // Handle different Instagram URL formats
    // https://www.instagram.com/username/p/POST_ID/
    // https://www.instagram.com/p/POST_ID/
    
    if (pathParts.length >= 2) {
      // If the first part is not a post type, it's likely a username
      if (!['p', 'reel', 'tv'].includes(pathParts[0])) {
        return pathParts[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting username:', error);
    return null;
  }
} 