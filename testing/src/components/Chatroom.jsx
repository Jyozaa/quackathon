import React, { useState, useEffect } from 'react';

const Chatroom = ({ user }) => {
  if (!user) return <div>Loading...</div>;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");


  useEffect(() => {
    fetch("http://localhost:3001/chatroom")
      .then(res => res.json())
      .then(data => setMessages(data.messages))
      .catch(err => console.error("Error fetching messages:", err));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: user.username, text: input };

    setMessages(prev => [...prev, newMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:3001/chatroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
      if (!response.ok) throw new Error("Failed to send message");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="nes-container with-title" style={{ margin: "2rem auto", maxWidth: "600px", padding: "2rem" }}>
      <p className="title">Chatroom</p>
      <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd", padding: "1rem" }}>
        {messages.length === 0 ? <p>No messages yet</p> : messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === user.username ? "right" : "left", margin: "5px 0" }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input 
          type="text" 
          className="nes-input" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..." 
        />
        <button className="nes-btn is-primary ml-2" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatroom;
