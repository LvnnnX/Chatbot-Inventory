# Technical Specification: MCP Chatbot Mobile Application

## 1. Introduction
- This document defines the technical specification for a mobile chatbot application built with Expo React Native, backed by a Node.js middleware, and integrating two independent Model Context Protocol (MCP) servers: MCP A (SQLite, read) and MCP B (Filesystem, write).
- The system is orchestrated by the Google Gemini API to coordinate the end-to-end conversation flow with reads and writes to the MCP servers.

## 2. System Overview
- Frontend: Expo-based React Native mobile app with a chat interface.
- Backend: Node.js Express-like middleware acting as the MCP client/orchestrator.
- MCP Servers:
  - MCP A: Read-only MCP over SQLite database for inventory data.
  - MCP B: Write-oriented MCP backed by local filesystem for orders.
- Orchestrator: A central component that routes user intents to MCP A for reads and MCP B for writes via Gemini prompts.
- Data flow: User input -> LLM orchestration -> MCP A read operations and/or MCP B write operations -> responses back to UI.

## 3. Goals & Scope
- In-Scope: Full feature set described in the plan: browse inventory via natural language, place orders, modify inventory, and generate basic reports.
- Out-of-Scope (for now): Advanced security features in production, payment processing, push notifications, and complex analytics.

## 4. Architecture & Data Models
- Architecture: Mobile (Expo) <-> Backend (Node.js) <-> MCP A (SQLite) and MCP B (Filesystem) <-> Gemini API for orchestration.
- Data Model (MCP A): Simple product catalog schema: id, name, description, price, quantity.
- Data Model (MCP B): Order structure stored as JSON files in an orders/ directory with fields like orderId, timestamp, items, total, status.
- Security: Development-level authentication; production should adopt OAuth2/OIDC per MCP Authorization guidelines.

## 5. MCP Integration Strategy
- MCP A (Read): Expose read endpoints (e.g., getAllProducts, searchProducts) via MCP and be accessible as a data source for LLM prompts.
- MCP B (Write): Expose write endpoints (e.g., createOrder) that persist to local filesystem with a deterministic file naming scheme in orders/.
- Orchestrator: Central MCP client to coordinate calls to MCP A and MCP B; uses Gemini API for prompt generation and response handling.
- Patterns: Intent Multiplexing at the MCP client surface; Command Pattern for dispatching operations; dual-transport (stdio/HTTP) for MCP servers.

## 6. API Design
- Backend API: /api/chat (POST) to send user messages; returns chat reply. Health endpoints: /api/health.
- MCP test endpoints for internal verification: /api/test-mcp-read, /api/test-mcp-write, /api/test-llm.
- Data interchange format: JSON for requests/responses; schema defined for inventory items and orders.

## 7. Security
- Development: Basic auth token or API key in header for admin routes.
- Production: OAuth 2.0 / OIDC, token rotation, mTLS for service-to-service.

## 8. Deployment
- Docker Compose with services: mobile (Expo dev server), backend (Node.js), MCP A, MCP B, Gemini bridge.
- Local storage for MCP B orders; SQLite data store in MCP A.

## 9. Testing & Verification
- Unit tests for backend MCP read/write modules; snapshot tests for API responses.
- Integration tests for chat flow invoking MCP A read and MCP B write via Gemini prompts.
- End-to-end tests for UI interactions using Playwright (mobile emulation).

## 10. Acceptance Criteria
- The system supports natural language queries against inventory (MCP A).
- Orders can be placed via chat and written to the filesystem (MCP B).
- Gemini-based orchestration correctly mediates between the UI, backend, and MCP servers.
- All core features pass automated verification and basic manual QA.

## Appendix
- References to MCP docs and sample repos are cited in the main plan notes.
