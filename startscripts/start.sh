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

# Check if required ports are available
check_port 5001 || exit 1  # Backend port
check_port 5173 || exit 1  # Frontend dev server port

# Start backend service
echo "Starting backend service..."
cd "$(dirname "$0")/news-aggregator" || exit 1
python3 backend/api_gateway/api_gateway.py & 
BACKEND_PID=$!

# Wait for backend to be ready
wait_for_backend

# Start frontend service
echo "Starting frontend service..."
cd ../news-aggregator-frontend || exit 1
npm install
npm run dev & 
FRONTEND_PID=$!

# Handle script termination
cleanup() {
    echo "\nShutting down services..."
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running and show status
echo "${GREEN}All services are running!${NC}"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID