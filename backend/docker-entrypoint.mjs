// Runs once when the backend container starts: applies any pending Prisma
// migrations (safe to re-run — no-ops if already applied), then seeds the
// database only if it's completely empty (a fresh volume, e.g. a teammate's
// first `docker compose up`). An already-seeded database is left untouched.
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

execSync("npx prisma migrate deploy", { stdio: "inherit" });

const prisma = new PrismaClient();
const userCount = await prisma.user.count();
await prisma.$disconnect();

if (userCount === 0) {
  console.log("Database is empty — running the seed script...");
  execSync("npx prisma db seed", { stdio: "inherit" });
} else {
  console.log(`Database already has ${userCount} user(s) — skipping seed.`);
}

execSync("npm run dev", { stdio: "inherit" });
