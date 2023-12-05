import { FastifyPluginAsync } from "fastify";
import { jwtVerify } from "jose";
import { secrets } from "../libraries/secrets";
import fastifyPlugin from "fastify-plugin";

export type jwtUserPayload = {
  username: string;
  avatar: string;
  roles: Array<string>;
  sub: string;
  exp: number;
};

const plugin: FastifyPluginAsync = async (fastify) => {
  // Use validation handler
  fastify.addHook("onRequest", async (request, reply) => {
    const isPrivate = (reply.context.config as any).isPrivate as boolean;
    const authHeader = request.headers.authorization;

    // Ensure authorization header exists
    if (!authHeader) {
      if (isPrivate)
        throw {
          statusCode: 401,
          code: "token-expired",
          message:
            "Your access token is invalid or has expired, please regenerate or login.",
          data: {},
        };
      else return;
    }

    // Extract token from header
    const encodedJwt = authHeader.split(" ")[1];

    // Check if header is remotely valid
    if (encodedJwt === "false") return;

    try {
      // Validate access token
      const decodedJwt = await jwtVerify(
        encodedJwt,
        Buffer.from(secrets.Internal.jwtKey),
        {
          algorithms: ["HS256"],
          clockTolerance: 10,
        }
      );

      request.user = decodedJwt.payload as jwtUserPayload;
    } catch (error) {
      throw {
        statusCode: 401,
        code: "token-expired",
        message:
          "Your access token is invalid or has expired, please regenerate or login.",
        data: {},
      };
    }
  });
};

declare module "fastify" {
  interface FastifyRequest {
    user?: jwtUserPayload;
  }
}

export const jwtPlugin = fastifyPlugin(plugin);
