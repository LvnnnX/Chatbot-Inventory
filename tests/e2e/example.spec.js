const { test, expect } = require('@playwright/test');

test('Backend API health logic', async ({ request }) => {
  // Playwright tests targeting the local API mock port
  const response = await request.get('http://localhost:3001/api/health');
  expect(response.ok()).toBeTruthy();
  
  const status = await response.json();
  expect(status.status).toBe('ok');
});
