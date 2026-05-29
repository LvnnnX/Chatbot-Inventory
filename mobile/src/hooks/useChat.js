import React, { useState } from 'react';
import api from '../services/api';
import { SHOW_DEMO, DEMO_MESSAGES } from '../demoSeed';

export default function useChat() {
  // Seed the Pasar demo on first load so the design is visible immediately.
  // Set SHOW_DEMO = false in demoSeed.js for a clean production start.
  const [messages, setMessages] = useState(SHOW_DEMO ? DEMO_MESSAGES : []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function appendMessage(msg) {
    // Accept either a plain string (back-compat) or a full message object.
    const next = typeof msg === 'string' ? { text: msg, from: 'user' } : msg;
    setMessages((msgs) => [...msgs, next]);
  }

  // send() uses the input field; send('text') sends an explicit string
  // (used by quick-reply chips and product "+" buttons).
  async function send(overrideText) {
    const userText = (typeof overrideText === 'string' ? overrideText : input).trim();
    if (!userText) return;

    appendMessage({ text: userText, from: 'user' });
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.postChat(userText);
      // Backend may return plain { response } today, or { response, products, order }
      // once it emits structured data — both render correctly.
      appendMessage({
        text: res?.response ?? '...',
        from: 'bot',
        products: res?.products,
        order: res?.order,
      });
    } catch (e) {
      appendMessage({ text: 'Gagal menghubungi server. Coba lagi ya.', from: 'bot' });
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, input, setInput, send, isLoading };
}
