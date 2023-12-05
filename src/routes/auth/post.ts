import { verify } from "argon2";
import { randomBytes } from "crypto";
import { z } from "zod";
import { createRouteHelper } from "../../helpers/createRoute";
import { prisma } from "../../libraries/prisma";
import { domainUtil } from "../../utils/domain";

export default createRouteHelper({
  body: z.object({
    username: z.string().regex(/^\w{3,32}$/, {
      message: "Must be 3-32 alphanumeric characters including underscores.",
    }),
    password: z
      .string()
      .refine(
        (value) =>
          !!value?.match(/^.{2,32}$/) &&
          !!value?.match(/^.*\d|\W.*$/) &&
          !!value?.match(/^.*[a-z]|[A-Z].*$/),
        {
          message:
            "Must be 8-32 characters with at least 1 letter and 1 digit or symbol.",
        }
      ),
    // code: z.string(),
  }),
  response: "Successfully logged in.",
  responses: [409],
  handler: async (request, reply) => {
    // Get user
    const user = await prisma.user.findUnique({
      where: {
        username: request.body.username,
      },
    });

    // Check if the user exists
    if (!user)
      return [
        409,
        {
          username: "Invalid username, email, or password.",
          password: "Invalid username, email, or password",
        },
      ];

    // Check if the user's account is banned or disabled
    if (user.roles.includes("BANNED") || user.roles.includes("DISABLED"))
      return [
        409,
        {
          username: "Invalid username, email, or password.",
          password: "Invalid username, email, or password",
        },
      ];

    // Compare password hash
    const isValidPassword = await verify(user.password, request.body.password);

    // Check if the user's password is correct
    if (!isValidPassword) {
      return [
        409,
        {
          username: "Invalid username, email, or password.",
          password: "Invalid username, email, or password",
        },
      ];
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        token: randomBytes(32).toString("hex"),
        ip: request.ip || "Unknown",
        userAgent: request.headers["user-agent"] || "Unknown",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Set session cookie
    reply.setCookie("session", session.token, {
      path: "/",
      expires: session.expiresAt,
      domain: domainUtil(),
    });

    // Todo: Send new login notification if logged in from new device

    return [200];
  },
});
