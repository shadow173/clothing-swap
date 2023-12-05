import { createRouteHelper } from "../helpers/createRoute";

export default createRouteHelper({
  response: "Welcome to the Clothing Swap API.",
  responses: [],
  handler: async () => [200],
});
