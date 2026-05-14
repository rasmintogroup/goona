export default {
  async fetch(request, env) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    try {
      // 1. Ambil SEMUA data yang dikirim index.html (termasuk messages & model)
      const bodyDariBrowser = await request.json();

      // 2. Kirim semuanya langsung ke OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        // Pakai bodyDariBrowser agar format messages dan model kamu tetap terjaga
        body: JSON.stringify(bodyDariBrowser) 
      });

      // 3. Jika kamu pakai STREAMING, kita harus kirim balik sebagai stream
      // Tapi untuk tes awal, kita kirim sebagai JSON biasa dulu:
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
