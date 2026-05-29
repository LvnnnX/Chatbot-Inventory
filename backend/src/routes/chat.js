const express = require('express');
const router = express.Router();
const mcpClient = require('../mcp/client');
const { chatWithGemini } = require('../services/gemini');

router.post('/chat', async (req, res) => {
  const message = req.body?.message || '';
  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  // Use mock if NO DeepSeek API key is present
  if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your_api_key_here') {
    return res.json({ reply: `Mocked reply to: ${message}` });
  }

  try {
    const chatHistory = [{ role: 'user', parts: [{ text: message }] }];
    const tools = [...mcpClient.getSqliteTools(), ...mcpClient.getFsTools()];

    let response = await chatWithGemini(chatHistory, tools);

    // Simplistic handling of function call
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const functionName = call.name;
      const args = call.args;

      let toolResult;
      try {
        if (mcpClient.getSqliteTools().some(t => t.name === functionName)) {
          toolResult = await mcpClient.callSqliteTool(functionName, args);
        } else if (mcpClient.getFsTools().some(t => t.name === functionName)) {
          toolResult = await mcpClient.callFsTool(functionName, args);
        } else {
          toolResult = { error: "Unknown tool" };
        }
      } catch (err) {
        toolResult = { error: err.message };
      }

      chatHistory.push({ role: 'user', parts: [{ text: `Function ${functionName} returned: ${JSON.stringify(toolResult)}` }] });
      response = await chatWithGemini(chatHistory, tools);
    }
    
    const replyText = response.text
      || response?.candidates?.[0]?.content?.parts?.[0]?.text
      || "I couldn't generate a response.";
    res.json({ response: replyText, ok: true });
  } catch (err) {
    console.error("Chat Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
