import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
import { extname } from "path";
import { z } from "zod";
import { createRouteHelper } from "../../helpers/createRoute";
// import { prisma } from "../../libraries/prisma";
import { s3 } from "../../libraries/s3";
import { environmentUtil } from "../../utils/environment";

export default createRouteHelper({
  // isPrivate: true,
  files: {
    maxCount: 1,
  },
  response: z.string(),
  responses: [403],
  handler: async (request) => {
    // // Query token
    // const token = await prisma.token.findFirst({
    //   where: {
    //     value: request.headers.authorization,
    //     type: "UPLOAD_KEY",
    //   },
    //   select: {
    //     user: true,
    //   },
    // });

    // // Check if the token exists
    // if (
    //   !token ||
    //   !token.user.roles.includes("USER") ||
    //   !token.user.roles.includes("VERIFIED")
    // )
    //   return [403];

    // Upload file to s3 bucket
    await s3.send(
      new PutObjectCommand({
        Bucket: `astral-${environmentUtil()}`,
        Key: `${randomBytes(7).toString("hex").slice(0, 7)}${extname(
          request.files[0].originalname
        )}`,
        Body: request.files[0].buffer,
        ACL: "public-read",
      })
    );

    return [200, "File uploaded successfully"];
  },
});
