import { FastifyPluginAsync } from "fastify";
import { ZodIssue, ZodType } from "zod";
import fastifyPlugin from "fastify-plugin";

class ValidationError extends Error {
  statusCode: number;
  data: string;

  constructor(data: any) {
    super();
    this.statusCode = 400;
    this.message = "One or more fields is invalid and needs to be modified.";
    this.data = data;
  }
}

const plugin: FastifyPluginAsync = async (fastify) => {
  // Fix query param booleans
  fastify.addHook("preParsing", async (request) => {
    const query: any = request.query;
    if (typeof query === "object") {
      Object.entries(query).forEach(([key, value]) => {
        if (value == "true") query[key] = true;
        if (value == "false") query[key] = false;
        if (
          !Number.isNaN(parseInt(value as any)) &&
          (value as any).match(/^([0-9]|\.|-)*$/)
        ) {
          query[key] = parseInt(value as any);
        }
      });
      request.query = Object.assign(query);
    }
  });

  // Use custom validation handler
  fastify.setValidatorCompiler(
    ({ schema }: { schema: ZodType<any> }) =>
      (body: any) => {
        try {
          return schema.parse(body);
        } catch (error: any) {
          const rawIssues: Array<ZodIssue> = error.issues;
          const translatedIssues: { [field: string]: string } = {};

          for (const issue of rawIssues) {
            const message = issue.message;

            translatedIssues[issue.path.join(".")] = message;
          }

          throw new ValidationError(
            error.issues.reduce(
              (acc: any, issue: any) => ({
                ...acc,
                [issue.path.join(".")]: issue.message,
              }),
              {}
            )
          );
        }
      }
  );
};

export const zodPlugin = fastifyPlugin(plugin);
