const geminiService = require('../services/gemini');
const mcpClient = require('../mcp/client');

async function handleChat(req, res) {
    const { message, history = [] } = req.body;
    
    try {
        const sqliteTools = mcpClient.getSqliteTools();
        const fsTools = mcpClient.getFsTools();
        const allTools = [...sqliteTools, ...fsTools];

        const messages = [...history];
        messages.push({ role: 'user', parts: [{ text: message }] });

        let aiResponse = await geminiService.chatWithGemini(messages, allTools);
        
        while (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
            const toolCall = aiResponse.functionCalls[0];
            const name = toolCall.name;
            const args = toolCall.args;
            
            let toolResult;
            if (sqliteTools.find(t => t.name === name)) {
                const callRes = await mcpClient.callSqliteTool(name, args);
                toolResult = callRes.content[0].text || JSON.stringify(callRes.content);
            } else if (fsTools.find(t => t.name === name)) {
                const callRes = await mcpClient.callFsTool(name, args);
                toolResult = callRes.content[0].text || JSON.stringify(callRes.content);
            } else {
                toolResult = `{"error": "Tool not found"}`;
            }

            messages.push({ role: 'model', parts: [{ functionCall: toolCall }]});
            messages.push({
                role: 'user',
                parts: [{ functionResponse: { name, response: { result: toolResult } } }]
            });

            aiResponse = await geminiService.chatWithGemini(messages, allTools);
        }

        const reply = aiResponse.text || "I couldn't process that.";
        messages.push({ role: 'model', parts: [{ text: reply }] });

        res.json({ response: reply, history: messages });
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    handleChat
};
