import * as dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
};
