import * as S from "@effect/schema/Schema";

export const SecretsSchema = S.struct({
	API_KEY: S.string.pipe(S.nonEmpty<string>()),
	DB_URL: S.string.pipe(S.nonEmpty<string>()),
	STRIPE_API_KEY: S.string.pipe(S.nonEmpty<string>()),
	STRIPE_WEBHOOK_SECRET: S.string.pipe(S.nonEmpty<string>()),
});

export type Secrets = S.Schema.To<typeof SecretsSchema>;
