# University-Staff-Attendance-System (AttendHub)

A staff attendance system for RUPP's Department of Data Science and Engineering — 5 roles (Super Admin, Department Head, Program Coordinator, Lecturer, Class Monitor), each with their own dashboard.

- **Frontend**: `staff-attendance/` — Next.js + React + Tailwind
- **Backend**: `Backend/` — Express + Prisma + PostgreSQL

## Running it

**Prerequisite**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running. Nothing else — no manual `.env` setup, no `npm install` needed on your host.

```bash
git clone https://github.com/Kechrith/University-Staff-Attendance-System-.git
cd University-Staff-Attendance-System-
docker compose up
```

That's it. This starts everything:

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| API | http://localhost:4000 |
| Adminer (DB browser) | http://localhost:8080 |

First run will take a few minutes (building images, installing dependencies). After that, `docker compose up` is fast — it reuses what's already built.

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

If you edit `Backend/prisma/schema.prisma`, the backend container's Prisma Client goes stale until you run:
```bash
docker compose exec backend npx prisma generate
docker compose restart backend
```

## Project structure

```
Backend/                 Express API + Prisma schema/migrations/seed
staff-attendance/        Next.js frontend
docker-compose.yml       Runs postgres + backend + frontend + adminer together
```
