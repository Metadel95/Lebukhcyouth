// api/poster.js — Vercel Edge Function
// Fetches your Telegram channel page server-side and extracts the latest photo post.
// Cached for 30 minutes on Vercel's CDN so most visitors get instant response.

export const config = { runtime: 'edge' };

const TG_CHANNEL = 'LebuKHCyouth'; // ← same channel name as in index.html

export default async function handler() {
  try {
    const res = await fetch(`https://t.me/s/${TG_CHANNEL}`, {
      headers: {
        // Mimic a real browser so Telegram returns the full page HTML
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) throw new Error(`Telegram returned ${res.status}`);

    const html = await res.text();

    // ── Parse posts ────────────────────────────────────────────────
    // Each post block looks like:
    //   <div class="tgme_widget_message_wrap ..."> ... </div>
    // We split by that class and scan each chunk for a photo.

    const postChunks = html.split('tgme_widget_message_wrap');
    postChunks.shift(); // first element is content before any post

    let imgSrc = '', caption = '', date = '', postUrl = '';

    // Work backwards (newest first)
    for (let i = postChunks.length - 1; i >= 0; i--) {
      const chunk = postChunks[i];

      // Photo: Telegram renders photos as background-image on .tgme_widget_message_photo_wrap
      const bgMatch = chunk.match(/tgme_widget_message_photo_wrap[^>]*style="[^"]*background-image:url\('([^']+)'\)/i)
                   || chunk.match(/tgme_widget_message_photo_wrap[^>]*style="[^"]*background-image:url\("([^"]+)"\)/i)
                   || chunk.match(/tgme_widget_message_photo_wrap[^>]*style="[^"]*background-image:url\(([^)'"]+)\)/i);

      if (!bgMatch) continue; // no photo in this post

      imgSrc = bgMatch[1];

      // Caption text — strip HTML tags
      const captionMatch = chunk.match(/tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/i);
      caption = captionMatch
        ? captionMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 300)
        : '';

      // Datetime
      const dateMatch = chunk.match(/<time[^>]+datetime="([^"]+)"/i);
      date = dateMatch ? dateMatch[1] : '';

      // Post URL
      const urlMatch = chunk.match(/tgme_widget_message_date[^>]*href="([^"]+)"/i);
      postUrl = urlMatch ? urlMatch[1] : `https://t.me/${TG_CHANNEL}`;

      break; // found the newest photo post — stop
    }

    const payload = imgSrc
      ? { ok: true, imgSrc, caption, date, postUrl }
      : { ok: false, error: 'No photo post found in recent posts' };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache on Vercel's edge CDN for 30 min, allow stale for up to 1 hour
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 200, // return 200 so the client can read the error message
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}