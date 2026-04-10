# 🤖 MCP Chatbot — AI-Powered Inventory Assistant

A conversational AI chatbot that lets users **browse inventory and place orders using natural language**, powered by Google Gemini and the Model Context Protocol (MCP).

> **Chat:** *"Show me all products under $100"*
> **Bot:** *"Here are the products: Wireless Mouse ($49.99), USB-C Hub ($29.99)..."*

---

## ✨ Features

- 💬 **Natural Language Queries** — Ask about inventory in plain language
- 📦 **Place Orders via Chat** — *"Order 2 Mechanical Keyboards"*
- 🔍 **Search Products** — Filter by name or browse all items
- 🧠 **Gemini AI Orchestration** — Context-aware, multi-turn conversations
- 🗄️ **MCP Architecture** — Two independent MCP servers (SQLite read + Filesystem write)
- 📱 **Expo Web App** — Runs in any browser, no app install required

---

## 🏗️ Architecture

```
[User Browser]
      │
      ▼
[Mobile App — Expo/React Native Web]
      │  HTTP REST
      ▼
[Backend — Node.js + Express]  ←──── GEMINI_API_KEY
      │
      ├── MCP SQLite Server   → backend/data/inventory.db  (Read)
      └── MCP Filesystem Server → backend/data/orders/     (Write)
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Expo React Native (Web) | Chat UI |
| Backend | Node.js + Express | API & MCP Orchestrator |
| AI | Google Gemini 2.5 Flash | Natural language understanding |
| MCP A | SQLite via MCP SDK | Read product inventory |
| MCP B | Filesystem via MCP SDK | Write order JSON files |

---

## 📁 Project Structure

```
Chatbot-1/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── mcp/
│   │   │   ├── client.js       # MCP client (connects to both servers)
│   │   │   ├── sqlite-server.js  # MCP A: inventory reads
│   │   │   └── fs-server.js      # MCP B: order writes
│   │   ├── routes/             # Express routes (/api/chat, /api/health)
│   │   ├── services/
│   │   │   └── gemini.js       # Google Gemini integration
│   │   └── index.js            # Server entry point
│   └── data/
│       ├── inventory.db        # SQLite database (auto-created)
│       └── orders/             # Order JSON files (auto-created)
├── mobile/                     # Expo React Native app
│   ├── src/
│   │   ├── components/         # ChatInterface, MessageBubble
│   │   ├── screens/            # ChatScreen
│   │   ├── hooks/              # useChat hook
│   │   └── services/           # API client
│   └── App.js
├── docker-compose.yml          # Docker dev environment
├── docs/                       # API & deployment docs
└── tests/                      # Playwright E2E tests
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/LvnnnX/Chatbot-Inventory.git
cd Chatbot-Inventory
```

### 2. Configure environment variables

**`backend/.env`**
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_PATH=./data/inventory.db
PORT=3001
```

**`mobile/.env`**
```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Install dependencies

```bash
npm run install:all
```

### 4. Run the app

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Backend API | http://localhost:3001 |
| Health Check | http://localhost:3001/api/health |
| Mobile App | http://localhost:19000 |

---

## 🐳 Docker

Run with Docker Compose (no Node.js required locally):

```bash
# Create backend/.env first, then:
docker-compose up --build
```

---

## ☁️ Cloud Deployment

### Backend → Railway

1. Create new project at [railway.app](https://railway.app) → Import GitHub repo
2. Set **Root Directory**: `backend`
3. Set **Start Command**: `node src/index.js`
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `DATABASE_PATH=./data/inventory.db`
   - `PORT=3001`
5. Add a **Persistent Volume** mounted at `/app/backend/data`
6. Generate a public domain

### Mobile → Vercel

1. Update `mobile/.env` with your Railway backend URL
2. Import repo at [vercel.com](https://vercel.com)
3. Set **Root Directory**: `mobile`
4. Set **Build Command**: `npx expo export --platform web`
5. Set **Output Directory**: `dist`
6. Add env var: `EXPO_PUBLIC_API_URL=https://your-backend.up.railway.app/api`

---

## 🔌 API Reference

### `POST /api/chat`

Send a message and get an AI response.

**Request:**
```json
{
  "message": "Show me all products",
  "history": []
}
```

**Response:**
```json
{
  "response": "Here are all products in inventory: ...",
  "history": [...]
}
```

### `GET /api/health`

```json
{ "status": "ok" }
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend unit tests only
npm test --prefix backend

# Mobile tests only
npm test --prefix mobile

# Playwright E2E tests
npx playwright test
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + mobile concurrently |
| `npm run install:all` | Install dependencies for all packages |
| `npm test` | Run all tests |

---

## 📄 License

This project is private and not licensed for public distribution.
