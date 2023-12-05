import { ZodType } from "zod";

export const createResolverHelper =
  <Input, Output extends ZodType<any>, Discriminator>(
    handler: (data: Input, user?: Discriminator) => Output["_output"]
  ) =>
  (input: Array<Input> | Input, user?: Discriminator): Output["_output"] => {
    if (input instanceof Array) return input.map((data) => handler(data, user));
    return handler(input, user);
  };
