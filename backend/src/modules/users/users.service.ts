import { prisma } from "../../db/prisma.js";

export async function listUsers(opts: {
  skip: number;
  take: number;
  q?: string;
  orderBy: any;
  groupId?: number;
  ungroupedOnly?: boolean;
}) {
  const { skip, take, q, orderBy, groupId, ungroupedOnly } = opts;
  const where: any = {};
  if (q && q.trim()) {
    const qv = q.trim();
    where.OR = [
      { firstName: { contains: qv } },
      { lastName: { contains: qv } },
      { email: { contains: qv } },
      { phone: { contains: qv } },
      { title: { contains: qv } },
    ];
  }

  if (groupId) {
    where.memberships = { some: { groupId } };
  }
  if (ungroupedOnly) {
    where.memberships = { none: {} };
  }
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        title: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total };
}

export async function getUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: { memberships: { include: { group: true } } },
  });
}

export async function createUser(data: any) {
  return prisma.user.create({ data });
}

export async function patchUser(id: number, data: any) {
  return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({ where: { id } });
}
