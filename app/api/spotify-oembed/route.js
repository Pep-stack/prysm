import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const spotifyUrl = searchParams.get('url');

    console.log('🎵 Spotify oEmbed request:', { spotifyUrl });

    if (!spotifyUrl) {
      console.error('❌ No Spotify URL provided');
      return NextResponse.json({ error: 'Spotify URL is required' }, { status: 400 });
    }

    // Validate that it's a valid Spotify URL
    const spotifyUrlPattern = /^https?:\/\/(open\.)?spotify\.com\/(track|playlist|album|artist)\/[a-zA-Z0-9]+(\?.*)?$/;
    if (!spotifyUrlPattern.test(spotifyUrl)) {
      console.error('❌ Invalid Spotify URL format:', spotifyUrl);
      return NextResponse.json({ 
        error: 'Invalid Spotify URL format',
        providedUrl: spotifyUrl,
        expectedFormats: [
          'https://open.spotify.com/track/TRACK_ID',
          'https://open.spotify.com/playlist/PLAYLIST_ID',
          'https://open.spotify.com/album/ALBUM_ID',
          'https://open.spotify.com/artist/ARTIST_ID'
        ]
      }, { status: 400 });
    }

    // Extract Spotify ID and type from URL
    const match = spotifyUrl.match(/spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/);
    if (!match) {
      console.error('❌ Could not extract Spotify ID from URL:', spotifyUrl);
      return NextResponse.json({ 
        error: 'Could not extract Spotify ID from URL',
        providedUrl: spotifyUrl
      }, { status: 400 });
    }

    const [, contentType, spotifyId] = match;

    console.log('🎵 Extracted Spotify data:', { contentType, spotifyId });

    // Try Spotify's oEmbed endpoint first
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`;
    
    try {
      console.log('🌐 Fetching from Spotify oEmbed:', oembedUrl);
      const oembedResponse = await fetch(oembedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Prysma/1.0)',
          'Accept': 'application/json',
        },
      });
      
      console.log('📡 Spotify oEmbed API response status:', oembedResponse.status);
      
      if (oembedResponse.ok) {
        const oembedData = await oembedResponse.json();
        console.log('✅ Spotify oEmbed success:', {
          title: oembedData.title,
          author_name: oembedData.author_name,
          provider_name: oembedData.provider_name
        });

        // Create response in same format as YouTube oEmbed
        const response = {
          title: oembedData.title || 'Spotify Content',
          author_name: oembedData.author_name || 'Unknown Artist',
          provider_name: 'Spotify',
          provider_url: 'https://spotify.com',
          type: oembedData.type || 'rich',
          width: oembedData.width || 300,
          height: oembedData.height || (contentType === 'track' ? 152 : 380),
          html: oembedData.html,
          thumbnail_url: oembedData.thumbnail_url,
          spotify_id: spotifyId,
          content_type: contentType,
          url: spotifyUrl,
          embed_url: `https://open.spotify.com/embed/${contentType}/${spotifyId}`
        };

        console.log('📦 Formatted Spotify response:', response);
        return NextResponse.json(response);
      } else {
        const errorText = await oembedResponse.text();
        console.error('❌ Spotify oEmbed API error:', {
          status: oembedResponse.status,
          statusText: oembedResponse.statusText,
          errorText: errorText,
          url: spotifyUrl
        });
      }
    } catch (oembedError) {
      console.error('⚠️ Spotify oEmbed fetch error:', {
        message: oembedError.message,
        stack: oembedError.stack,
        url: spotifyUrl
      });
    }

    // Fallback: Create manual embed data (Spotify oEmbed is unreliable)
    console.log('🔄 Creating manual Spotify embed data as fallback');
    
    // Get a better title based on content type
    const titleMap = {
      track: 'Track',
      playlist: 'Playlist', 
      album: 'Album',
      artist: 'Artist Profile'
    };
    
    const fallbackData = {
      title: `Spotify ${titleMap[contentType] || 'Content'}`,
      author_name: 'Artist/Creator',
      provider_name: 'Spotify',
      provider_url: 'https://open.spotify.com',
      type: 'rich',
      width: 300,
      height: contentType === 'track' ? 152 : 380,
      spotify_id: spotifyId,
      content_type: contentType,
      url: spotifyUrl,
      embed_url: `https://open.spotify.com/embed/${contentType}/${spotifyId}?utm_source=oembed`,
      html: `<iframe src="https://open.spotify.com/embed/${contentType}/${spotifyId}?utm_source=oembed" width="300" height="${contentType === 'track' ? 152 : 380}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`,
      fallback: true // Indicate this is fallback data
    };

    console.log('✅ Fallback Spotify data created:', {
      title: fallbackData.title,
      content_type: fallbackData.content_type,
      spotify_id: fallbackData.spotify_id,
      embed_url: fallbackData.embed_url
    });
    return NextResponse.json(fallbackData);

  } catch (error) {
    console.error('💥 Spotify oEmbed API error:', {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
