# Mini SaaS Invoice & Subscription

## Назва проєкту
Mini SaaS Invoice & Subscription

## Це мій пет проєкт про...
Це мій пет проєкт про fullstack SaaS-сервіс для інвойсів, авторизації користувачів та базового білінг-флоу.

## Технологічний стек
- Backend: Django, Django REST Framework, SimpleJWT
- Frontend: React (Vite)
- БД: PostgreSQL (або SQLite локально)
- Інфраструктура: Docker Compose, GitHub Actions

## Що реалізовано
- JWT авторизація: register/login/refresh/profile.
- CRUD API для інвойсів з nested items.
- Ізоляція даних по користувачу.
- Frontend для login/register/create/list invoices.
- CI перевірки бекенду і збірка фронтенду.

## Структура
- `backend/` — Django + DRF API
- `frontend/` — React клієнт
- `docs/` — документація та runbook
- `docker-compose.yml` — локальний запуск стеку

## Архітектура
- Backend API обробляє auth та invoice бізнес-логіку.
- Frontend звертається до API через HTTP.
- PostgreSQL зберігає користувачів, інвойси та позиції.

## Що потрібно встановити для тесту
- Python 3.12+
- Node.js 20+
- Docker Desktop (для docker-режиму)

## Як запустити
```bash
docker compose up --build
```
Або без Docker:
```bash
pip install -r requirements.txt
cd backend && python manage.py migrate && python manage.py runserver
cd ../frontend && npm install && npm run dev
```

