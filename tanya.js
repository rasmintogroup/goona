export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/tanya" && request.method === "POST") {
      // PASTIKAN API KEY TERBACA
      const apiKey = env.OPENROUTER_API_KEY;
      
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "API Key tidak ditemukan di environment" }), { status: 500 });
      }

      try {
        const body = await request.json();
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`, // Menggunakan variabel apiKey yang sudah dicek
            "Content-Type": "application/json",
            "HTTP-Referer": "https://goona.my.id",
            "X-Title": "Goona AI"
          },
          body: JSON.stringify(body)
        });

        // Teruskan response dari OpenRouter
        return new Response(response.body, {
          headers: { 
            "Content-Type": "text/event-stream",
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
