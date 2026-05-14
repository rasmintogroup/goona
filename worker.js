export default {
  async fetch(request, env) {
    // Menangani CORS agar browser tidak memblokir request
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Jika browser mengirim request 'preflight' (OPTIONS), langsung balas OK
    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    try {
      const { pesan } = await request.json();

      // Memanggil OpenRouter menggunakan Secret dari Cloudflare
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`, // 'env' dibaca di sini
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp",
          messages: [{ role: "user", content: pesan }]
        })
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...headers, "Content-Type": "application/json" }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers
      });
    }
  }
};
