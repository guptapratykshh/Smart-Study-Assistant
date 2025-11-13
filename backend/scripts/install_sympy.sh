#!/bin/bash
# Install SymPy for Python math solving

echo "🔬 Installing SymPy for mathematical problem solving..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Install SymPy
echo "📦 Installing SymPy..."
pip3 install sympy

# Verify installation
if python3 -c "import sympy; print('✅ SymPy installed successfully, version:', sympy.__version__)" 2>/dev/null; then
    echo "✅ SymPy installation complete!"
    echo ""
    echo "You can now use SymPy for solving complex math problems in math mode."
else
    echo "❌ SymPy installation failed. Please install manually: pip3 install sympy"
    exit 1
fi

