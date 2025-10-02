import { prisma } from "../src/db/prisma.js";
import fs from "fs";
import path from "path";

type Format = "jsonl" | "csv";

function parseArgs() {
  const dir =
    process.argv.find((a) => a.startsWith("--dir="))?.split("=")[1] ||
    "./backup";
  const formatRaw =
    process.argv.find((a) => a.startsWith("--format="))?.split("=")[1] ||
    "jsonl";
  const truncate = process.argv.includes("--truncate");
  const format: Format = formatRaw === "csv" ? "csv" : "jsonl";
  return { dir, format, truncate };
}

function readJsonl(file: string) {
  if (!fs.existsSync(file)) return [];
  const lines = fs
    .readFileSync(file, "utf-8")
    .split(/\r?\n/)
    .filter(Boolean);
  return lines.map((l) => JSON.parse(l));
}

async function main() {
  const { dir, format, truncate } = parseArgs();

  if (format !== "jsonl") {
    console.error(
      "CSV парсер временно отключён. Используй --format=jsonl (по умолчанию)."
    );
    process.exit(1);
  }

  const usersPath = path.join(dir, "users.jsonl");
  const groupsPath = path.join(dir, "groups.jsonl");
  const msPath = path.join(dir, "memberships.jsonl");

  const users = readJsonl(usersPath);
  const groups = readJsonl(groupsPath);
  const memberships = readJsonl(msPath);

  if (truncate) {
    await prisma.membership.deleteMany();
    await prisma.user.deleteMany();
    await prisma.group.deleteMany();
  }

  // Insert groups first
  for (const g of groups) {
    await prisma.group
      .create({
        data: {
          id: typeof g.id === "string" ? parseInt(g.id, 10) : g.id,
          name: g.name,
          description: g.description ?? null,
          createdAt: g.createdAt ? new Date(g.createdAt) : undefined,
        },
      })
      .catch(() => {});
  }

  // Users
  for (const u of users) {
    await prisma.user
      .create({
        data: {
          id: typeof u.id === "string" ? parseInt(u.id, 10) : u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone ?? null,
          title: u.title ?? null,
          isActive:
            typeof u.isActive === "string"
              ? u.isActive === "true" || u.isActive === "1"
              : !!u.isActive,
          createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
          updatedAt: u.updatedAt ? new Date(u.updatedAt) : undefined,
        },
      })
      .catch(() => {});
  }

  // Memberships
  for (const m of memberships) {
    const userId =
      typeof m.userId === "string" ? parseInt(m.userId, 10) : m.userId;
    const groupId =
      typeof m.groupId === "string" ? parseInt(m.groupId, 10) : m.groupId;
    await prisma.membership
      .create({
        data: {
          userId,
          groupId,
          assignedAt: m.assignedAt ? new Date(m.assignedAt) : undefined,
        },
      })
      .catch(() => {});
  }

  console.log("Restore completed.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
