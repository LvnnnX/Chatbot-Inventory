const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

async function postChat(message) {
  const res = await fetch(BASE + '/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export default { postChat, BASE };
