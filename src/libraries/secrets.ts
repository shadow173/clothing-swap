import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { awsConfig } from "../configs/aws";
import { environmentUtil } from "../utils/environment";

let client: SecretsManagerClient;
export let secrets: Secrets;

type Secrets = {
  Database: DatabaseSecret;
  Internal: InternalSecret;
  Stripe: StripeSecret;
  Discord: DiscordSecret;
};

type DatabaseSecret = {
  host: string;
  port: number;
  username: string;
  password: string;
};

type InternalSecret = {
  jwtKey: string;
};

type StripeSecret = {
  publishableKey: string;
  secretKey: string;
};

type DiscordSecret = {
  domainsWebhook: string;
};

export const secretsLibrary = async (
  requestedSecrets: Array<keyof Secrets>
): Promise<void> => {
  client ??= new SecretsManagerClient(awsConfig);

  const staleSecrets = requestedSecrets.filter(
    (name) => !secrets || !secrets[name]
  );

  for (const name of staleSecrets) {
    try {
      const command = new GetSecretValueCommand({
        SecretId: `${environmentUtil()}/${name}`,
      });

      const secret = await client.send(command);

      secrets = {
        ...secrets,
        [name]: JSON.parse(secret.SecretString || ""),
      };
    } catch {
      console.log(`Error fetching secret "${name}"`);
    }
  }
};
