import * as S from "@effect/schema/Schema";

export const EnvSchema = S.struct({
	PORT: S.string.pipe(S.nonEmpty<string>()),
	APP_CONFIG: S.string,

	// GCP authentication variables:

	GCP_PROJECT_ID: S.string,
	// Path to the GCP key file https://cloud.google.com/docs/authentication/application-default-credentials
	GOOGLE_APPLICATION_CREDENTIALS: S.string,
});

export type Env = S.Schema.To<typeof EnvSchema>;
