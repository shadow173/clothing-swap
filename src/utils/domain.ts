import { environmentUtil } from "./environment";

export const domainUtil = (): string => {
  const environment = environmentUtil();

  switch (environment) {
    case "production":
      return "swappable.net";
    case "staging":
      return "staging.swappable.net";
    case "development":
      return "dev.swappable.net";
    default:
      return "localhost:3000";
  }
};
