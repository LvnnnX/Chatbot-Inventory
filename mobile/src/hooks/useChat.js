import { useState } from 'react';
import api from '../services/api';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function appendMessage(text, from = 'user') {
    setMessages((msgs) => [...msgs, { text, from }]);
  }

  async function send(prompt) {
    const userText = (prompt ?? input).trim();
    if (!userText || isLoading) return;

    appendMessage(userText, 'user');
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.postChat(userText, messages);
      const botText = res?.response ?? 'I received the request, but no response was returned.';
      appendMessage(botText, 'bot');
    } catch (e) {
      appendMessage('Backend is unavailable. Check the API URL and make sure the server is running.', 'bot');
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, input, setInput, send, isLoading };
}
