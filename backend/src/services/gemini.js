const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function chatWithGemini(messages, toolsObj) {
    const systemInstruction = `You are a helpful inventory and ordering assistant.
You have access to tools that can read the product database and create new orders.
When a user asks for products, search or list them.
When a user wants to order, collect the product name, quantity, and calculate totalPrice, then call the create_order tool.`;
    
    const tools = toolsObj.map(t => ({
        name: t.name,
        description: t.description,
        parameters: t.inputSchema || { type: "object", properties: {} }
    }));

    const config = {
        systemInstruction: systemInstruction
    };

    if (tools.length > 0) {
        config.tools = [{ functionDeclarations: tools }];
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: messages,
        config: config
    });

    return response;
}

module.exports = {
    chatWithGemini,
    // lightweight mock for local testing without network
    mockGemini
};

function mockGemini(prompt, options = {}) {
  return {
    reply: `MOCK_GEMINI:${prompt}`,
    tokens_used: 0,
    ok: true
  };
}
