import fastify, { HTTPMethods, RouteOptions } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyMulter from "fastify-multer";
import { z } from "zod";
import { loaderHelper } from "./helpers/loader";
import { errorPlugin } from "./plugins/error";
import { jwtPlugin } from "./plugins/jwt";
import { zodPlugin } from "./plugins/zod";
import { prisma, prismaLibrary } from "./libraries/prisma";
import fastifyCors from "@fastify/cors";

(async () => {
  // Initialize fastify server
  const server = fastify({});

  // Register plugins
  // server.register(fastifyOAuth2, {
  //   name: "discordOAuth2",
  //   credentials: {
  //     auth: fastifyOAuth2.DISCORD_CONFIGURATION,
  //     client: {
  //       id: "875975585359364146",
  //       secret: "",
  //     },
  //   },
  //   scope: ["identify"],
  //   startRedirectPath: "/discord",
  //   callbackUri: "http://localhost:3000",
  // });
  server.register(fastifyMulter.contentParser);
  server.register(fastifyCookie);
  server.register(fastifyCors, {
    origin: ["https://api.swappable.net", "https://www.swappable.net"],
  });
  server.register(errorPlugin);
  server.register(jwtPlugin);
  server.register(zodPlugin);

  // Load routes
  const routes = await loaderHelper<Partial<RouteOptions>>(
    "**/*.(js|ts)",
    "routes"
  );

  for (const file in routes) {
    // Extract route information
    const route = {
      ...routes[file],
      url: `/${file
        .split("/")
        .slice(0, -1)
        .join("/")
        .replace(/\[(\w*)\]/g, ":$1")}`,
      method: file
        .split("/")
        .slice(-1)[0]
        .split(".")[0]
        .toUpperCase() as HTTPMethods,
    };

    // Generate params
    const slugs = file.match(/\[.*?\]/g);
    if (slugs) {
      const fields = slugs.reduce(
        (acc, param) => ({ ...acc, [param.slice(1, -1)]: z.string() }),
        {}
      );

      route["schema"] = {
        ...route["schema"],
        params: z.object({
          ...fields,
        }),
      };
    }

    try {
      server.route(route as RouteOptions);
    } catch {
      continue;
    }
  }

  server.ready(async () => {
    // Print out routes
    console.info(
      server.printRoutes({
        commonPrefix: false,
      })
    );
  });

  // Initialize libraries
  //await secretsLibrary(["Database", "Internal", "Stripe", "Discord"]);
  await prismaLibrary();
  await prisma.$connect();
  //await s3Library();

  // Start listing for requests
  server
    .listen({ port: 3000, host: "0.0.0.0" })
    .then(async () => console.log("Listening on http://localhost:3000"))
    .catch((error) => console.error(error));
})();
