export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return new Response('Invalid form data', { status: 400 });
    }

    const imageFile = formData.get('image_file');
    if (!imageFile) {
      return new Response('Missing image_file', { status: 400 });
    }

    // Forward to Remove.bg API
    const rbForm = new FormData();
    rbForm.append('image_file', imageFile);
    rbForm.append('size', 'auto');

    let rbRes;
    try {
      rbRes = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': env.REMOVE_BG_API_KEY },
        body: rbForm,
      });
    } catch (err) {
      return new Response('Failed to reach Remove.bg API', { status: 502 });
    }

    if (!rbRes.ok) {
      const errText = await rbRes.text();
      let message = 'Background removal failed';
      try {
        const errJson = JSON.parse(errText);
        message = errJson.errors?.[0]?.title || message;
      } catch {}
      return new Response(message, {
        status: rbRes.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const resultBuffer = await rbRes.arrayBuffer();
    return new Response(resultBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  },
};
