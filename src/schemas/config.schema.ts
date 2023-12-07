import * as S from "@effect/schema/Schema";

export const ConfigSchema = S.struct({
	secrets: S.struct({
		manager: S.literal("gcp", "local"),
		name: S.string,
		version: S.string,
	}),
	logger: S.struct({
		level: S.optional(S.string).withDefault(() => "info"),
		prettyPrint: S.optional(S.boolean).withDefault(() => false),
	}),
	swagger: S.struct({
		enabled: S.optional(S.boolean).withDefault(() => false),
	}),

	// Services configuration to avoid the dependency on process.env
	services: S.struct({
		payment: S.struct({
			implementation: S.literal("stripe", "mock"),
		}),
		secrets: S.struct({
			implementation: S.literal("gcp", "local"),
		}),
	}),
});

export type Config = S.Schema.To<typeof ConfigSchema>;
