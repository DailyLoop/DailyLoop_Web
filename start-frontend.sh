#!/bin/bash

# ============================================================
# DailyLoop Frontend - Start Script
# ============================================================
# This script starts the Vite development server for the
# DailyLoop Web frontend application.

set -e

echo "=========================================="
echo "Starting DailyLoop Frontend"
echo "=========================================="

# Check if .env.local file exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with the following variables:"
    echo "  - VITE_SUPABASE_URL"
    echo "  - VITE_SUPABASE_ANON_KEY"
    exit 1
fi

# Check if required environment variables are set
required_vars=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.local; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "❌ Error: Missing environment variables in .env.local:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

echo "✓ Environment variables configured"

# Check if node_modules exists, install if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "Starting development server on http://localhost:5173..."
echo "Press Ctrl+C to stop the server"
echo ""

# Start the Vite dev server
npm run dev
