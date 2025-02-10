# Interview probe chatbot
This project is an implementation of an interview chatbot for surveys that implements four theory-based interview probes for collecting qualitative data across tree different stages of HCI research. In this document, we provide the scripts in order to run the chatbot in the different editions. 

### Disclaimer
- This readme only intends to enable reviewers to run this solution locally as part of the review process, and does not provide a complete description on utilising the chatbot in an online survey. 
- This repository does **not** include an API key. The project needs an OpenAI API key placed in the `.env.local` file with the variable name of: `API_KEY`. *E.g.*: `API_KEY=[YOUR_API_KEY_HERE_WITHOUT_BRACKETS]`

## Getting started
Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Running the project:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with a browser to see the solution. 


## Interview Probes and Stages
This project implement four theory-based interview probes, and three interview stages. This gives a total of 12 conditions. Below we provide direct links to each of the four probes for every condition running in an iframe on the server. 

Inteview probes
- Descriptive
    - [Exploration](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D1%26a%3D1)
    - [Requirements](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D1%26a%3D2)
    - [Evaluation](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D1%26a%3D3)
- Idiographic
    - [Exploration](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D2%26a%3D1)
    - [Requirements](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D2%26a%3D2)
    - [Evaluation](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D2%26a%3D3)
- Clarifying
    - [Exploration](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D3%26a%3D1)
    - [Requirements](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D3%26a%3D2)
    - [Evaluation](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D3%26a%3D3)
- Explanatory
    - [Exploration](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D4%26a%3D1)
    - [Requirements](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D4%26a%3D2)
    - [Evaluation](http://localhost:3000/iframetest?height=800&width=900&uri=http%3A%2F%2Flocalhost%3A3000%3Fp%3D4%26a%3D3)