/**
 * AI Provider Abstraction Layer
 *
 * Provides a unified interface for different AI providers (OpenAI, Gemini, etc.)
 * Each provider normalizes its response to OpenAI-compatible format.
 */

/**
 * Simple sleep helper for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * OpenAI Provider
 */
async function openaiProvider(messages, apiKey, model) {
  const payload = {
    model: model,
    messages: messages
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data; // Already in correct format
}

/**
 * Gemini Provider
 *
 * Converts OpenAI-style messages to Gemini format and normalizes response
 */
async function geminiProvider(messages, apiKey, model) {
  // Separate system message from conversation messages
  let systemInstruction = null;
  const conversationMessages = [];

  for (const msg of messages) {
    if (msg.role === "system") {
      systemInstruction = { parts: [{ text: msg.content }] };
    } else {
      // Convert OpenAI format to Gemini format
      conversationMessages.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    }
  }

  // Build Gemini request payload
  const payload = {
    contents: conversationMessages
  };

  if (systemInstruction) {
    payload.systemInstruction = systemInstruction;
  }

  // Gemini API endpoint (API key now goes in header, not URL)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Normalize Gemini response to OpenAI format
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("Invalid Gemini API response format");
  }

  return {
    choices: [{
      message: {
        role: "assistant",
        content: data.candidates[0].content.parts[0].text
      }
    }]
  };
}

/**
 * Provider registry
 */
const providers = {
  openai: openaiProvider,
  gemini: geminiProvider
};

/**
 * Send message to configured AI provider with retry logic
 *
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} provider - Provider name (openai, gemini)
 * @param {string} apiKey - API key for the provider
 * @param {string} model - Model name (e.g., gpt-4o, gemini-2.0-flash-exp)
 * @returns {Promise} Normalized response in OpenAI format
 */
export async function sendMessage(messages, provider, apiKey, model) {
  if (!providers[provider]) {
    throw new Error(`Unknown AI provider: ${provider}. Available providers: ${Object.keys(providers).join(", ")}`);
  }

  if (!apiKey) {
    throw new Error(`API key is required for provider: ${provider}`);
  }

  if (!model) {
    throw new Error(`Model name is required for provider: ${provider}`);
  }

  // Simple retry logic: try up to 3 times with 1 second delay
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await providers[provider](messages, apiKey, model);
    } catch (error) {
      lastError = error;

      // Only retry on 503 errors (Service Unavailable)
      const is503Error = error.message && error.message.includes('503');

      if (is503Error && attempt < maxRetries) {
        console.log(`API attempt ${attempt} failed with 503, retrying in 1s...`);
        await sleep(1000);
        continue;
      }

      // Don't retry on other errors or if we've exhausted retries
      throw error;
    }
  }

  throw lastError;
}
