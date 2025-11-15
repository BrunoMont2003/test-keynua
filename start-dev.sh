#!/bin/bash

echo "🚀 Starting Keynua Contract Creator (Development Mode)"
echo ""

# Generate backend/.env
echo "📝 Generating backend/.env..."
if [ -f .env ]; then
  cp .env backend/.env
else
  echo "⚠️ Warning: .env not found in root. Creating empty backend/.env"
  touch backend/.env
fi
cat >> backend/.env << 'EOF'

PORT=3001
CORS_ORIGIN=http://localhost:5173
HTTP_TIMEOUT_MS=10000
HTTP_RETRIES=3
EOF

# Generate frontend/.env
echo "📝 Generating frontend/.env..."
cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:3001
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "Starting services..."
echo "  - Backend: http://localhost:3001"
echo "  - Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

trap 'kill 0' EXIT

cd backend && npm run dev &
cd frontend && npm run dev &

wait

