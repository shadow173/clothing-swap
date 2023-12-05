import { createRouteHelper } from "../../../helpers/createRoute";
import { prisma } from "../../../libraries/prisma";
import { environmentUtil } from "../../../utils/environment";
import { item, itemResolver } from "../../../resolvers/item";

export default createRouteHelper({
  response: item,
  responses: [500],
  handler: async (request) => {
    // Check environment
    if (request.ip !== "127.0.0.1" || environmentUtil() === "production")
      return [500];

    // Create the system user
    if (
      (await prisma.user.count({
        where: {
          username: "System",
        },
      })) <= 0
    ) {
      console.log("Making system user...");
      await prisma.user.create({
        data: {
          email: "",
          username: "System",
          firstName: "System",
          lastName: "User",
          phoneNumber: "0000000000",
          itemsSold: 0,
          password: "",
          roles: ["ADMIN"],
          settings: {
            create: {},
          },
        },
      });
    }

    const item = await prisma.item.create({
      data: {
        title: "T-Shirt #1",
        description: "This is a very nice t-shirt.",
        price: 10.5,
        user: {
          connect: {
            username: "System",
          },
        },
      },
      include: {
        user: true,
      },
    });

    return [200, itemResolver(item)];
  },
});
