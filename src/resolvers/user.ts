import { User } from "@prisma/client";
import { z } from "zod";
import { createResolverHelper } from "../helpers/createResolver";

export const user = z.object({
  id: z.string(),
  username: z.string(),
  roles: z.string().array(),
  createdAt: z.number(),
});

export const userResolver = createResolverHelper<User, typeof user, void>(
  (data) => ({
    id: data.id,
    username: data.username,
    roles: data.roles,
    createdAt: data.createdAt.getTime(),
  })
);
