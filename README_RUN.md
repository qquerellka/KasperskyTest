# Инструменты запуска проекта

Поместите эти файлы в **родительскую папку**, которая содержит оба проекта:

```
/your-workspace/
  users-backend/
  users-frontend/
  run_all.sh
  Makefile
```
## Использование
```bash
chmod +x run_all.sh
./run_all.sh
# Backend: http://localhost:4000 (docs: /docs)
# Frontend: http://localhost:5173
```

### Сокращения Makefile
```bash
make setup
make dev
make backend
make frontend
make seed
make backup
make restore
```
