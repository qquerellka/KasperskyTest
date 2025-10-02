import { Router } from "express";
import { z } from "zod";
import { parsePagination } from "../../utils/pagination.js";
import { parseSorting } from "../../utils/sorting.js";
import * as svc from "./users.service.js";
import { UserCreateDto, UserPatchDto } from "./users.dto.js";

export const usersRouter = Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = parsePagination(req.query);
    const { orderBy } = parseSorting(req.query);
    const q = (req.query.q as string) || undefined;
    const groupId = req.query.groupId ? Number(req.query.groupId) : undefined;
    const ungroupedOnly = req.query.ungroupedOnly === "true";
    const { items, total } = await svc.listUsers({ skip, take, q, orderBy, groupId, ungroupedOnly });
    res.json({ items, total, page, perPage });
  } catch (e) { next(e); }
});

usersRouter.get("/:id", async (req,res,next) => {
  try {
    const id = Number(req.params.id);
    const u = await svc.getUser(id);
    if (!u) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    const groups = u.memberships.map(m => ({ id: m.group.id, name: m.group.name }));
    const { memberships, ...rest } = u as any;
    res.json({ ...rest, groups });
  } catch (e) { next(e); }
});

usersRouter.post("/", async (req,res,next) => {
  try {
    const data = UserCreateDto.parse(req.body);
    const u = await svc.createUser(data);
    res.status(201).json(u);
  } catch (e) { next(e); }
});

usersRouter.patch("/:id", async (req,res,next) => {
  try {
    const id = Number(req.params.id);
    const data = UserPatchDto.parse(req.body);
    const u = await svc.patchUser(id, data);
    res.json(u);
  } catch (e) { next(e); }
});

usersRouter.delete("/:id", async (req,res,next) => {
  try {
    const id = Number(req.params.id);
    const u = await svc.deleteUser(id);
    res.json(u);
  } catch (e) { next(e); }
});
