#!/bin/bash

# Stop all Smart Study Assistant servers

echo "🛑 Stopping Smart Study Assistant servers..."
echo ""

lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:9000 | xargs kill -9 2>/dev/null
pkill -f "next dev" 2>/dev/null
pkill -f "node.*server.js" 2>/dev/null
pkill -f "node.*watch" 2>/dev/null

sleep 2

if ! lsof -ti:8000 > /dev/null 2>&1 && ! lsof -ti:9000 > /dev/null 2>&1; then
    echo "✅ All servers stopped successfully!"
else
    echo "⚠️  Some processes may still be running"
fi

