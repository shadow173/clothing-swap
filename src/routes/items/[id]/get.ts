import { createRouteHelper } from "../../../helpers/createRoute";
import { prisma } from "../../../libraries/prisma";
import { file } from "../../../resolvers/file";
import { itemResolver } from "../../../resolvers/item";

export default createRouteHelper({
  response: file,
  responses: [404],
  handler: async (request) => {
    // Query item
    const item = await prisma.item.findFirst({
      where: {
        id: (request.params as any).id,
      },
      include: {
        user: true,
      },
    });

    // Check if the file exists
    if (!item) return [404];

    return [200, itemResolver(item)];
  },
});
