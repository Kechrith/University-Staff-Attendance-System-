import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db.js";
import { AUTH_COOKIE, requireAuth, signToken } from "../middleware/auth.js";
import { ROLE_KEY } from "../roleMap.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email or password format" });
    return;
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Incorrect email or password" });
    return;
  }
  if (user.status === "SUSPENDED") {
    res.status(403).json({ error: "This account has been suspended" });
    return;
  }

  const token = signToken({ id: user.id, role: user.role });
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 8 * 60 * 60 * 1000,
  });
  res.json({ role: ROLE_KEY[user.role], name: user.name });
});

authRouter.post("/auth/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    name: user.name,
    position: user.position ?? ROLE_KEY[user.role],
    avatar: user.avatarUrl ?? "",
    department: user.departmentId ? (await prisma.department.findUnique({ where: { id: user.departmentId } }))?.name ?? "" : "",
    online: true,
  });
});
