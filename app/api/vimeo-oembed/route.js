import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vimeoUrl = searchParams.get('url');

    console.log('🎬 Vimeo oEmbed request:', { vimeoUrl });

    if (!vimeoUrl) {
      console.error('❌ No Vimeo URL provided');
      return NextResponse.json({ error: 'Vimeo URL is required' }, { status: 400 });
    }

    // Validate that it's a valid Vimeo URL
    const vimeoUrlPattern = /^https?:\/\/(www\.)?vimeo\.com\/(\d+)(\?.*)?$/;
    if (!vimeoUrlPattern.test(vimeoUrl)) {
      console.error('❌ Invalid Vimeo URL format:', vimeoUrl);
      return NextResponse.json({ 
        error: 'Invalid Vimeo URL format',
        providedUrl: vimeoUrl,
        expectedFormats: [
          'https://vimeo.com/123456789',
          'https://www.vimeo.com/123456789'
        ]
      }, { status: 400 });
    }

    // Extract Vimeo video ID from URL
    const match = vimeoUrl.match(/vimeo\.com\/(\d+)/);
    if (!match) {
      console.error('❌ Could not extract Vimeo ID from URL:', vimeoUrl);
      return NextResponse.json({ 
        error: 'Could not extract Vimeo ID from URL',
        providedUrl: vimeoUrl
      }, { status: 400 });
    }

    const videoId = match[1];
    console.log('🎬 Extracted Vimeo video ID:', videoId);

    // Try Vimeo's oEmbed endpoint
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}`;
    
    try {
      console.log('🌐 Fetching from Vimeo oEmbed:', oembedUrl);
      const oembedResponse = await fetch(oembedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Prysma/1.0)',
          'Accept': 'application/json',
        },
      });
      
      console.log('📡 Vimeo oEmbed API response status:', oembedResponse.status);
      
      if (oembedResponse.ok) {
        const oembedData = await oembedResponse.json();
        console.log('✅ Vimeo oEmbed success:', {
          title: oembedData.title,
          author_name: oembedData.author_name,
          provider_name: oembedData.provider_name
        });

        // Create response in same format as Spotify oEmbed
        const response = {
          title: oembedData.title || 'Vimeo Video',
          author_name: oembedData.author_name || 'Unknown Creator',
          provider_name: 'Vimeo',
          provider_url: 'https://vimeo.com',
          type: oembedData.type || 'video',
          width: oembedData.width || 640,
          height: oembedData.height || 360,
          html: oembedData.html,
          thumbnail_url: oembedData.thumbnail_url,
          video_id: videoId,
          url: vimeoUrl,
          embed_url: `https://player.vimeo.com/video/${videoId}`,
          duration: oembedData.duration || null
        };

        console.log('📦 Formatted Vimeo response:', response);
        return NextResponse.json(response);
      } else {
        const errorText = await oembedResponse.text();
        console.error('❌ Vimeo oEmbed API error:', {
          status: oembedResponse.status,
          statusText: oembedResponse.statusText,
          errorText: errorText,
          url: vimeoUrl
        });
      }
    } catch (oembedError) {
      console.error('⚠️ Vimeo oEmbed fetch error:', {
        message: oembedError.message,
        stack: oembedError.stack,
        url: vimeoUrl
      });
    }

    // Fallback: Create manual embed data (Vimeo is usually reliable)
    console.log('🔄 Creating manual Vimeo embed data as fallback');
    
    const fallbackData = {
      title: `Vimeo Video`,
      author_name: 'Creator',
      provider_name: 'Vimeo',
      provider_url: 'https://vimeo.com',
      type: 'video',
      width: 640,
      height: 360,
      video_id: videoId,
      url: vimeoUrl,
      embed_url: `https://player.vimeo.com/video/${videoId}`,
      html: `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`,
      fallback: true // Indicate this is fallback data
    };

    console.log('✅ Fallback Vimeo data created:', {
      title: fallbackData.title,
      video_id: fallbackData.video_id,
      embed_url: fallbackData.embed_url
    });
    return NextResponse.json(fallbackData);

  } catch (error) {
    console.error('💥 Vimeo oEmbed API error:', {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
