const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const path = require('path');

let sqliteClient = null;
let fsClient = null;
let sqliteTools = [];
let fsTools = [];

async function initMCPClients() {
    sqliteClient = new Client({ name: "backend-sqlite-client", version: "1.0.0" }, { capabilities: {} });
    const sqliteTransport = new StdioClientTransport({
        command: "node",
        args: [path.join(__dirname, "sqlite-server.js")]
    });
    await sqliteClient.connect(sqliteTransport);
    sqliteTools = (await sqliteClient.listTools()).tools;
    console.log("MCP SQLite client connected.");

    fsClient = new Client({ name: "backend-fs-client", version: "1.0.0" }, { capabilities: {} });
    const fsTransport = new StdioClientTransport({
        command: "node",
        args: [path.join(__dirname, "fs-server.js")]
    });
    await fsClient.connect(fsTransport);
    fsTools = (await fsClient.listTools()).tools;
    console.log("MCP FS client connected.");
}

async function callSqliteTool(name, args) {
    const response = await sqliteClient.callTool({ name, arguments: args });
    return response;
}

async function callFsTool(name, args) {
    const response = await fsClient.callTool({ name, arguments: args });
    return response;
}

module.exports = {
    initMCPClients,
    callSqliteTool,
    callFsTool,
    getSqliteTools: () => sqliteTools,
    getFsTools: () => fsTools
};
