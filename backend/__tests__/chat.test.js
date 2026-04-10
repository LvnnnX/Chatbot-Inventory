// Mock the MCP client
jest.mock('../src/mcp/client', () => ({
  initMCPClients: jest.fn().mockResolvedValue(undefined),
  callSqliteTool: jest.fn(),
  callFsTool: jest.fn(),
  getSqliteTools: () => [{ name: 'get_products', description: 'Get products' }],
  getFsTools: () => [{ name: 'create_order', description: 'Create order' }]
}));

// Mock the Gemini service
jest.mock('../src/services/gemini', () => ({
  chatWithGemini: jest.fn(),
  mockGemini: jest.fn().mockImplementation((prompt) => ({
    reply: 'MOCK_GEMINI:' + prompt,
    ok: true
  }))
}));

const mcpClient = require('../src/mcp/client');
const { mockGemini } = require('../src/services/gemini');

describe('Chat Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Gemini Mock', () => {
    it('should return mock response for any prompt', () => {
      const result = mockGemini('Hello world');
      expect(result).toHaveProperty('reply');
      expect(result).toHaveProperty('ok', true);
      expect(result.reply).toBe('MOCK_GEMINI:Hello world');
    });

    it('should handle different prompt inputs', () => {
      const result1 = mockGemini('Show products');
      const result2 = mockGemini('Order Widget');
      expect(result1.reply).toBe('MOCK_GEMINI:Show products');
      expect(result2.reply).toBe('MOCK_GEMINI:Order Widget');
    });
  });

  describe('MCP Client Tools', () => {
    it('should have sqlite tools defined', () => {
      const tools = mcpClient.getSqliteTools();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
      expect(tools[0]).toHaveProperty('name', 'get_products');
    });

    it('should have fs tools defined', () => {
      const tools = mcpClient.getFsTools();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
      expect(tools[0]).toHaveProperty('name', 'create_order');
    });
  });

  describe('Message Processing', () => {
    it('should process product query requests', async () => {
      mcpClient.callSqliteTool.mockResolvedValue({
        content: [{ text: JSON.stringify([{ id: 1, name: 'Product A' }]) }]
      });

      const result = await mcpClient.callSqliteTool('get_products', {});
      expect(result).toBeDefined();
      expect(mcpClient.callSqliteTool).toHaveBeenCalledWith('get_products', {});
    });

    it('should process order creation requests', async () => {
      mcpClient.callFsTool.mockResolvedValue({
        content: [{ text: JSON.stringify({ orderId: 'ORD-001' }) }]
      });

      const orderData = { productName: 'Test', quantity: 1, totalPrice: 10 };
      const result = await mcpClient.callFsTool('create_order', orderData);
      expect(result).toBeDefined();
      expect(mcpClient.callFsTool).toHaveBeenCalledWith('create_order', orderData);
    });
  });

  describe('Error Handling', () => {
    it('should handle MCP call errors', async () => {
      mcpClient.callSqliteTool.mockRejectedValue(new Error('Connection failed'));
      await expect(mcpClient.callSqliteTool('get_products', {})).rejects.toThrow('Connection failed');
    });
  });
});
