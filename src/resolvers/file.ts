import { File, User } from "@prisma/client";
import { z } from "zod";
import { createResolverHelper } from "../helpers/createResolver";

export const file = z.object({
  id: z.string(),
  userUsername: z.string(),
  name: z.string(),
  originalName: z.string(),
  mimetype: z.string(),
  size: z.number(),
  views: z.number(),
  createdAt: z.number(),
});

export const fileResolver = createResolverHelper<
  File & { user: User },
  typeof file,
  void
>((data) => ({
  id: data.id,
  userUsername: data.user.username,
  name: data.name,
  originalName: data.originalName,
  mimetype: data.mimetype,
  size: data.size,
  views: data.views,
  createdAt: data.createdAt.getTime(),
}));
