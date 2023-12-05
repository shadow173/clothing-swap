import { createRouteHelper } from "../../../helpers/createRoute";
import { prisma } from "../../../libraries/prisma";
import { user, userResolver } from "../../../resolvers/user";

export default createRouteHelper({
  response: user,
  responses: [404],
  handler: async (request) => {
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
