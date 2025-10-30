/**
 * Generate AI summary of ADHD screening conversation
 *
 * Uses the configured AI provider to create a clinical summary
 * that identifies ASRS symptoms covered and main themes.
 */

import { sendMessage } from '../lib/ai-providers.js';

/**
 * Generate clinical summary of conversation
 *
 * @param {Array} messages - Conversation messages (role + content)
 * @param {string} topic - Topic identifier (e.g., 'adhd')
 * @returns {Promise<string>} Clinical summary text
 */
export async function generateSummary(messages, topic = 'adhd') {
  // Build prompt for summary generation
  const conversationText = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => {
      const speaker = msg.role === 'assistant' ? 'Interviewer' : 'Participant';
      return `${speaker}: ${msg.content}`;
    })
    .join('\n\n');

  const summaryPrompt = topic === 'adhd' ? getADHDSummaryPrompt(conversationText) : getGenericSummaryPrompt(conversationText);

  const summaryMessages = [
    {
      role: 'system',
      content: summaryPrompt.system
    },
    {
      role: 'user',
      content: summaryPrompt.user
    }
  ];

  try {
    const provider = process.env.AI_PROVIDER || 'openai';
    const apiKey = process.env.API_KEY;
    const model = process.env.MODEL_NAME;

    const response = await sendMessage(summaryMessages, provider, apiKey, model);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    return '[Summary generation failed - please review transcript manually]';
  }
}

/**
 * ADHD-specific summary prompt
 */
function getADHDSummaryPrompt(conversationText) {
  return {
    system: `You are a clinical assistant helping to summarize ADHD screening interviews. Your summaries should be concise, professional, and highlight key clinical information for manual ASRS coding.`,
    user: `Please analyze this ADHD screening interview and provide a clinical summary in Danish.

CONVERSATION:
${conversationText}

Please provide a summary with the following sections:

1. **ASRS-symptomer dækket** - List specific ASRS items covered (use notation like A1, A3, B7, etc.) with brief note of what was discussed

2. **Hovedtemaer** - 3-5 main themes that emerged from the conversation

3. **Konkrete eksempler** - Brief bullet list of the most significant concrete examples shared

4. **Funktionel påvirkning** - How these difficulties impact work, relationships, or daily life

5. **Tidsperspektiv og Differential Diagnose** - This is CRITICAL for ADHD diagnosis:
   - Note if childhood patterns were mentioned (required for ADHD diagnosis)
   - If only recent symptoms (last 1-2 years): likely NOT ADHD, possibly stress/depression/burnout
   - If lifelong patterns: consistent with ADHD
   - State clearly: "Livslangt mønster" or "Kun nylige symptomer" or "Uafklaret"

Keep the summary concise (max 300 words) and focused on information useful for clinical review and ASRS coding. Write in Danish.`
  };
}

/**
 * Generic summary prompt for other topics
 */
function getGenericSummaryPrompt(conversationText) {
  return {
    system: `You are a clinical assistant helping to summarize screening interviews. Your summaries should be concise, professional, and highlight key themes.`,
    user: `Please analyze this screening interview and provide a concise summary.

CONVERSATION:
${conversationText}

Provide a summary including:
1. Main themes discussed
2. Key examples shared
3. Impact on daily functioning

Keep it concise (max 200 words).`
  };
}
