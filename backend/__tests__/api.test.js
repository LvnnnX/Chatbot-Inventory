const request = require('supertest');
const express = require('express');

// Mock the MCP client before requiring routes
jest.mock('../src/mcp/client', () => ({
  initMCPClients: jest.fn().mockResolvedValue(undefined),
  callSqliteTool: jest.fn().mockResolvedValue({ content: [{ text: JSON.stringify([{ id: 1, name: 'Test Product', price: 99.99, quantity: 10 }]) }] }),
  callFsTool: jest.fn().mockResolvedValue({ content: [{ text: JSON.stringify({ orderId: 'ORD-123', status: 'created' }) }] }),
  getSqliteTools: () => [{ name: 'get_products', description: 'Get all products' }],
  getFsTools: () => [{ name: 'create_order', description: 'Create order' }]
}));

// Mock the Gemini service
jest.mock('../src/services/gemini', () => ({
  chatWithGemini: jest.fn().mockResolvedValue({ text: 'Mock Gemini response' }),
  mockGemini: jest.fn().mockReturnValue({ reply: 'MOCK_GEMINI: test', ok: true })
}));

const chatRoutes = require('../src/routes/chat');
const testRoutes = require('../src/routes/mcp-test');
const mcpClient = require('../src/mcp/client');

const app = express();
app.use(express.json());
app.use('/api', chatRoutes);
app.use('/api', testRoutes);

// Health endpoint for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

describe('Backend API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /api/chat', () => {
    it('should return 400 when message is missing', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Missing message');
    });

    it('should return mock response when no GEMINI_API_KEY', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('reply');
      expect(res.body.reply).toContain('Hello');
    });

    it('should handle message with text', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Show me products' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('reply');
    });
  });

  describe('GET /api/test-mcp-read', () => {
    it('should call MCP SQLite client and return products', async () => {
      const res = await request(app).get('/api/test-mcp-read');
      expect(res.statusCode).toBe(200);
      expect(mcpClient.callSqliteTool).toHaveBeenCalledWith('get_products', {});
    });

    it('should handle MCP client errors', async () => {
      mcpClient.callSqliteTool.mockRejectedValueOnce(new Error('MCP error'));
      const res = await request(app).get('/api/test-mcp-read');
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'MCP error');
    });
  });

  describe('POST /api/test-mcp-write', () => {
    it('should create an order with provided data', async () => {
      const orderData = { productName: 'Widget', quantity: 2, totalPrice: 29.99 };
      const res = await request(app)
        .post('/api/test-mcp-write')
        .send(orderData);
      expect(res.statusCode).toBe(200);
      expect(mcpClient.callFsTool).toHaveBeenCalledWith('create_order', orderData);
    });

    it('should use default data when body is empty', async () => {
      const res = await request(app)
        .post('/api/test-mcp-write')
        .send({});
      expect(res.statusCode).toBe(200);
      expect(mcpClient.callFsTool).toHaveBeenCalledWith('create_order', { productName: 'Test', quantity: 1, totalPrice: 10 });
    });

    it('should handle MCP write errors', async () => {
      mcpClient.callFsTool.mockRejectedValueOnce(new Error('Write failed'));
      const res = await request(app)
        .post('/api/test-mcp-write')
        .send({ productName: 'Widget', quantity: 1, totalPrice: 10 });
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Write failed');
    });
  });

  describe('POST /api/test-llm', () => {
    it('should return mock LLM response', async () => {
      const res = await request(app)
        .post('/api/test-llm')
        .send({ message: 'Test message' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });
});
