#!/bin/bash
# Development startup script for MCP Chatbot App
# Usage: ./scripts/start-dev.sh

set -e

echo 'Starting MCP Chatbot App...'

# Start backend
echo 'Starting backend server...'
cd backend
npm install
npm start &
BACKEND_PID=$!

# Wait for backend to be ready
echo 'Waiting for backend to be ready...'
for i in {1..30}; do
  if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo 'Backend is ready!'
    break
  fi
  sleep 1
done

# Start mobile dev server
echo 'Starting mobile dev server...'
cd ../mobile
npm install
npm start &
MOBILE_PID=$!

echo ''
echo 'Services started:'
echo '  Backend:  http://localhost:3001'
echo '  Mobile:   http://localhost:8081'
echo ''
echo 'Press Ctrl+C to stop all services'

# Wait for interrupt
trap 'kill   2>/dev/null; exit' INT TERM
wait
