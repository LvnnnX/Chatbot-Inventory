# Docker Setup for MCP Chatbot Application

## Overview

This document describes how to run the MCP Chatbot application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- (Optional) Make for simplified commands

## Quick Start

### 1. Environment Configuration

Copy the example environment file and configure it:

`ash
cp backend/.env.example backend/.env
# Edit backend/.env and set your GEMINI_API_KEY
`

### 2. Start All Services

`ash
# Build and start containers
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
`

### 3. Verify Services

`ash
# Check container status
docker-compose ps

# Test backend health
curl http://localhost:3001/api/health
# Expected: {\ status\:\ok\}

# Test MCP read
curl http://localhost:3001/api/test-mcp-read
# Expected: JSON with product data

# Test MCP write
curl -X POST http://localhost:3001/api/test-mcp-write \
  -H \Content-Type: application/json\ \
  -d '{\productName\:\Widget\,\quantity\:2,\totalPrice\:29.99}'
`

## Services

### Backend

- **Image**: Built from ackend/Dockerfile
- **Port**: 3001
- **Volumes**: 
  - ./backend/data ? /usr/src/app/data (SQLite database)
  - ./backend/src ? /usr/src/app/src (Live code reloading)
- **Environment**: Loaded from ackend/.env

### Mobile Dev

- **Image**: 
ode:20
- **Port**: 8081
- **Volumes**:
  - ./mobile ? /usr/src/app (Live code reloading)
- **Note**: Requires Expo CLI to be installed in the mobile directory

## Common Tasks

### View Logs

`ash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
`

### Stop Services

`ash
docker-compose down
`

### Rebuild After Code Changes

`ash
docker-compose up --build
`

### Run Tests in Container

`ash
# Backend tests
docker-compose exec backend npm test

# E2E tests
docker-compose exec backend npx playwright test
`

## Troubleshooting

### Backend Container Exits Immediately

Check logs:
`ash
docker-compose logs backend
`

Common issues:
- Missing GEMINI_API_KEY in .env
- Port 3001 already in use
- SQLite database file permissions

### MCP Client Connection Failed

The MCP clients connect to child processes (sqlite-server.js, fs-server.js).
Ensure these files exist in ackend/src/mcp/.

### Mobile Dev Server Not Loading

The mobile service requires Expo. Install dependencies first:
`ash
cd mobile && npm install
`

## Development Workflow

### With Docker

1. Edit code in ackend/src/ or mobile/
2. Changes to ackend/src/ are reflected immediately via volume mount
3. For mobile, run docker-compose exec mobile-dev npm start to access Metro bundler

### Without Docker

See README.md for local development setup instructions.

## Production Considerations

This configuration is for development. For production:

1. Remove volume mounts for source code
2. Use multi-stage Docker builds
3. Set proper environment variables
4. Configure logging and monitoring
5. Set up proper networking and security
