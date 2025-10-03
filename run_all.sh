#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}"

BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}/frontend"

if [[ ! -d "$BACKEND_DIR" || ! -d "$FRONTEND_DIR" ]] ; then
  echo "Не найдено: папки backend или frontend."
  echo "Поместите этот скрипт в общую родительскую папку, содержащую оба проекта."
  echo "Текущая: $ROOT_DIR"
  exit 1
fi

echo "➤ Используется backend:  $BACKEND_DIR"
echo "➤ Используется frontend: $FRONTEND_DIR"

step() { echo -e "\n— $1"; }

step "Backend: установка зависимостей"
cd "$BACKEND_DIR"
if [[ ! -d node_modules ]]; then
  npm i
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

step "Backend: генерация Prisma + настройка БД"
npx prisma generate
npx prisma db push

step "Запуск backend на :4000"
( npm run dev ) &
BACK_PID=$!

step "Frontend: установка зависимостей"
cd "$FRONTEND_DIR"
if [[ ! -d node_modules ]]; then
  npm i
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

step "Запуск frontend на :5173"
( npm run dev ) &
FRONT_PID=$!

trap 'echo; echo "⏹ остановка..."; kill $BACK_PID $FRONT_PID 2>/dev/null || true' INT TERM

echo -e "\n Серверы разработки запущены."
echo "Backend:  http://localhost:4000   (документация: /docs)"
echo "Frontend: http://localhost:5173"
echo "Нажмите Ctrl+C для остановки."

wait
