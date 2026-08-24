# University-Staff-Attendance-System (AttendHub)

A staff attendance system for RUPP's Department of Data Science and Engineering — 5 roles (Super Admin, Department Head, Program Coordinator, Lecturer, Class Monitor), each with their own dashboard.

- **Frontend**: `frontend/` — Next.js + React + Tailwind
- **Backend**: `backend/` — Express API
- **Database**: `database/` — Prisma schema, migrations, and seed data (used by `backend/`)

## Running it

**Prerequisites**: [Docker Desktop](https://www.docker.com/products/docker-desktop/), and a PostgreSQL server the backend can reach. The project doesn't run its own Postgres container — it connects to whatever you point it at.

```bash
git clone https://github.com/Kechrith/University-Staff-Attendance-System-.git
cd University-Staff-Attendance-System-
```

Create a `.env` file at the repo root (gitignored — this is per-person, not shared) pointing at a database you've created on your Postgres server:
```bash
# .env
LOCAL_DATABASE_URL=postgresql://<user>:<password>@host.docker.internal:5432/<your-db-name>?schema=public
```
`host.docker.internal` is Docker Desktop's DNS name for reaching your host machine from inside a container — use it even if your Postgres is running natively on `localhost`. Create the target database first (e.g. via pgAdmin, or `psql -c "CREATE DATABASE your_db_name;"`) — the backend will apply migrations and seed it automatically on first start, but it won't create the database itself.

```bash
docker compose up
```

That's it. This starts everything:

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| API | http://localhost:4000 |
| Adminer (DB browser) | http://localhost:8080 |

First run will take a few minutes (building images, installing dependencies, applying migrations, seeding sample data). After that, `docker compose up` is fast — it reuses what's already built, and won't touch your data again (migrations/seeding only run against an empty database).

Add `-d` to run it in the background instead of holding your terminal: `docker compose up -d`.

## Logging in

The sign-in page has a **Quick Sign In** panel (dev-only, hidden in production builds) — click a role to sign in instantly. Or use these credentials directly:

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@rupp.edu.kh | SuperAdmin123! |
| Department Head | dept.head@rupp.edu.kh | DeptHead123! |
| Program Coordinator | coordinator@rupp.edu.kh | Coord123! |
| Lecturer | lecturer@rupp.edu.kh | Lecturer123! |
| Class Monitor | monitor@rupp.edu.kh | Monitor123! |

## Useful commands

```bash
docker compose ps              # check what's running
docker compose logs -f backend # tail a service's logs
docker compose down            # stop everything (data persists)
docker compose restart backend # picked up a backend code change
```

If you edit `database/schema.prisma`, the backend container's Prisma Client goes stale until you run:
```bash
docker compose exec backend npx prisma generate
docker compose restart backend
```

## Project structure

```
backend/                 Express API (uses database/ for its Prisma schema)
frontend/                Next.js frontend
database/                Prisma schema, migrations, seed.ts
docker-compose.yml       Runs postgres + backend + frontend + adminer together
```
