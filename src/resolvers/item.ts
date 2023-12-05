import { Item, User } from "@prisma/client";
import { z } from "zod";
import { createResolverHelper } from "../helpers/createResolver";

export const item = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
});

export const itemResolver = createResolverHelper<
  Item & { user: User },
  typeof item,
  void
>((data) => ({
  id: data.id,
  title: data.title,
  description: data.description,
  price: data.price.toNumber(),
  user: {
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    email: data.user.email,
  },
}));
