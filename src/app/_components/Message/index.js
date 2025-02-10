import "./style.css";

const Message = ({ children, role }) => {
  let messageClass = 'message';
  let sender = ''

  if(role === 'assistant') {
    messageClass += ' chatgpt'
    sender = 'Chatbot'
  } else {
    messageClass += ' user'
    sender = 'You'
  }

  return (
    <div className="message-wrapper" style={{textAlign: role === 'user' ? 'right' : 'left'}}>
      <div className="message-sender">{sender}</div>
      <div className={messageClass}>
        <p>{children}</p>
      </div>
    </div>
  );
}

export default Message;
