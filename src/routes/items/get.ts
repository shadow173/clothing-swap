import { z } from "zod";
import { createRouteHelper } from "../../helpers/createRoute";
import { prisma } from "../../libraries/prisma";
import { item, itemResolver } from "../../resolvers/item";

export default createRouteHelper({
  body: z.object({ page: z.number().default(1) }),
  isPrivate: true,
  response: z.array(item),
  responses: [403],
  handler: async (request) => {
    const items = await prisma.item.findMany({
      where: {},
      take: 10,
      skip: (request.query as any).page * 10,
      include: { user: true },
    });

    return [200, items.map((item) => itemResolver(item))];
  },
});
