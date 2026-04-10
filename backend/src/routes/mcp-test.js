const express = require('express');
const router = express.Router();
const mcpClient = require('../mcp/client');

router.get('/test-mcp-read', async (req, res) => {
  try {
    const response = await mcpClient.callSqliteTool('get_products', {});
    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/test-mcp-write', async (req, res) => {
  try {
    const data = req.body && Object.keys(req.body).length > 0 ? req.body : { productName: "Test", quantity: 1, totalPrice: 10 };
    const response = await mcpClient.callFsTool('create_order', data);
    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/test-llm', async (req, res) => {
  try {
    const { mockGemini } = require('../services/gemini');
    const result = mockGemini(req.body.message || "test");
    res.json({ message: result.reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
