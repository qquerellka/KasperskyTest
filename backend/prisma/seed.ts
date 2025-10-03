import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const firstNames = [
  "Alex",
  "Maxim",
  "Ivan",
  "Sofia",
  "Maria",
  "John",
  "Emily",
  "Daniel",
  "Olga",
  "Nina",
  "Pavel",
];
const lastNames = [
  "Uskov",
  "Smith",
  "Johnson",
  "Petrov",
  "Sidorov",
  "Brown",
  "Taylor",
  "Kuznetsov",
  "Romanov",
  "Sokolov",
];
const titles = [
  "Engineer",
  "Accountant",
  "HR Manager",
  "Team Lead",
  "Analyst",
  "Developer",
  "QA",
  "Designer",
  "Support",
];

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function emailOf(fn: string, ln: string, i: number) {
  return `${fn}.${ln}.${Date.now()}.${i}@example.com`.toLowerCase();
}
function phone() {
  const d = () => Math.floor(Math.random() * 10);
  return `+49 1${d()}${d()} ${d()}${d()}${d()} ${d()}${d()}${d()}${d()}`;
}

const DEFAULT_SIZE = 350;

async function main() {
  const sizeArg = process.argv.find((a) => a.startsWith("--size="));
  const size = sizeArg ? parseInt(sizeArg.split("=")[1], 10) : DEFAULT_SIZE;

  console.log(`Seeding groups and ${size} users...`);

  const groupNames = [
    "Руководство",
    "Бухгалтерия",
    "Отдел кадров",
    "Разработка",
    "Аналитика",
    "Поддержка",
  ];
  const groups = await Promise.all(
    groupNames.map((name) =>
      prisma.group.upsert({
        where: { name },
        update: {},
        create: { name, description: `Группа ${name}` },
      })
    )
  );

  for (let i = 0; i < size; i++) {
    const fn = pick(firstNames);
    const ln = pick(lastNames);
    const user = await prisma.user.create({
      data: {
        firstName: fn,
        lastName: ln,
        email: emailOf(fn, ln, i),
        phone: Math.random() > 0.2 ? phone() : null,
        title: Math.random() > 0.3 ? pick(titles) : null,
        isActive: Math.random() > 0.05,
      },
    });

    const r = Math.random();
    if (r < 0.4) continue;
    if (r < 0.85) {
      const g = pick(groups);
      await prisma.membership.create({
        data: { userId: user.id, groupId: g.id },
      });
    } else {
      const g1 = pick(groups);
      let g2 = pick(groups);
      if (g2.id === g1.id) g2 = pick(groups);
      await prisma.membership
        .create({ data: { userId: user.id, groupId: g1.id } })
        .catch(() => {});
      await prisma.membership
        .create({ data: { userId: user.id, groupId: g2.id } })
        .catch(() => {});
    }
  }

  console.log("Seed done.");
}

main().finally(() => prisma.$disconnect());
