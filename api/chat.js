const INVENTORY = [
  { id: 1, name: 'Widget', price: 9.99, quantity: 100, description: 'Basic widget' },
  { id: 2, name: 'Gadget', price: 19.99, quantity: 50, description: 'Gadget device' },
  { id: 3, name: 'Thingamajig', price: 4.99, quantity: 200, description: 'Useful thingamajig' },
  { id: 4, name: 'Alpha', price: 10.0, quantity: 100, description: 'Sample Alpha product' },
  { id: 5, name: 'Beta', price: 20.0, quantity: 60, description: 'Sample Beta product' },
  { id: 6, name: 'Gamma', price: 15.5, quantity: 80, description: 'Sample Gamma product' },
  { id: 7, name: 'Delta', price: 7.25, quantity: 120, description: 'Sample Delta product' },
];

const SYSTEM_PROMPT = `You are a helpful inventory and ordering assistant.
Use this inventory dataset as the source of truth for product questions:
${JSON.stringify(INVENTORY, null, 2)}
Low stock means quantity <= 60 unless the user gives another threshold.
When a user asks for products, answer from the dataset.
When a user wants to order, calculate total price from the dataset and return an order summary.`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body || {};

  if (!message) return res.status(400).json({ error: 'Missing message' });

  const normalizedMessage = message.toLowerCase();
  if (normalizedMessage.includes('low') || normalizedMessage.includes('stock')) {
    const lowStock = INVENTORY.filter((item) => item.quantity <= 60);
    return res.status(200).json({
      response: `Low-stock products (threshold <= 60):\n${lowStock
        .map((item) => `- ${item.name}: ${item.quantity} units ($${item.price})`)
        .join('\n')}`,
      ok: true,
      data: { products: lowStock },
    });
  }

  if (normalizedMessage.includes('product') || normalizedMessage.includes('inventory')) {
    return res.status(200).json({
      response: `Inventory products:\n${INVENTORY
        .map((item) => `- ${item.name}: ${item.quantity} units ($${item.price})`)
        .join('\n')}`,
      ok: true,
      data: { products: INVENTORY },
    });
  }

  if (!process.env.DEEPSEEK_API_KEY) return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY' });

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history
        .filter((item) => item.role && item.content)
        .map((item) => ({
          role: item.role === 'bot' ? 'assistant' : item.role,
          content: item.content,
        })),
      { role: 'user', content: message },
    ];

    const deepseekRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages,
        temperature: 0.2,
      }),
    });

    if (!deepseekRes.ok) {
      const detail = await deepseekRes.text();
      return res.status(502).json({
        error: `DeepSeek error ${deepseekRes.status}`,
        detail,
      });
    }

    const data = await deepseekRes.json();
    const reply = data.choices?.[0]?.message?.content || 'No response.';

    return res.status(200).json({ response: reply, ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
