import { Router } from "express";
import { prisma } from "../../db/prisma.js";

export const groupsRouter = Router();

groupsRouter.get("/", async (_req,res,next) => {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { name: "asc" },
      include: { memberships: true }
    });
    res.json(groups.map(g => ({
      id: g.id, name: g.name, description: g.description,
      createdAt: g.createdAt, membersCount: g.memberships.length
    })));
  } catch (e) { next(e); }
});
