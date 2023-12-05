import { createRouteHelper } from "../../../helpers/createRoute";
import { prisma } from "../../../libraries/prisma";
import { user, userResolver } from "../../../resolvers/user";

export default createRouteHelper({
  response: user,
  responses: [404],
  handler: async (request) => {
    // Check for permissions
    if (!request.user?.roles.includes("ADMIN")) {
      const self = await prisma.user.findFirst({
        where: {
          username: request.user?.username,
        },
      });

      if (!self) return [404];

      return [200, userResolver(self)];
    }

    // Query user
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: (request.params as any).username,
          mode: "insensitive",
        },
      },
    });

    // Check if the user exists
    if (!user) return [404];

    return [200, userResolver(user)];
  },
});
