/**
 * Generate markdown transcript from conversation data
 */

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDuration = (startTime, endTime) => {
  const durationMs = endTime - startTime;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}min ${seconds}s`;
};

const getProbeLabel = (probeNumber) => {
  const probes = {
    '1': 'Descriptive (Detailed Descriptions)',
    '2': 'Idiographic (Specific Personal Examples)',
    '3': 'Clarifying (Unpacking Statements)',
    '4': 'Explanatory (Reasoning and Causes)',
  };
  return probes[probeNumber] || `Probe ${probeNumber}`;
};

const getStageLabel = (stageNumber) => {
  const stages = {
    '1': 'Exploration (Symptom Discovery)',
    '2': 'Requirements Gathering (Support Needs)',
    '3': 'Evaluation (Intervention Assessment)',
  };
  return stages[stageNumber] || `Stage ${stageNumber}`;
};

export function generateMarkdown({
  participantId,
  topic,
  probe,
  stage,
  messages,
  startTime,
  endTime,
}) {
  const formattedDate = formatTimestamp(startTime);
  const duration = formatDuration(startTime, endTime);
  const messageCount = messages.length;

  // Filter out system messages
  const conversationMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  );

  // Generate conversation transcript
  const transcriptLines = conversationMessages.map((message) => {
    const roleLabel = message.role === 'user' ? 'Participant' : 'Assistant';
    return `**${roleLabel}:** ${message.content}\n`;
  });

  const markdown = `---
participantId: ${participantId}
timestamp: ${new Date(startTime).toISOString()}
topic: ${topic}
probe: ${probe}
stage: ${stage}
duration: ${duration}
messageCount: ${messageCount}
---

# ${topic.charAt(0).toUpperCase() + topic.slice(1)} Screening Interview

**Participant:** ${participantId}
**Date:** ${formattedDate}
**Interview Probe:** ${getProbeLabel(probe)}
**Research Stage:** ${getStageLabel(stage)}

---

## Conversation Transcript

${transcriptLines.join('\n')}

---

## Session Metadata

- **Total Messages:** ${messageCount}
- **Conversation Duration:** ${duration}
- **Ended:** ${endTime ? 'User typed "goodbye"' : 'Session incomplete'}
- **Probe Type:** ${getProbeLabel(probe)}
- **Stage:** ${getStageLabel(stage)}

---

## Notes for Coding

[Add manual notes and ASRS coding here]

---

## AI Summary (Optional)

[Generate summary here if needed]
`;

  return markdown;
}

export function generateFilename({ participantId, topic, probe, timestamp }) {
  const date = new Date(timestamp);
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.toISOString().slice(11, 19).replace(/:/g, '');

  return `${participantId}_${dateStr}_${timeStr}_${topic}_probe${probe}.md`;
}
