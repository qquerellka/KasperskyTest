import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: err.flatten(),
      },
    });
  }
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: { code: "INTERNAL_ERROR", message } });
}
