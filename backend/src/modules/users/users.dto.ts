import { z } from "zod";

export const UserCreateDtoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});
export type UserCreateDto = z.infer<typeof UserCreateDtoSchema>;

export const UserPatchDtoSchema = UserCreateDtoSchema.partial();
export type UserPatchDto = z.infer<typeof UserPatchDtoSchema>;

export const UserDtoSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  groups: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
});
export type UserDto = z.infer<typeof UserDtoSchema>;
