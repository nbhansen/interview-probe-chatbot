export async function POST(request) {
  const api_key = process.env.API_KEY;
  
  const messages = await request.json()

  const payload = {
    model: "gpt-4o",
    messages: messages
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + api_key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 201
    })
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
