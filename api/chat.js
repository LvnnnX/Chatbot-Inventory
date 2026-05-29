const SYSTEM_PROMPT = `You are a helpful inventory and ordering assistant.
Answer concisely.
If live inventory tools are unavailable, say so clearly and suggest what data the user should provide.`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body || {};

  if (!message) return res.status(400).json({ error: 'Missing message' });
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
