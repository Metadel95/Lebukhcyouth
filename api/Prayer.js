export const config = { runtime: 'edge' };

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxX1L9P-5JW8kuLMe0oUKxZprsUcvlVwkurPGtDNwCoVufPACtlNDZYvmJiguIPAK6X/exec'; // ← paste the URL from Step 2

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { prayer } = await req.json();

    if (!prayer || prayer.trim().length < 5) {
      return new Response(JSON.stringify({ ok: false, error: 'Too short' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const res = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prayer: prayer.trim() })
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}