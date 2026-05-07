# Mini SaaS Invoice & Subscription

Пет-проєкт для Fullstack Python Developer: SaaS-система для виставлення інвойсів, відстеження оплат і базової підписки.

## Технологічний стек
- Backend: Django, Django REST Framework, SimpleJWT
- Frontend: React (Vite)
- БД: PostgreSQL (або SQLite локально без Docker)
- Інфраструктура: Docker Compose, GitHub Actions

## Реалізовано
- JWT auth: register, token, refresh, current user profile (`/api/auth/...`)
- Invoice API: CRUD для інвойсів з nested items (`/api/invoices/...`)
- Ізоляція даних: користувач бачить лише свої інвойси
- Frontend-демо:
  - Login/Register
  - Create Invoice
  - List Invoices
- Docker-стек: `db + backend + frontend`
- CI: backend tests + frontend build

## Структура
- `backend/` — Django + DRF API
- `frontend/` — React + Vite клієнт
- `.github/workflows/ci.yml` — CI pipeline
- `docker-compose.yml` — локальний fullstack запуск
- `requirements.txt` — Python залежності

## Локальний запуск через Docker
1. Переконайся, що Docker Desktop запущений.
2. Із кореня проєкту виконай:

```bash
docker compose up --build
```

Сервіси:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api`
- Postgres: `localhost:5432`

## Швидка перевірка за 5 хв
1. Відкрий `http://localhost:5173`
2. Створи акаунт на вкладці Register
3. Увійди на вкладці Login
4. Створи інвойс (номер, клієнт, item)
5. Переконайся, що інвойс з'явився у списку

## Швидкий старт API
- Register: `POST /api/auth/register/`
- Login (JWT): `POST /api/auth/token/`
- Refresh: `POST /api/auth/token/refresh/`
- Me: `GET/PATCH /api/auth/me/`
- Invoices: `GET/POST /api/invoices/`
- Invoice detail: `GET/PUT/PATCH/DELETE /api/invoices/{id}/`

## Локальний запуск без Docker
- Backend:
  - `pip install -r requirements.txt`
  - `cd backend && python manage.py migrate && python manage.py runserver`
- Frontend:
  - `cd frontend && npm install && npm run dev`

## Тести
- Backend: `cd backend && python manage.py test`
- Frontend build check: `cd frontend && npm run build`

## Демо-дані
- Створи демо-акаунти і приклад інвойсу:
  - `cd backend && python manage.py seed_demo_data`
- Логіни:
  - `admin_demo / admin12345`
  - `manager_demo / manager12345`

## Runbook
- Покроковий сценарій ручної перевірки:
  - `docs/runbook.md`

