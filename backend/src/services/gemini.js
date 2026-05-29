// LLM mock helper.
// Catatan migrasi: orchestration LLM yang sebenarnya sudah pindah ke DeepSeek
// (lihat services/deepseek.js + routes/chat.js). File ini sengaja dipertahankan
// HANYA untuk mockGemini, yang masih dipakai oleh routes/mcp-test.js (/test-llm)
// dan test suite. Tidak ada lagi dependency ke @google/genai di sini.

// lightweight mock for local testing without network
function mockGemini(prompt, options = {}) {
  return {
    reply: `MOCK_GEMINI:${prompt}`,
    tokens_used: 0,
    ok: true,
  };
}

module.exports = { mockGemini };
