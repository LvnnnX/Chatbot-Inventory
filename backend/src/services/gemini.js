const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

function toOpenAiMessages(messages) {
    return messages.flatMap((message) => {
        const role = message.role === 'model' ? 'assistant' : message.role;
        const text = (message.parts || [])
            .map((part) => part.text || (part.functionResponse ? JSON.stringify(part.functionResponse) : ''))
            .filter(Boolean)
            .join('\n');

        return text ? [{ role, content: text }] : [];
    });
}

function toOpenAiTools(toolsObj) {
    return toolsObj.map((tool) => ({
        type: 'function',
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema || { type: 'object', properties: {} }
        }
    }));
}

async function chatWithGemini(messages, toolsObj) {
    const systemInstruction = `You are a helpful inventory and ordering assistant.
You have access to tools that can read the product database and create new orders.
When a user asks for products, search or list them.
When a user wants to order, collect the product name, quantity, and calculate totalPrice, then call the create_order tool.`;

    const body = {
        model: DEEPSEEK_MODEL,
        messages: [
            { role: 'system', content: systemInstruction },
            ...toOpenAiMessages(messages)
        ],
        temperature: 0.2
    };

    const tools = toOpenAiTools(toolsObj);
    if (tools.length > 0) body.tools = tools;

    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`DeepSeek API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0]?.message || {};
    const toolCalls = choice.tool_calls || [];

    return {
        text: choice.content || '',
        functionCalls: toolCalls.map((toolCall) => ({
            name: toolCall.function?.name,
            args: JSON.parse(toolCall.function?.arguments || '{}')
        }))
    };
}

module.exports = {
    chatWithGemini,
    // lightweight mock for local testing without network
    mockGemini
};

function mockGemini(prompt, options = {}) {
  return {
    reply: `MOCK_DEEPSEEK:${prompt}`,
    tokens_used: 0,
    ok: true
  };
}
