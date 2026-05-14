export default {
  async fetch(request, env) {
    // 1. Header Izin (CORS) - Harus Lengkap
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. Tangani request OPTIONS (Cek pintu dari browser)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 3. Ambil APAPUN yang dikirim dari index.html
      const bodyDariBrowser = await request.json();

      // 4. Kirim ke OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        // Teruskan data mentah agar format 'messages' kamu tidak rusak
        body: JSON.stringify(bodyDariBrowser) 
      });

      // 5. Ambil jawaban dari OpenRouter
      const data = await response.json();

      // 6. Kirim balik ke browser dengan Header CORS
      return new Response(JSON.stringify(data), {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
