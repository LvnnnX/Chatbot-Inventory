require('dotenv').config();
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const chatRoutes = require('./routes/chat');
const testRoutes = require('./routes/mcp-test');
const mcpClient = require('./mcp/client');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api', chatRoutes);
app.use('/api', testRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await mcpClient.initMCPClients();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}

startServer();
