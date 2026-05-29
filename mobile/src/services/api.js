const API_ORIGIN = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
const BASE = API_ORIGIN.endsWith('/api') ? API_ORIGIN : `${API_ORIGIN.replace(/\/$/, '')}/api`;

async function postChat(message, history = []) {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || 'Network response was not ok');
  }

  return res.json();
}

export default { postChat, BASE };
