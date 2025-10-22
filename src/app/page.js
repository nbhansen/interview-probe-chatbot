import "./style.css";
import InputArea from "@/app/_components/ChatInput";
import { getInitialAssistantMessage, getSystemPrompt } from "./_prompts";
import ChatHandler from "./_components/ChatHandler";

const HomePage = async ({ searchParams }) => {
  const params = await searchParams;
  const { p, a, t } = params;

  // t = topic parameter (e.g., 'technostress', 'mentalhealth', 'adhd')
  // If not provided, defaults to 'technostress' in the prompt functions
  const systemPrompt = getSystemPrompt(a, p, t);
  const initialAssistantMessage = getInitialAssistantMessage(a, t);

  return (
    <div className="app">
      <ChatHandler
        prompt={systemPrompt}
        initialMessage={initialAssistantMessage}
        InputArea={InputArea}
        condition={params}
        a={a}
        p={p}
      />
    </div>
  );
};

export default HomePage;
