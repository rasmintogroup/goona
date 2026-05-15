export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const body = await request.json();
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      return new Response(response.body, {
        headers: { "Content-Type": "text/event-stream", "Access-Control-Allow-Origin": "*" }
      });
    }
    return env.ASSETS.fetch(request);
  }
};
