require('dotenv').config();
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const chatRoutes = require('./routes/chat');
const testRoutes = require('./routes/mcp-test');
const mcpClient = require('./mcp/client');

const app = express();
const corsOptions = {
    origin: [
        'https://chatbot-inventory.vercel.app',
        'https://chatbot-inventory-q4mdi8m4h-lvnnnxs-projects.vercel.app',
        /\.vercel\.app$/,          // izinkan semua preview deployment Vercel
        'http://localhost:19000',   // local dev Expo
        'http://localhost:8081',    // local dev
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};

app.use(express.json());
app.use(cors(corsOptions));
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
