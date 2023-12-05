import { FastifyRequest, FastifyReply, RouteOptions } from "fastify";
import { File } from "fastify-multer/lib/interfaces";
import { ZodType } from "zod";
import { responsesConfig } from "../configs/responses";
import multer from "fastify-multer";

export type ResponseCode = 403 | 404 | 409 | 500;

declare module "fastify" {
  interface FastifyRequest {
    files: Array<File>;
  }
}

export const createRouteHelper = <
  BodySchema extends ZodType<any>,
  QuerySchema extends ZodType<any>,
  Response extends string | ZodType<any>,
  Responses extends Array<ResponseCode>,
  Code extends 200 | ResponseCode,
>(options: {
  body?: BodySchema;
  query?: QuerySchema;
  isPrivate?: boolean;
  files?: {
    maxCount: number;
    types?: Array<string>;
    maxSize?: number;
  };
  response: Response;
  responses: Responses;
  handler: (
    request: FastifyRequest<{
      Body: BodySchema["_output"];
      Querystring: QuerySchema["_output"];
      Params: any;
    }>,
    reply: FastifyReply
  ) => Promise<[Code, unknown] | [Code]>;
}): Partial<RouteOptions> => ({
  schema: {
    body: options.body,
    querystring: options.query,
  },
  config: {
    isPrivate: options.isPrivate || false,
  },
  ...(options.files
    ? {
        preHandler: multer({
          storage: multer.memoryStorage(),
          fileFilter: (_, file, callback) =>
            callback(
              null,
              (
                options.files?.types || [
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "image/gif",
                ]
              ).includes(file.mimetype)
            ),
          limits: {
            fileSize: (options.files.maxSize || 25) * 1000000,
            files: options.files.maxCount,
          },
        }).array("files"),
      }
    : undefined),
  handler: async (request, reply) => {
    if (options.files && (!request.files || request.files.length === 0)) {
      reply.status(415).send();
      return;
    }

    const [statusCode, data] = await options.handler(request as any, reply);

    if (statusCode === 200)
      reply.status(200).send(
        typeof options.response === "string"
          ? {
              message: options.response,
            }
          : data
      );
    else
      reply.status(statusCode).send({
        message: (responsesConfig as any)[statusCode].properties.message
          .default,
        data: data || {},
      });
  },
});
