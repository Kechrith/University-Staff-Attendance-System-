import "dotenv/config";
import express from "express";
import "express-async-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { superAdminRouter } from "./routes/superAdmin.js";
import { departmentHeadRouter } from "./routes/departmentHead.js";
import { programCoordinatorRouter } from "./routes/programCoordinator.js";
import { lecturerRouter } from "./routes/lecturer.js";
import { classMonitorRouter } from "./routes/classMonitor.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", authRouter);
app.use("/api/super-admin", superAdminRouter);
app.use("/api/department-head", departmentHeadRouter);
app.use("/api/program-coordinator", programCoordinatorRouter);
app.use("/api/lecturer", lecturerRouter);
app.use("/api/class-monitor", classMonitorRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`AttendHub backend listening on http://localhost:${port}`);
});

// Defense-in-depth: log anything that slips past express-async-errors instead
// of letting Node kill the whole dev server over one bad request.
process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));
process.on("uncaughtException", (error) => console.error("Uncaught exception:", error));
