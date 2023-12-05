import { z } from "zod";
import { createRouteHelper } from "../../helpers/createRoute";
import { prisma } from "../../libraries/prisma";
import { user, userResolver } from "../../resolvers/user";

export default createRouteHelper({
  query: z.object({
    page: z.number().default(1),
  }),
  isPrivate: true,
  response: user.array(),
  responses: [403],
  handler: async (request) => {
    // Check for permissions
    if (!request.user?.roles.includes("ADMIN")) return [403];

    // Query users
    const users = await prisma.user.findMany({
      where: {},
      take: 10,
      skip: request.query.page * 10,
    });

    return [200, userResolver(users)];
  },
});
