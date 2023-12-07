import type * as O from "effect/Option";

export interface SecretManager {
	getSecret(name: string, version?: string): Promise<O.Option<Record<string, string>>>;
	getSecretSync(name: string, version?: string): O.Option<Record<string, string>>
}
