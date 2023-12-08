import { createRouteHelper } from "../../helpers/createRoute";
import { prisma } from "../../libraries/prisma";
import { domainUtil } from "../../utils/domain";

export default createRouteHelper({
  response:
    "Successfully cleared session, you have been logged out from this device.",
  responses: [404],
  handler: async (request, reply) => {
    // Query session
    const session = await prisma.session.findUnique({
      where: {
        token: request.cookies.session || "",
      },
    });

    // Delete session from database
    if (session) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });
    }

    // Remove cookie
    reply.clearCookie("session", {
      path: "/",
      domain: domainUtil(),
    });

    return [200];
  },
});
