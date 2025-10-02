import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { prisma } from "./db/prisma.js";

const app = createApp();

app.listen(env.PORT, async () => {
  await prisma.$connect();
  console.log(`Server ready on http://localhost:${env.PORT}`);
  console.log(`Docs: http://localhost:${env.PORT}/docs`);
});
