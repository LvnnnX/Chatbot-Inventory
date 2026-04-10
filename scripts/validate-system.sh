#!/bin/bash
# System validation script mockup
echo "Running backend tests..."
cd backend && npm test
echo "Running mobile tests..."
cd ../mobile && npm test
echo "System valid."
