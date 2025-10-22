# Interview Probe Chatbot - Enhanced Implementation

An enhanced implementation of a research-validated interview chatbot system using theory-based probes for qualitative data collection in surveys. Based on the CHI 2025 paper by Jacobsen et al.

## Differences from Original CHI 2025 Implementation

This version extends the original research codebase with the following modifications:

### 1. Modular Topic Architecture
The original implementation had hardcoded prompts for technostress research. This version implements a modular topic system where topics are self-contained modules that can be swapped without modifying core code. Topics are located in `src/app/_prompts/topics/` and can be selected via URL parameter.

Currently included topics:
- `technostress` - Original CHI 2025 study content
- `mentalhealth` - Mental health screening with crisis response protocols

### 2. Multi-Provider AI Support
The original used OpenAI GPT-4o exclusively. This version includes an abstraction layer supporting multiple LLM providers with unified response formatting. Current providers:
- OpenAI (GPT-4o, GPT-4 Turbo, GPT-4o-mini)
- Google Gemini (2.5, 2.0 Flash, 1.5 Pro/Flash)

Provider selection is configured via environment variables. The abstraction layer is located in `src/lib/ai-providers.js`.

### 3. Updated Dependencies
- Next.js 14.2.3 → 16.0.0 (Turbopack enabled)
- React 18 → 19.2
- All packages updated to latest stable versions
- Zero security vulnerabilities

### 4. Enhanced Documentation
Added comprehensive documentation for developers working with the codebase, including architecture details and extension guides.

## Setup

### Requirements
- Node.js (latest LTS recommended)
- API key from OpenAI or Google Gemini

### Configuration

Create `.env.local` in the project root:

```bash
AI_PROVIDER=gemini
API_KEY=your_api_key_here
MODEL_NAME=gemini-2.0-flash-exp
```

Available providers:
- `openai` - Requires OpenAI API key from platform.openai.com
- `gemini` - Requires Google API key from aistudio.google.com

Model examples:
- OpenAI: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`
- Gemini: `gemini-2.0-flash-exp`, `gemini-1.5-pro`, `gemini-2.5-flash-preview-0205`

### Installation

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000`

## Usage

### URL Parameters

The chatbot is configured through URL query parameters:

**t** - Topic identifier (optional, default: `technostress`)
- `technostress` - Technology-induced stress
- `mentalhealth` - Mental health screening
- `adhd` - ADHD screening (ASRS v1.1 + Danish ICD-10)

**p** - Interview probe (required, 1-4)
- `1` - Descriptive probe
- `2` - Idiographic probe
- `3` - Clarifying probe
- `4` - Explanatory probe

**a** - Research stage (required, 1-3)
- `1` - Exploration
- `2` - Requirements gathering
- `3` - Evaluation

### Example URLs

Technostress with idiographic probe and exploration stage:
```
http://localhost:3000?p=2&a=1
```

Mental health with descriptive probe and requirements stage:
```
http://localhost:3000?p=1&a=2&t=mentalhealth
```

ADHD screening with idiographic probe and exploration stage:
```
http://localhost:3000?p=2&a=1&t=adhd
```

### Ending Conversations

Users end conversations by typing `goodbye` (case-insensitive). The system then transmits the conversation history to the parent window if embedded in an iframe.

## Interview Probe Framework

The system implements four theory-based interview probes as defined by Robinson (2014):

**Descriptive** - Based on Narrative Theory. Elicits detailed descriptions of events including emotions, thoughts, and contextual circumstances.

**Idiographic** - Based on Autobiographical Memory Theory. Shifts respondents from generic memories to specific, detailed episodic recalls.

**Clarifying** - Based on Self-Disclosure Theory. Requests elaboration on ambiguous or incomplete statements to reveal implicit meanings.

**Explanatory** - Based on Attribution Theory. Explores perceived causal relationships and reasoning behind experiences and behaviors.

### Research Stages

The system supports three stages of HCI research as defined by Lazar et al.:

**Exploration** - Initial discovery of user behaviors, needs, and challenges with technology.

**Requirements Gathering** - Identification of desired improvements and specifications for solutions.

**Evaluation** - Assessment of proposed or implemented solutions.

## Research Validation

The underlying probe framework was validated in a controlled study (N=64) comparing response quality across all 12 probe-stage combinations using Gricean Maxims as quality measures. Key findings:

- Idiographic probe demonstrated highest performance across multiple quality measures
- 59% of participants preferred chatbot interaction over traditional open-ended questions
- Probe effectiveness varies by research stage
- Participants reported comfort discussing sensitive topics due to perceived non-judgmental nature

Full results published in CHI 2025 proceedings.

## Adding Custom Topics

Create a new file in `src/app/_prompts/topics/` following this structure:

```javascript
export const generalDescription = `...chatbot role and instructions...`;
export const topicDescription = `...detailed topic information...`;
export const initialMessages = {
  exploration: `...opening question...`,
  requirements: `...opening question...`,
  evaluation: `...opening question...`
};
export const topicMetadata = {
  id: 'topicname',
  name: 'Display Name',
  description: '...'
};
```

Register the topic in `src/app/_prompts/index.js` by importing and adding to the topics registry. Access via `?t=topicname`.

## Iframe Integration

The chatbot can be embedded in survey platforms using iframe elements. Test integration using:

```
http://localhost:3000/iframetest?height=800&width=900&uri=encoded_chatbot_url
```

Conversation data is transmitted to the parent window via `postMessage()` when conversations conclude.

## Citation

Original research:

Jacobsen, R. M., Cox, S. R., Griggio, C. F., & van Berkel, N. (2025). Chatbots for Data Collection in Surveys: A Comparison of Four Theory-Based Interview Probes. CHI Conference on Human Factors in Computing Systems (CHI '25), April 26-May 01, 2025, Yokohama, Japan. https://doi.org/10.1145/3706598.3714128

## Technical Details

- Framework: Next.js 16.0.0 with App Router
- Language: JavaScript (no TypeScript)
- Build tool: Turbopack (stable)
- React version: 19.2 with React Compiler support
- Deployment: Standard Next.js deployment options (Vercel, Docker, etc.)
