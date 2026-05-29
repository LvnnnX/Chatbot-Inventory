const express = require('express');
const router = express.Router();
const mcpClient = require('../mcp/client');
const { chatWithDeepSeek, SYSTEM_PROMPT } = require('../services/deepseek');

router.post('/chat', async (req, res) => {
  const message = req.body?.message || '';
  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  // Mode mock kalau API key DeepSeek belum di-set — berguna buat ngetes
  // wiring server + MCP tanpa manggil LLM (dan tanpa biaya token).
  if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your_api_key_here') {
    return res.json({ response: `Mocked reply to: ${message}`, ok: true, mock: true });
  }

  try {
    const sqliteTools = mcpClient.getSqliteTools();
    const fsTools = mcpClient.getFsTools();
    const allTools = [...sqliteTools, ...fsTools];

    // Format pesan gaya OpenAI/DeepSeek (system + user).
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ];

    let aiMsg = await chatWithDeepSeek(messages, allTools);

    // Loop tool-calling. DeepSeek bisa minta beberapa tool sekaligus per giliran.
    let guard = 0;
    while (aiMsg.tool_calls && aiMsg.tool_calls.length > 0 && guard < 8) {
      guard++;

      // Wajib: dorong balik pesan assistant yang berisi tool_calls dulu,
      // baru tiap hasil tool dengan tool_call_id yang cocok.
      messages.push(aiMsg);

      for (const call of aiMsg.tool_calls) {
        const name = call.function.name;
        let args = {};
        try {
          args = JSON.parse(call.function.arguments || '{}');
        } catch (_) {
          args = {};
        }

        let toolResultText;
        try {
          let callRes;
          if (sqliteTools.some((t) => t.name === name)) {
            callRes = await mcpClient.callSqliteTool(name, args);
          } else if (fsTools.some((t) => t.name === name)) {
            callRes = await mcpClient.callFsTool(name, args);
          } else {
            callRes = { content: [{ text: JSON.stringify({ error: 'Tool not found' }) }] };
          }
          toolResultText = callRes.content?.[0]?.text || JSON.stringify(callRes.content);
        } catch (err) {
          toolResultText = JSON.stringify({ error: err.message });
        }

        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: String(toolResultText),
        });
      }

      aiMsg = await chatWithDeepSeek(messages, allTools);
    }

    const replyText = aiMsg.content || "I couldn't generate a response.";
    res.json({ response: replyText, ok: true });
  } catch (err) {
    console.error('Chat Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
