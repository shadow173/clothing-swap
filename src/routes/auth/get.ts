import { z } from "zod";
import { createRouteHelper } from "../../helpers/createRoute";
import { prisma } from "../../libraries/prisma";
import { domainUtil } from "../../utils/domain";
import { SignJWT } from "jose";
import { secrets } from "../../libraries/secrets";

export default createRouteHelper({
  response: z.object({
    token: z.string(),
  }),
  responses: [403],
  handler: async (request, reply) => {
    // Query session
    const session = await prisma.session.findUnique({
      where: {
        token: request.cookies.session || "",
      },
      include: {
        user: true,
      },
    });

    // Check if session is valid
    if (!session || session.expiresAt < new Date()) {
      // Remove cookie
      reply.clearCookie("session", {
        path: "/",
        domain: domainUtil(),
      });

      return [403];
    }

    // Generate access token
    const token = await new SignJWT({
      uid: session.user.uid,
      username: session.user.username,
      roles: session.user.roles,
    })
      .setSubject(session.user.id)
      .setExpirationTime(Date.now() + 1000 * 60 * 5)
      .setProtectedHeader({
        alg: "HS256",
      })
      .sign(Buffer.from(secrets.Internal.jwtKey || ""));

    return [
      200,
      {
        token,
      },
    ];
  },
});
