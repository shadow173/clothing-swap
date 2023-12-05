import { z } from "zod";
import { createRouteHelper } from "../../helpers/createRoute";
import { prisma } from "../../libraries/prisma";
import { hash as argon2 } from "argon2";

export default createRouteHelper({
  body: z
    .object({
      username: z.string().regex(/^\w{3,32}$/, {
        message: "Must be 3-32 alphanumeric characters including underscores.",
      }),
      email: z.string().email("Must be a valid email."),
      phoneNumber: z
        .string()
        .min(10, "Phone number must be 10 characters long (e.g., 8007520989).")
        .max(10, "Phone number cannot be more than 10 characters long."),
      firstName: z.string(),
      lastName: z.string(),
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
      passwordConfirmation: z.string(),
      terms: z.boolean().refine((value) => value === true, {
        message: "Please accept the terms and conditions.",
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords must match.",
      path: ["passwordConfirmation"],
    }),
  response: "Your account has been created, please verify your email.",
  responses: [409],
  handler: async (request) => {
    // Check if email is unique
    if (
      (await prisma.user.count({
        where: {
          email: {
            equals: request.body.email,
            mode: "insensitive",
          },
        },
      })) !== 0
    )
      return [
        409,
        {
          email:
            "There is already an account associated with that email address.",
        },
      ];

    // Check if the username is unique
    if (
      (await prisma.user.count({
        where: {
          username: {
            equals: request.body.username,
            mode: "insensitive",
          },
        },
      })) !== 0
    )
      return [
        409,
        {
          username:
            "There is already an account associated with that username.",
        },
      ];

    // Hash the user's password
    const hash = await argon2(request.body.password);

    // Create user
    await prisma.user.create({
      data: {
        email: request.body.email,
        username: request.body.username,
        phoneNumber: request.body.phoneNumber,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        itemsSold: 0,
        password: hash,
        roles: [],
        settings: {
          create: {},
        },
      },
    });

    // Todo: Send out verification email

    return [200];
  },
});
