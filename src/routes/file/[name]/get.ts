import { createRouteHelper } from "../../../helpers/createRoute";
import { prisma } from "../../../libraries/prisma";
import { file, fileResolver } from "../../../resolvers/file";

export default createRouteHelper({
  response: file,
  responses: [404],
  handler: async (request) => {
    // Query file
    const file = await prisma.file.findFirst({
      where: {
        name: (request.params as any).name,
      },
      include: {
        user: true,
      },
    });

    // Check if the file exists
    if (!file) return [404];

    return [200, fileResolver(file)];
  },
});
