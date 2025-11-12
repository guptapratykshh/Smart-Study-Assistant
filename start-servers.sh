#!/bin/bash

# Smart Study Assistant - Server Management Script
# This script helps you start/stop the backend and frontend servers

echo "🎓 Smart Study Assistant - Server Manager"
echo "=========================================="
echo ""

# Function to kill processes on ports
kill_ports() {
    echo "🛑 Stopping all servers..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    lsof -ti:9000 | xargs kill -9 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "node.*watch" 2>/dev/null
    sleep 2
    echo "✅ All servers stopped"
}

# Function to start servers
start_servers() {
    echo "🚀 Starting servers..."
    echo ""
    
    # Start backend
    echo "📦 Starting Backend (port 9000)..."
    cd "$(dirname "$0")/backend"
    npm run dev > backend.log 2>&1 &
    BACKEND_PID=$!
    sleep 3
    
    # Start frontend
    echo "🎨 Starting Frontend (port 8000)..."
    cd "$(dirname "$0")/frontend"
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    sleep 5
    
    echo ""
    echo "✅ Servers started!"
    echo ""
    echo "📍 Backend:  http://localhost:4000"
    echo "📍 Frontend: http://localhost:3001"
    echo ""
    echo "💡 Open http://localhost:8000 in your browser to use the app!"
    echo ""
    echo "📝 To stop servers, run: ./stop-servers.sh"
}

# Function to check status
check_status() {
    echo "🔍 Checking server status..."
    echo ""
    
    if lsof -ti:9000 > /dev/null 2>&1; then
        echo "✅ Backend (port 9000): Running"
        curl -s http://localhost:4000/health | head -1
    else
        echo "❌ Backend (port 9000): Not running"
    fi
    
    echo ""
    
    if lsof -ti:8000 > /dev/null 2>&1; then
        echo "✅ Frontend (port 8000): Running"
        echo "   Open http://localhost:3001 in your browser"
    else
        echo "❌ Frontend (port 8000): Not running"
    fi
}

# Main menu
case "$1" in
    start)
        kill_ports
        start_servers
        ;;
    stop)
        kill_ports
        ;;
    restart)
        kill_ports
        start_servers
        ;;
    status)
        check_status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        echo ""
        echo "Commands:"
        echo "  start   - Start both backend and frontend servers"
        echo "  stop    - Stop all running servers"
        echo "  restart - Restart all servers"
        echo "  status  - Check if servers are running"
        exit 1
        ;;
esac

