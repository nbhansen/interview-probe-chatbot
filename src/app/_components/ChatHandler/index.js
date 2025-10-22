"use client";

import { useRef, useState, useEffect } from "react";
import "./style.css";
import { sendMessageToParent } from "@/utils/iframeConnector";
import { addTimeStamp } from "@/utils/addTimeStamp";
import Chat from "@/app/_components/Chat";
import TypingIndicator from "@/app/_components/TypingIndicator";

const dummyData = {
  content: "I am the AI, as a test message",
  role: "assistant",
};

const ChatHandler = ({ prompt, initialMessage, InputArea, a, p }) => {
  const [messages, setMessages] = useState([addTimeStamp(initialMessage)]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputChanged, setInputChanged] = useState(0);
  const [chatEnded, setChatEnded] = useState(false);

  const inputAreaRef = useRef(null);

  let resizeObserver;

  useEffect(() => {
    resizeObserver = new ResizeObserver(() => {
      setInputChanged((prevInputChanged) => prevInputChanged + 1);
    });
    resizeObserver.observe(inputAreaRef.current);
  }, []);

  const sendMessage = async (newMessage) => {
    if (newMessage.replace(".", "").toLowerCase().trim() === "goodbye") {
      sendToQualtrics();
      console.log(newMessage);
      const goodbyeParticipantMessage = {
        role: "user",
        content: newMessage,
        timestamp: Date.now(),
      };
      const goodbyeAssistantMessage = {
        role: "assistant",
        content:
          "Ok, thank you for your answers. You may continue through the button below the chat.",
      };

      setMessages([
        ...messages,
        goodbyeParticipantMessage,
        goodbyeAssistantMessage,
      ]);
      setChatEnded(true);
      return;
    }

    const message = {
      content: newMessage,
      role: "user",
      timestamp: Date.now(),
    };

    const newMessages = [...messages, message];
    setMessages(newMessages);

    setIsTyping(true);
    const AIMessage = await sendOpenAIRequest([prompt, ...newMessages]);
    setIsTyping(false);

    const allMessages = [...newMessages, addTimeStamp(AIMessage)];
    setMessages(allMessages);
  };

  const sendOpenAIRequest = async (payload) => {
    const fetchUrl = `${window.location.origin}/api`;
    const response = await fetch(fetchUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log(result);

    return {
      role: "assistant",
      content: result.choices[0].message.content,
    };
  };

  const sendToQualtrics = () => {
    const payload = {
      event: "chat",
      messages: messages,
      interviewApplication: a,
      interviewProbe: p,
      timestamp: Date.now(),
    };

    sendMessageToParent(payload);
  };

  return (
    <div className="chat">
      <Chat messages={messages} inputChanged={inputChanged} />
      <div ref={inputAreaRef}>
        <TypingIndicator isTyping={isTyping} />
        {!chatEnded && (
          <>
            <div
              style={{
                height: "1px",
                backgroundColor: "grey",
                marginLeft: "8px",
                marginRight: "8px",
              }}
            />
            <InputArea onSend={sendMessage} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHandler;
