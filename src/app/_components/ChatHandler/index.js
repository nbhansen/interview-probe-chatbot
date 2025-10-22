"use client";

import { useRef, useState, useEffect } from "react";
import "./style.css";
import { sendMessageToParent } from "@/utils/iframeConnector";
import { addTimeStamp } from "@/utils/addTimeStamp";
import Chat from "@/app/_components/Chat";
import TypingIndicator from "@/app/_components/TypingIndicator";
import ParticipantIdModal from "@/app/_components/ParticipantIdModal";

const ChatHandler = ({ prompt, initialMessage, InputArea, a, p, condition }) => {
  const [participantId, setParticipantId] = useState(null);
  const [messages, setMessages] = useState([addTimeStamp(initialMessage)]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputChanged, setInputChanged] = useState(0);
  const [chatEnded, setChatEnded] = useState(false);
  const [conversationStartTime] = useState(Date.now());

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
      console.log(newMessage);
      const goodbyeParticipantMessage = {
        role: "user",
        content: newMessage,
        timestamp: Date.now(),
      };
      const goodbyeAssistantMessage = {
        role: "assistant",
        content:
          "Ok, thank you for your answers. Your conversation has been saved. You may continue through the button below the chat.",
      };

      const finalMessages = [
        ...messages,
        goodbyeParticipantMessage,
        goodbyeAssistantMessage,
      ];

      setMessages(finalMessages);
      setChatEnded(true);

      // Save transcript after messages are updated
      setTimeout(() => saveTranscript(), 100);
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

  const saveTranscript = async () => {
    const endTime = Date.now();

    // Save to Qualtrics (existing functionality)
    const qualtricsPayload = {
      event: "chat",
      messages: messages,
      interviewApplication: a,
      interviewProbe: p,
      timestamp: endTime,
    };
    sendMessageToParent(qualtricsPayload);

    // Save to local markdown file
    const transcriptData = {
      participantId,
      topic: condition.t || 'technostress',
      probe: p,
      stage: a,
      messages,
      startTime: conversationStartTime,
      endTime,
    };

    try {
      const response = await fetch('/api/save-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transcriptData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Transcript saved successfully:', result.filename);
      } else {
        console.error('Failed to save transcript:', result.error);
      }
    } catch (error) {
      console.error('Error saving transcript:', error);
    }
  };

  const handleParticipantIdSubmit = (id) => {
    setParticipantId(id);
  };

  return (
    <>
      {!participantId && (
        <ParticipantIdModal onSubmit={handleParticipantIdSubmit} />
      )}

      <div className="chat">
        <Chat messages={messages} inputChanged={inputChanged} />
        <div ref={inputAreaRef}>
          <TypingIndicator isTyping={isTyping} />
          {!chatEnded && participantId && (
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
    </>
  );
};

export default ChatHandler;
