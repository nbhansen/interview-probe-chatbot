import "./style.css";
import InputArea from "@/app/_components/ChatInput";
import { getInitialAssistantMessage, getSystemPrompt } from "./_prompts";
import ChatHandler from "./_components/ChatHandler";

const HomePage = ({ searchParams }) => {
  const { p, a } = searchParams;

  const systemPrompt = getSystemPrompt(a, p);
  const initialAssistantMessage = getInitialAssistantMessage(a);

  return (
    <div className="app">
      <ChatHandler
        prompt={systemPrompt}
        initialMessage={initialAssistantMessage}
        InputArea={InputArea}
        condition={searchParams}
        a={a}
        p={p}
      />
    </div>
  );
};

export default HomePage;
