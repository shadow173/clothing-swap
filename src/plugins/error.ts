import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

const plugin: FastifyPluginAsync = async (fastify) => {
  // Default error handling
  fastify.setErrorHandler(async (error: any, _request, reply) => {
    console.log(error);
    await reply.code(error.statusCode ?? 500).send({
      message:
        error.message ??
        "An internal server error has occured, please try again.",
      data: error.data || {},
    });
  });

  // No route handling
  fastify.setNotFoundHandler(
    async (_request, reply) =>
      await reply.code(404).send({
        message: "The specified resource could not be found, please try again.",
        data: {},
      })
  );
};

export const errorPlugin = fastifyPlugin(plugin);
