export const environmentUtil = ():
  | "development"
  | "staging"
  | "production"
  | "local-development" => {
  const envOptions = [
    "development",
    "staging",
    "production",
    "local-development",
  ];

  for (const environment of envOptions) {
    if (process.env.NODE_ENV?.toLowerCase() === environment)
      return environment as any;
  }

  return "development";
};
