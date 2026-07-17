import type { Role } from "@prisma/client";

/** Maps the Prisma `Role` enum to the URL/role-key strings the frontend already uses in `lib/roles.ts`. */
export const ROLE_KEY: Record<Role, string> = {
  SUPER_ADMIN: "Super-Admin",
  DEPARTMENT_HEAD: "Department-Head",
  PROGRAM_COORDINATOR: "Program-Coordinator",
  LECTURER: "Lecturer",
  CLASS_MONITOR: "Class-Monitor",
};
