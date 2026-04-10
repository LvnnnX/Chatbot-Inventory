const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const fs = require('fs');
const path = require('path');

const ORDERS_DIR = path.resolve(__dirname, '../../data/orders');
if (!fs.existsSync(ORDERS_DIR)) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true });
}

function writeOrder(order) {
  const id = 'ORD-' + Date.now();
  const filename = path.join(ORDERS_DIR, id + '.json');
  const payload = Object.assign({}, order, {
    orderId: id,
    timestamp: new Date().toISOString()
  });
  fs.writeFileSync(filename, JSON.stringify(payload, null, 2), 'utf8');
  return payload;
}

const server = new Server(
  { name: "fs-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_order",
        description: "Create a new order and save it to the file system",
        inputSchema: {
          type: "object",
          properties: {
             productName: { type: "string" },
             quantity: { type: "number" },
             totalPrice: { type: "number" }
          },
          required: ["productName", "quantity", "totalPrice"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "create_order") {
    try {
      const order = writeOrder(request.params.arguments);
      return {
        content: [{ type: "text", text: `Order created successfully: ${JSON.stringify(order)}` }]
      };
    } catch (e) {
      return {
        isError: true,
        content: [{ type: "text", text: e.message }]
      };
    }
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
