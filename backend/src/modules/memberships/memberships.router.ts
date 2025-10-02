import { Router } from "express";
import { prisma } from "../../db/prisma.js";

export const membershipsRouter = Router();

membershipsRouter.post("/users/:id/groups/:groupId", async (req,res,next) => {
  try {
    const userId = Number(req.params.id);
    const groupId = Number(req.params.groupId);
    await prisma.membership.create({ data: { userId, groupId } });
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

membershipsRouter.delete("/users/:id/groups/:groupId", async (req,res,next) => {
  try {
    const userId = Number(req.params.id);
    const groupId = Number(req.params.groupId);
    await prisma.membership.delete({ where: { userId_groupId: { userId, groupId } } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
