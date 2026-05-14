export default {
  async fetch(request, env) {
    // 1. Definisikan header izin (CORS)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://goona.my.id", // Mengizinkan akses dari domain mana saja (termasuk goona.my.id)
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. Tangani request OPTIONS (Ini yang menyebabkan error di console kamu)
    if (request.method === "OPTIONS") {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders 
      });
    }

    try {
      // 3. Ambil data dari index.html
      const bodyDariBrowser = await request.json();

      // 4. Teruskan ke OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyDariBrowser) 
      });

      const data = await response.json();

      // 5. Kirim balik hasil AI ke browser sambil menyertakan "Surat Izin" (CORS Headers)
      return new Response(JSON.stringify(data), {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        }
      });

    } catch (error) {
      // Jika error, tetap kirim header CORS agar pesan errornya terbaca di browser
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
