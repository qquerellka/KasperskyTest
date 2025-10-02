# Users Frontend (React + Vite + TS)

Готовый каркас фронта под твой backend.

## Быстрый старт
```bash
cp .env.example .env   # при необходимости исправь VITE_API_URL
npm i
npm run dev
# → http://localhost:5173
```
Роуты:
- `/users` — список пользователей: поиск, сортировка, пагинация, фильтр по группе, чекбокс «только без группы», создание/удаление.
- `/users/:id` — карточка пользователя: просмотр/редактирование, добавление/удаление в группы.

Стек: React 18, React Router 6, Redux Toolkit + RTK Query, Vite + TS.
