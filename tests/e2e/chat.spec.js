const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

test.describe('E2E Chat Integration Tests', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ request }) => {
    // Ensure backend is running
    const response = await request.get(BASE_URL + '/api/health');
    if (!response.ok()) {
      throw new Error('Backend is not running. Start with: cd backend && npm start');
    }
  });

  test('should respond to health check', async ({ request }) => {
    const response = await request.get(BASE_URL + '/api/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('status', 'ok');
  });

  test('should handle chat message and return reply', async ({ request }) => {
    const response = await request.post(BASE_URL + '/api/chat', {
      data: { message: 'Hello, what products do you have?' },
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('reply');
  });

  test('should return 400 for empty message', async ({ request }) => {
    const response = await request.post(BASE_URL + '/api/chat', {
      data: { message: '' },
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error', 'Missing message');
  });

  test('should read products from SQLite via MCP', async ({ request }) => {
    const response = await request.get(BASE_URL + '/api/test-mcp-read');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('content');
    expect(Array.isArray(body.content)).toBeTruthy();
  });

  test('should create order via File System MCP', async ({ request }) => {
    const orderData = {
      productName: 'Test Widget',
      quantity: 3,
      totalPrice: 49.99
    };
    const response = await request.post(BASE_URL + '/api/test-mcp-write', {
      data: orderData,
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('content');
  });

  test('should create order with default data when none provided', async ({ request }) => {
    const response = await request.post(BASE_URL + '/api/test-mcp-write', {
      data: {},
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.ok()).toBeTruthy();
  });

  test('should call LLM service', async ({ request }) => {
    const response = await request.post(BASE_URL + '/api/test-llm', {
      data: { message: 'Test LLM call' },
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('should handle invalid JSON gracefully', async ({ request }) => {
    const response = await request.post(BASE_URL + '/api/chat', {
      data: 'not valid json',
      headers: { 'Content-Type': 'application/json' }
    });
    // Should return error for malformed request
    expect([400, 415, 500]).toContain(response.status());
  });
});

test.describe('Mobile App UI Components', () => {
  test('should have correct API service configuration', () => {
    // Verify API service is configured to point to correct backend
    const fs = require('fs');
    const apiServiceContent = fs.readFileSync(
      process.cwd() + '/mobile/src/services/api.js',
      'utf-8'
    );
    expect(apiServiceContent).toContain('http://localhost:3001/api');
    expect(apiServiceContent).toContain('postChat');
  });

  test('should have chat screen with required components', () => {
    const fs = require('fs');
    const chatScreenContent = fs.readFileSync(
      process.cwd() + '/mobile/src/screens/ChatScreen.js',
      'utf-8'
    );
    expect(chatScreenContent).toContain('TextInput');
    expect(chatScreenContent).toContain('Button');
    expect(chatScreenContent).toContain('useChat');
  });

  test('should have useChat hook with required functions', () => {
    const fs = require('fs');
    const hookContent = fs.readFileSync(
      process.cwd() + '/mobile/src/hooks/useChat.js',
      'utf-8'
    );
    expect(hookContent).toContain('messages');
    expect(hookContent).toContain('send');
  });
});
