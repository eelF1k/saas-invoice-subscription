# Runbook (5-minute demo)

## 1) Start services
```bash
docker compose up --build
```

## 2) Apply migrations (if needed)
```bash
docker compose exec backend python manage.py migrate
```

## 3) Seed demo data
```bash
docker compose exec backend python manage.py seed_demo_data
```

## 4) Login flow
- Open `http://localhost:5173`
- Login with:
  - `manager_demo / manager12345`

## 5) Verify core functionality
- Create a new invoice in UI
- Confirm it appears in invoice list
- Optionally check API:
  - `GET /api/invoices/`
  - `GET /api/auth/me/`

## Troubleshooting
- Backend not reachable:
  - check `docker compose ps`
  - check `docker compose logs backend`
- Frontend API calls failing:
  - verify backend service is healthy
  - verify Vite proxy in `frontend/vite.config.ts`
- DB issues:
  - recreate containers with volumes:
    ```bash
    docker compose down -v
    docker compose up --build
    ```

