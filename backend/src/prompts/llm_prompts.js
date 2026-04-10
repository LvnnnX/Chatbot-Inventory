// Lightweight LLM prompt templates for MCP orchestration
module.exports = {
  chatGuide: `You are an orchestrator that coordinates reads from MCP A and writes to MCP B via Gemini prompts.`,
  readProductsTemplate: `Return a list of products with id, name, price, quantity, description.`,
  createOrderTemplate: `Create an order payload with orderId, timestamp, items, total, status.`
};
