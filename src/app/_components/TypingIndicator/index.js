import "./style.css";

const TypingIndicator = ({ isTyping }) =>
  isTyping && <div className="chat-typing-indicator">Chatbot typing...</div>;

export default TypingIndicator;