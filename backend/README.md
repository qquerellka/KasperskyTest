# Users Backend (Test Task)

Node.js + TypeScript + Express + Prisma (SQLite). Поиск/сортировка/пагинация, группы и membership, Swagger-доки, сиды 350+ пользователей, backup/restore.

## Быстрый старт
```bash
# 1) Node 20+, pnpm|npm
cp .env.example .env

# 2) Установка
npm i

# 3) Генерация клиента и миграции
npx prisma generate
npm run db:migrate

# 4) Сиды (350+ пользователей, 4-6 групп)
npm run db:seed

# 5) Запуск
npm run dev
# Server: http://localhost:4000
# Docs:   http://localhost:4000/docs
```

## API
- `GET /api/users?page=1&perPage=20&q=alex&sort=createdAt:desc&groupId=1&ungroupedOnly=false`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/groups`
- `POST /api/users/:id/groups/:groupId`
- `DELETE /api/users/:id/groups/:groupId`

## Backup / Restore
```bash
# Экспорт
npm run backup -- --dir=./backup --format=jsonl   # или --format=csv

# Импорт (очистит таблицы перед импортом)
npm run restore -- --dir=./backup --format=jsonl --truncate
```

## Переключение на Postgres (опционально)
- В `.env`: `DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"`
- `npm run db:push` или миграции `npm run db:migrate`

## Использовано
Prisma, Express, Swagger UI, tsx, TypeScript.

Автор: Maxim-ready 😉
