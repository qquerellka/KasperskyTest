BACKEND=users-backend
FRONTEND=users-frontend

.PHONY: setup dev backend frontend seed backup restore clean

setup:
	cd $(BACKEND) && cp -n .env.example .env || true && npm i && npx prisma generate && npx prisma db push && npm run db:seed
	cd $(FRONTEND) && cp -n .env.example .env || true && npm i

dev:
	@echo "Starting backend and frontend (Ctrl+C to stop)"
	( cd $(BACKEND) && npm run dev ) & \
	( cd $(FRONTEND) && npm run dev ) & \
	wait

backend:
	cd $(BACKEND) && npm run dev

frontend:
	cd $(FRONTEND) && npm run dev

seed:
	cd $(BACKEND) && npm run db:seed

backup:
	cd $(BACKEND) && npm run backup

restore:
	cd $(BACKEND) && npm run restore -- --truncate

clean:
	rm -f $(BACKEND)/dev.db $(BACKEND)/dev-restore-test.db
