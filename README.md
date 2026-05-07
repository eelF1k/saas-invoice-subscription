# Mini SaaS Invoice & Subscription

Пет-проєкт SaaS-система для виставлення інвойсів, відстеження оплат і базової підписки.

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

## Архітектура (high-level)
- Auth-модуль видає JWT і керує профілем користувача.
- Invoice API обробляє інвойси та nested items.
- Frontend працює як SPA-клієнт для auth + invoice workflow.
- PostgreSQL використовується як основна БД для docker-сценарію.

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

## Старт API
- Register: `POST /api/auth/register/`
- Login (JWT): `POST /api/auth/token/`
- Refresh: `POST /api/auth/token/refresh/`
- Me: `GET/PATCH /api/auth/me/`
- Invoices: `GET/POST /api/invoices/`
- Invoice detail: `GET/PUT/PATCH/DELETE /api/invoices/{id}/`

## Змінні середовища
- Бекенд читає конфіг через `.env` (див. `.env.example`).
- Для Docker-режиму переконайся, що параметри БД узгоджені з `docker-compose.yml`.
- Для локального запуску без Docker можеш використати SQLite без додаткового налаштування Postgres.

## Локальний запуск без Docker
- Backend:
  - `pip install -r requirements.txt`
  - `cd backend && python manage.py migrate && python manage.py runserver`
- Frontend:
  - `cd frontend && npm install && npm run dev`

## Тести
- Backend: `cd backend && python manage.py test`
- Frontend build check: `cd frontend && npm run build`

## Типові проблеми і швидкі рішення
- `502` з фронтенду: перевір `VITE` proxy target і доступність бекенду.
- Помилка авторизації: перевір, що `Authorization` заголовок передається як `Bearer <token>`.
- Порожній список інвойсів: переконайся, що увійшов під тим самим користувачем, який створював дані.

## Демо-дані
- Створи демо-акаунти і приклад інвойсу:
  - `cd backend && python manage.py seed_demo_data`
- Логіни:
  - `admin_demo / admin12345`
  - `manager_demo / manager12345`

## Runbook
- Покроковий сценарій ручної перевірки:
  - `docs/runbook.md`

