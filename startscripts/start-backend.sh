#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "${RED}Error: Port $1 is already in use${NC}"
        return 1
    fi
    return 0
}

# Function to check if backend is ready
wait_for_backend() {
    echo "Waiting for backend to be ready..."
    while ! curl -s http://localhost:5000/health >/dev/null; do
        sleep 1
    done
    echo "${GREEN}Backend is ready!${NC}"
}

# Check if required port is available
check_port 8080 || exit 1  # Backend port

# Start backend service
echo "Starting backend service..."
cd "$(dirname "$0")/news-aggregator" || exit 1
python3 backend/api_gateway/api_gateway.py & 
BACKEND_PID=$!

# Wait for backend to be ready
wait_for_backend

# Handle script termination
cleanup() {
    echo "\nShutting down backend service..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running and show status
echo "${GREEN}Backend service is running!${NC}"
echo "Backend PID: $BACKEND_PID"
echo "Press Ctrl+C to stop the service"

# Wait for the process
wait $BACKEND_PID