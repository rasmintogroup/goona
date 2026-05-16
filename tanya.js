export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/tanya" && request.method === "POST") {
      try {
        const body = await request.json();
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://goona.my.id",
            "X-Title": "Goona AI Kepri"
          },
          body: JSON.stringify(body)
        });

        // Buat stream baru agar lebih stabil di Cloudflare
        const { readable, writable } = new TransformStream();
        response.body.pipeTo(writable);

        return new Response(readable, {
          headers: { 
            "Content-Type": "text/event-stream; charset=utf-8", 
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*" 
          }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
