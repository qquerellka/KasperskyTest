# Project Runner Toolkit

Put these files in the **parent folder** that contains both projects:

```
/your-workspace/
  users-backend/
  users-frontend/
  run_all.sh
  Makefile
```
## Usage
```bash
chmod +x run_all.sh
./run_all.sh
# Backend: http://localhost:4000 (docs: /docs)
# Frontend: http://localhost:5173
```

### Makefile shortcuts
```bash
make setup
make dev
make backend
make frontend
make seed
make backup
make restore
```
