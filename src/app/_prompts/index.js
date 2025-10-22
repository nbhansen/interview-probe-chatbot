import { evaluationDescription } from "./interviewApplications/evaluation";
import { initialExplorationDescription } from "./interviewApplications/initialExploration";
import { requirementsGatheringDescription } from "./interviewApplications/requirementsGathering";
import { clarifyingProbeDescription } from "./interviewProbes/clarifying";
import { descriptiveProbeDescription } from "./interviewProbes/descriptive";
import { explanatoryProbeDescription } from "./interviewProbes/explanatory";
import { idiographicProbeDescription } from "./interviewProbes/idiographic";

// Import topic modules
import * as technostressTopic from "./topics/technostress";
import * as mentalhealthTopic from "./topics/mentalhealth";
import * as adhdTopic from "./topics/adhd";

// Topic registry - add new topics here
const topics = {
  technostress: technostressTopic,
  mentalhealth: mentalhealthTopic,
  adhd: adhdTopic,
};

// Default topic (can be changed)
const DEFAULT_TOPIC = 'technostress';

const interviewApplicationPrompts = {
  1: initialExplorationDescription,
  2: requirementsGatheringDescription,
  3: evaluationDescription,
};

const interviewProbeprompts = {
  1: descriptiveProbeDescription,
  2: idiographicProbeDescription,
  3: clarifyingProbeDescription,
  4: explanatoryProbeDescription,
};

const generateSystemPromptContent = (applicationKey, probeKey, topicKey = DEFAULT_TOPIC) => {
  const topic = topics[topicKey] || topics[DEFAULT_TOPIC];

  return `
${topic.generalDescription}

###Topic of interest
<<${topic.topicDescription}>>

###Research phase
{{${interviewApplicationPrompts[applicationKey]}}}

###Interview Probe
[[${interviewProbeprompts[probeKey]}]]
`;
};

export const getSystemPrompt = (applicationKey, probeKey, topicKey = DEFAULT_TOPIC) => ({
  role: "system",
  content: generateSystemPromptContent(applicationKey, probeKey, topicKey),
});

// Map application keys to message types
const applicationKeyToMessageType = {
  1: 'exploration',
  2: 'requirements',
  3: 'evaluation',
};

export const getInitialAssistantMessage = (applicationKey, topicKey = DEFAULT_TOPIC) => {
  const topic = topics[topicKey] || topics[DEFAULT_TOPIC];
  const messageType = applicationKeyToMessageType[applicationKey] || 'exploration';

  return {
    role: "assistant",
    content: topic.initialMessages[messageType],
  };
};
