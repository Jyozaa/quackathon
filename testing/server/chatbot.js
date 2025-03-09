// server/chatbot.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
require('dotenv').config(); // Loads .env file

const API_KEY = process.env.GEMINI_API_KEY; 
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = 'gemini-1.5-flash'; 

// Function to check for hardcoded responses
function getHardcodedResponse(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes("hours of operation")) {
    return "Our hours of operation are Monday to Friday, 9 AM to 5 PM.";
  }
  if (lowerPrompt.includes("contact information")) {
    return "You can reach us at info@greenteam.org.uk or call 0300 102 4843.";
  }
  if (lowerPrompt.includes("office")) {
    return "Our main office is The Green Team, The Risk Factory, 20 New Mart Road, Edinburgh, EH14 1RL";
  }
  // Add more conditions here as needed
  return null;
}

router.post('/chatbot', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  // Check for a hardcoded response first
  const hardcoded = getHardcodedResponse(prompt);
  if (hardcoded) {
    return res.json({ generated_text: hardcoded });
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(prompt);
    const text = result.response.text();
    return res.json({ generated_text: text });
  } catch (error) {
    console.error("Error in /chatbot route:", error);
    return res.status(500).json({ error: "Failed to generate content" });
  }
});

module.exports = router;
