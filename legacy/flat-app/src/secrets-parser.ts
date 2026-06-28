import { z } from "zod";

const optionalSecret = z.string().min(1).optional();

const SovereignSecretsSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
  SUPABASE_URL: z.string().url().optional(),
  NETLIFY_AUTH_TOKEN: optionalSecret,
  NETLIFY_SITE_ID: optionalSecret,
  SENTRY_AUTH_TOKEN: optionalSecret,
  SENTRY_ORG: optionalSecret,
  TELEGRAM_BOT_TOKEN: optionalSecret,
  TELEGRAM_CHAT_ID: optionalSecret
});

export type SovereignSecrets = z.infer<typeof SovereignSecretsSchema>;

export function loadSovereignContext(): SovereignSecrets {
  const result = SovereignSecretsSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Environment validation failed:", result.error.format());
    process.exit(1);
  }

  return result.data;
}
