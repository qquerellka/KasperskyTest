import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { usersRouter } from "./modules/users/users.router.js";
import { groupsRouter } from "./modules/groups/groups.router.js";
import { membershipsRouter } from "./modules/memberships/memberships.router.js";
import { errorHandler } from "./middlewares/error.js";
import { notFound } from "./middlewares/notFound.js";
import openapi from "./docs/openapi.json" assert { type: "json" };

export function createApp() {
  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/users", usersRouter);
  app.use("/api/groups", groupsRouter);
  app.use("/api", membershipsRouter);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
