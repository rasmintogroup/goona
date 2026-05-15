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
            "HTTP-Referer": "https://goona.my.id", // Identitas Web
            "X-Title": "Goona AI Kepri"           // Nama Aplikasi
          },
          body: JSON.stringify(body)
        });

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
