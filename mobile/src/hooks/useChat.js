import React, { useState } from 'react';
import api from '../services/api';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function appendMessage(text, from = 'user') {
    setMessages((msgs) => [...msgs, { text, from }]);
  }

  async function send() {
    const userText = input.trim();
    if (!userText) return;
    appendMessage(userText, 'user');
    setInput('');
    setIsLoading(true);
    
    try {
      const res = await api.postChat(userText);
      const botText = res?.response ?? '...';
      appendMessage(botText, 'bot');
    } catch (e) {
      appendMessage('Error contacting backend', 'bot');
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, input, setInput, send, isLoading };
}
