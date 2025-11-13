#!/bin/bash

echo "🧹 Clearing Next.js Cache..."
echo ""

# Remove Next.js cache
rm -rf .next

echo "✅ Cache cleared!"
echo ""
echo "📝 Next steps:"
echo "1. Restart dev server: npm run dev"
echo "2. Hard refresh browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
echo "3. Check console - should show Render URL"
echo ""
echo "🔗 Expected backend URL: https://smart-study-assistant-1.onrender.com"

