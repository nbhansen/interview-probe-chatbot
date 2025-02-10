"use client";

import { useRef, useEffect } from "react";
import "./style.css";
import Message from "../Message";

const Chat = ({ messages, inputChanged }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => scrollToBottom(), [messages, inputChanged]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="message-list">
      {messages.map((m, i) => (
        <Message key={i} role={m.role}>
          {m.content}
        </Message>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chat;
