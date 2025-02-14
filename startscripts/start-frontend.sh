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

# Check if required port is available
check_port 5173 || exit 1  # Frontend dev server port

# Start frontend service
echo "Starting frontend service..."
cd "$(dirname "$0")/news-aggregator-frontend" || exit 1
npm install
npm run dev & 
FRONTEND_PID=$!

# Handle script termination
cleanup() {
    echo "\nShutting down frontend service..."
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running and show status
echo "${GREEN}Frontend service is running!${NC}"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop the service"

# Wait for the process
wait $FRONTEND_PID