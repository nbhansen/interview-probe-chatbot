"use client";

import { useState, useRef } from "react";
import "./style.css";

const InputArea = ({ onSend, }) => {
  const [textMessage, setTextMessage] = useState("");
  const inputAreaRef = useRef(null);

  let keyPressed = {};

  const handleEnterKeyEvents = (e) => {
    keyPressed[e.key] = true;

    if (keyPressed.Shift === true && keyPressed.Enter === true) {
    } else if (keyPressed.Enter === true || e.type == 'click') {
      onSend(textMessage)
      setTextMessage("");
      keyPressed = {}

      setTimeout(() => {
        if (inputAreaRef.current) {
          inputAreaRef.current.innerHTML = "";
        }      
      }, 1);
    }
  };

  return (
    <div className="input-container">
      <div
        className="input-field"
        contentEditable="true"
        ref={inputAreaRef}
        onInput={(e) => setTextMessage(e.target.innerText)}
        onKeyDown={(e, i) => {
          handleEnterKeyEvents(e);
        }}
        onKeyUp={(e) => {
          if(e.key === "Shift") {
            keyPressed = {};
          }
        }}
      ></div>
      <div className="button-container">
        <button className="send-button" onClick={handleEnterKeyEvents}>SEND</button>
      </div>
    </div>
  );
};

export default InputArea;
