import { environmentUtil } from "./environment";

export const domainUtil = (): string => {
  const environment = environmentUtil();

  switch (environment) {
    case "production":
      return "clothingswap.com";
    default:
      return "localhost:3000";
  }
};
