import { sendMessage } from "@/lib/ai-providers";

export async function POST(request) {
  // Get configuration from environment variables
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey = process.env.API_KEY;
  const model = process.env.MODEL_NAME;

  // Validate required configuration
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API_KEY not configured in environment" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }

  if (!model) {
    return new Response(
      JSON.stringify({ error: "MODEL_NAME not configured in environment" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }

  try {
    const messages = await request.json();

    // Send message through configured provider
    const data = await sendMessage(messages, provider, apiKey, model);

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 201
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process AI request"
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
