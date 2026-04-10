const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ensure DB and schema exist (idempotent)
function initDB() {
  const dbPath = path.resolve(__dirname, '../../data/inventory.db');
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('MCP A: Failed to open DB', err);
    } else {
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        description TEXT
      )`, (err) => {
        if (err) return console.error(err);
        // Seed with sample data if table empty
        db.get('SELECT COUNT(*) as c FROM products', (err, row) => {
          if (err) return console.error(err);
          if (row.c === 0) {
            const stmt = db.prepare('INSERT INTO products (name, price, quantity, description) VALUES (?, ?, ?, ?)');
            stmt.run('Laptop Pro', 999.99, 15, 'High performance laptop');
            stmt.run('Wireless Mouse', 49.99, 50, 'Ergonomic wireless mouse');
            stmt.run('Mechanical Keyboard', 89.99, 30, 'RGB mechanical keyboard');
            stmt.run('USB-C Hub', 29.99, 100, '7-in-1 multi port adapter');
            stmt.run('4K Monitor', 299.99, 20, '27-inch 4K UHD display');
            stmt.finalize();
          }
        });
      });
    }
  });
  return db;
}

const db = initDB();

const server = new Server(
  { name: "sqlite-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_products",
        description: "Get a list of all products in the inventory",
        inputSchema: { type: "object", properties: {}, required: [] }
      },
      {
        name: "search_products",
        description: "Search products by name",
        inputSchema: {
          type: "object",
          properties: {
             query: { type: "string", description: "Search query" }
          },
          required: ["query"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_products") {
    return new Promise((resolve) => {
      db.all('SELECT * FROM products', (err, rows) => {
        if (err) resolve({ isError: true, content: [{ type: "text", text: err.message }] });
        else resolve({ content: [{ type: "text", text: JSON.stringify(rows) }] });
      });
    });
  }
  
  if (request.params.name === "search_products") {
    const query = request.params.arguments.query;
    return new Promise((resolve) => {
      db.all('SELECT * FROM products WHERE name LIKE ?', ['%' + query + '%'], (err, rows) => {
        if (err) resolve({ isError: true, content: [{ type: "text", text: err.message }] });
        else resolve({ content: [{ type: "text", text: JSON.stringify(rows) }] });
      });
    });
  }

  throw new Error("Tool not found");
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
