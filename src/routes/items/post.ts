import { z } from "zod";
import { createRouteHelper } from "../../helpers/createRoute";
import { prisma } from "../../libraries/prisma";

export default createRouteHelper({
  body: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
  }),
  isPrivate: true,
  response: z.string(),
  responses: [403],
  handler: async (request) => {
    if (!request.user) {
      return [403];
    }

    const item = await prisma.item.create({
      data: {
        title: request.body.title,
        description: request.body.description,
        price: request.body.price,
        user: {
          connect: {
            username: request.user?.username,
          },
        },
      },
    });

    console.log(item);

    return [200, "Item posted successfully."];
  },
});
