export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    // Ambil data yang dikirim dari file index.html
    const body = await request.json();

    // Panggil OpenRouter secara rahasia di server
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // Kirim kembali jawaban AI ke browser
    return new Response(response.body, {
      headers: { "Content-Type": "text/event-stream" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
