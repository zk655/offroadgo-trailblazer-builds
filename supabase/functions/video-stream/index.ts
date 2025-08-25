import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, range',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const videoId = url.searchParams.get('id');
    const action = url.searchParams.get('action') || 'stream';

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get video details
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .eq('status', 'active')
      .single();

    if (videoError || !video) {
      return new Response(
        JSON.stringify({ error: 'Video not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'view') {
      // Increment view count
      await supabase
        .from('videos')
        .update({ view_count: (video.view_count || 0) + 1 })
        .eq('id', videoId);

      return new Response(
        JSON.stringify({ success: true, view_count: (video.view_count || 0) + 1 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'stream') {
      // Handle video streaming with proper headers
      const videoResponse = await fetch(video.video_url);
      
      if (!videoResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Video file not accessible' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const contentLength = videoResponse.headers.get('content-length');
      const contentType = videoResponse.headers.get('content-type') || 'video/mp4';
      const rangeHeader = req.headers.get('range');

      // Handle range requests for video streaming
      if (rangeHeader && contentLength) {
        const range = parseRange(rangeHeader, parseInt(contentLength));
        
        if (range) {
          const { start, end } = range;
          const chunkSize = end - start + 1;
          
          // Create range request to original video
          const rangeResponse = await fetch(video.video_url, {
            headers: { 'Range': `bytes=${start}-${end}` }
          });

          return new Response(rangeResponse.body, {
            status: 206,
            headers: {
              ...corsHeaders,
              'Content-Type': contentType,
              'Content-Length': chunkSize.toString(),
              'Content-Range': `bytes ${start}-${end}/${contentLength}`,
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'public, max-age=3600',
            }
          });
        }
      }

      // Full video response
      return new Response(videoResponse.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': contentType,
          'Content-Length': contentLength || '0',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600',
        }
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in video-stream function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseRange(rangeHeader: string, fileSize: number) {
  const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
  if (!match) return null;

  const start = parseInt(match[1]);
  const end = match[2] ? parseInt(match[2]) : fileSize - 1;

  if (start >= fileSize || end >= fileSize || start > end) {
    return null;
  }

  return { start, end };
}