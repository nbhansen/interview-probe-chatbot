# Interview Probe Chatbot - Enhanced Implementation

An enhanced implementation of a research-validated interview chatbot system using theory-based probes for qualitative data collection in surveys. Based on the CHI 2025 paper by Jacobsen et al.

## Differences from Original CHI 2025 Implementation

This version extends the original research codebase with the following modifications:

### 1. Modular Topic Architecture
The original implementation had hardcoded prompts for technostress research. This version implements a modular topic system where topics are self-contained modules that can be swapped without modifying core code. Topics are located in `src/app/_prompts/topics/` and can be selected via URL parameter.

Currently included topics:
- `technostress` - Original CHI 2025 study content
- `mentalhealth` - Mental health screening with crisis response protocols
- `adhd` - ADHD screening using ASRS v1.1 framework and Danish ICD-10 guidelines

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

### 4. Local Transcript Storage
The original version only transmitted transcripts to parent windows (Qualtrics integration). This version adds comprehensive local storage:
- **Automatic saving**: Conversations saved to filesystem on completion
- **Participant tracking**: Modal dialog collects participant ID before chat starts
- **AI-generated summaries**: Each transcript includes an AI-powered conversation summary
- **Dual format storage**: Both markdown (`.md`) and JSON (`.json`) formats
- **Organized structure**: Files saved to `transcripts/{topic}/{YYYY-MM}/`
- **Rich metadata**: Includes participant ID, topic, probe type, stage, timestamps

Transcript saving is handled by `src/app/api/save-transcript/route.js` which uses the AI provider to generate summaries via `src/utils/generateSummary.js`.

### 5. Enhanced Documentation
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
MODEL_NAME=gemini-2.5-flash

# Optional: Password protect the demo
DEMO_PASSWORD=your-secure-password
```

Available providers:
- `openai` - Requires OpenAI API key from platform.openai.com
- `gemini` - Requires Google API key from aistudio.google.com

Model examples:
- OpenAI: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`
- Gemini: `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.0-flash-exp`, `gemini-1.5-pro`

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

### Password Protection

The chatbot supports optional password protection for demos and controlled access:

**How it works:**
- Set `DEMO_PASSWORD` environment variable to enable protection
- Visitors see a password gate before accessing the chatbot
- Authentication is session-based (persists during browser session)
- If `DEMO_PASSWORD` is not set, password gate is disabled

**Setup:**
1. Add `DEMO_PASSWORD=your-password` to `.env.local` (local development)
2. Add `DEMO_PASSWORD` to Vercel environment variables (production)
3. Share password with authorized demo participants

**Security Note:** This is client-side password protection designed for demos, not production security. It prevents casual access but can be bypassed by determined users.

### Participant Identification

After authentication (if enabled), users must enter a participant ID through a modal dialog. This ID is used for:
- Organizing transcript files
- Tracking participants across multiple sessions
- Associating data with research participants

### Ending Conversations

Users end conversations by typing `goodbye` (case-insensitive). The system then:
1. Saves the transcript to local filesystem with AI-generated summary
2. Transmits conversation history to parent window if embedded in iframe
3. Displays confirmation message and disables further input

Transcripts are saved to: `transcripts/{topic}/{YYYY-MM}/{participantId}_{topic}_p{probe}_{timestamp}.md`

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

## Deployment

### Vercel (Recommended - Free & Easy)

The easiest way to deploy this chatbot for remote demonstrations:

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign up with GitHub
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings

3. **Configure environment variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add these required variables:
     - `AI_PROVIDER` = `gemini` (or `openai`)
     - `API_KEY` = your API key
     - `MODEL_NAME` = `gemini-2.5-flash` (or your chosen model)
   - Add optional password protection:
     - `DEMO_PASSWORD` = your chosen password (e.g., `demo2025`)

4. **Deploy**: Click "Deploy" and wait ~2 minutes

Your chatbot will be live at `https://your-project.vercel.app`

**Note on transcripts**: Vercel uses ephemeral filesystem storage, so transcripts saved during a session won't persist between deployments. The Qualtrics iframe integration (postMessage) will continue to work normally. For persistent storage, consider Railway ($5/month) or add external storage (S3, Firebase).

### Alternative Deployment Options

- **Railway**: ~$5/month, includes persistent disk storage for transcripts
- **DigitalOcean App Platform**: ~$5/month, good for production use
- **Docker + VPS**: Full control, requires Docker configuration

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more options.

## Technical Details

- Framework: Next.js 16.0.0 with App Router
- Language: JavaScript (no TypeScript)
- Build tool: Turbopack (stable)
- React version: 19.2 with React Compiler support
- Deployment: Optimized for Vercel (also supports Docker, traditional hosting)
