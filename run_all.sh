#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}"

BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}/frontend"

if [[ ! -d "$BACKEND_DIR" || ! -d "$FRONTEND_DIR" ]] ; then
  echo "Not found: users-backend or users-frontend sibling folders."
  echo "Place this script in the common parent folder containing both projects."
  echo "Current: $ROOT_DIR"
  exit 1
fi

echo "➤ Using backend:  $BACKEND_DIR"
echo "➤ Using frontend: $FRONTEND_DIR"

step() { echo -e "\n— $1"; }

step "Backend: install deps"
cd "$BACKEND_DIR"
if [[ ! -d node_modules ]]; then
  npm i
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

step "Backend: prisma generate + db push"
npx prisma generate
npx prisma db push

step "Starting backend on :4000"
( npm run dev ) &
BACK_PID=$!

step "Frontend: install deps"
cd "$FRONTEND_DIR"
if [[ ! -d node_modules ]]; then
  npm i
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

step "Starting frontend on :5173"
( npm run dev ) &
FRONT_PID=$!

trap 'echo; echo "⏹ stopping..."; kill $BACK_PID $FRONT_PID 2>/dev/null || true' INT TERM

echo -e "\n Dev servers are running."
echo "Backend:  http://localhost:4000   (docs: /docs)"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both."

wait
