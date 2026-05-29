// DeepSeek LLM service (OpenAI-compatible API).
// Menggantikan services/gemini.js. MCP tools tetap dipakai apa adanya —
// di sini cuma dikonversi dari MCP JSON Schema ke format function-calling OpenAI.
const OpenAI = require('openai');

// Lazy singleton. Client dibuat saat pertama dipakai, BUKAN saat file di-load,
// supaya server tetap bisa boot tanpa DEEPSEEK_API_KEY (mis. saat dev UI / health
// check). Error key-kosong baru muncul ketika ada request chat sungguhan.
let client = null;
function getClient() {
  if (client) return client;
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error(
      'DEEPSEEK_API_KEY belum di-set. Salin backend/.env.example ke backend/.env lalu isi key-nya.'
    );
  }
  client = new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  });
  return client;
}

// Model string DeepSeek bisa dioverride lewat env (DEEPSEEK_MODEL).
// Catatan: pakai keluarga "deepseek-chat" yang mendukung function calling.
// Model reasoner (R1) TIDAK mendukung tools dengan baik — jangan dipakai di sini.
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

const SYSTEM_PROMPT = `You are a helpful inventory and ordering assistant.
You have access to tools that can read the product database and create new orders.
When a user asks for products, search or list them.
When a user wants to order, collect the product name, quantity, and calculate totalPrice, then call the create_order tool.`;

// Konversi definisi tool MCP -> format tool OpenAI/DeepSeek.
function toOpenAITools(mcpTools) {
  return (mcpTools || []).map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema || { type: 'object', properties: {} },
    },
  }));
}

// messages: array gaya OpenAI (role: system|user|assistant|tool)
// mcpTools: gabungan tool dari MCP sqlite + fs
// return: object message dari choices[0].message (punya .content dan/atau .tool_calls)
async function chatWithDeepSeek(messages, mcpTools) {
  const tools = toOpenAITools(mcpTools);

  const payload = { model: MODEL, messages };
  if (tools.length > 0) {
    payload.tools = tools;
    payload.tool_choice = 'auto';
  }

  const completion = await getClient().chat.completions.create(payload);
  return completion.choices[0].message;
}

module.exports = { chatWithDeepSeek, toOpenAITools, SYSTEM_PROMPT, MODEL };
