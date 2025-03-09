// src/components/Chatbot.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Chatbot() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello, I'm GreenTeam's AI ChatBot, Let me know how I can help! 👋" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  async function sendMessage() {
    if (!inputValue.trim()) return;
    
    const userMessage = { sender: "user", text: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    const requestBody = { prompt: userMessage.text };

    try {
      const response = await fetch("http://localhost:3001/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      console.log("API Response:", data);
      
      let reply = "No response";
      if (data && data.generated_text) {
        reply = data.generated_text;
      } else {
        console.error("Unexpected response format:", data);
      }
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setIsTyping(false);
    }
  }

  if (isMinimized) {
    return (
      <motion.div
        style={{
          position: "fixed",
          bottom: "70px",
          left: "70px",
          width: "70px",
          height: "70px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: "1px solid black",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1000,
          fontFamily: "monospace"
        }}
        onClick={() => setIsMinimized(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{scale : 1.1}}
        whileTap={{scale : 0.95}}
      >
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        width: "400px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        border: "2px solid #000",
        borderRadius: "8px",
        padding: "15px",
        zIndex: 1000,
        fontFamily: "monospace",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}> Assistant</h3>
        <button
          onClick={() => setIsMinimized(true)}
          style={{ padding: "2px 6px", fontSize: "0.8rem" }}
        >
          _
        </button>
      </div>
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span>{msg.text}</span>
          </div>
        ))}
        {isTyping && (
          <div style={{ margin: "5px 0", textAlign: "left" }}>
            <em>Typing...</em>
          </div>
        )}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: "5px", fontFamily: "monospace" }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: "5px 10px", fontFamily: "monospace" }}>
          Send
        </button>
      </div>
    </motion.div>
  );
}
