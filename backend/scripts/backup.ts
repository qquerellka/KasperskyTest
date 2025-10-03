import { prisma } from "../src/db/prisma.js";
import fs from "fs";
import path from "path";

type Format = "jsonl" | "csv";

function parseArgs() {
  const dir =
    process.argv.find((a) => a.startsWith("--dir="))?.split("=")[1] ||
    "./backup";
  const format =
    (process.argv
      .find((a) => a.startsWith("--format="))
      ?.split("=")[1] as Format) || "jsonl";
  return { dir, format };
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

async function writeJsonl(file: string, rows: any[]) {
  const ws = fs.createWriteStream(file, { encoding: "utf-8" });
  for (const r of rows) ws.write(JSON.stringify(r) + "\n");
  ws.end();
}

async function writeCsv(file: string, rows: any[]) {
  if (rows.length === 0) return fs.writeFileSync(file, "");
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")].concat(
    rows.map((r) =>
      headers.map((h) => JSON.stringify((r as any)[h] ?? "")).join(",")
    )
  );
  fs.writeFileSync(file, lines.join("\n"));
}

async function main() {
  const { dir, format } = parseArgs();
  ensureDir(dir);

  const users = await prisma.user.findMany();
  const groups = await prisma.group.findMany();
  const memberships = await prisma.membership.findMany();

  if (format === "jsonl") {
    await writeJsonl(path.join(dir, "users.jsonl"), users);
    await writeJsonl(path.join(dir, "groups.jsonl"), groups);
    await writeJsonl(path.join(dir, "memberships.jsonl"), memberships);
  } else {
    await writeCsv(path.join(dir, "users.csv"), users);
    await writeCsv(path.join(dir, "groups.csv"), groups);
    await writeCsv(path.join(dir, "memberships.csv"), memberships);
  }
  console.log("Backup completed:", dir);
  await prisma.$disconnect();
}
main();
