export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://goona.my.id",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json"
    };

    // HANDLE PREFLIGHT
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    try {

      const bodyDariBrowser =
      await request.json();

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Authorization":
            `Bearer ${env.OPENROUTER_API_KEY}`,

            "Content-Type":
            "application/json"
          },

          body: JSON.stringify(bodyDariBrowser)
        }
      );

      const data =
      await response.text();

      return new Response(data, {
        status: response.status,
        headers: corsHeaders
      });

    } catch (error) {

      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }
  }
};
