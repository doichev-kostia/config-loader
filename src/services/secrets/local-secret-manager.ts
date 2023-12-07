import { type SecretManager } from "src/services/secrets/types.js";
import * as O from "effect/Option";
import fs from "fs";
import path from "node:path";
import JSON5 from "json5";

export class LocalSecretManager implements SecretManager {
	async getSecret(name: string): Promise<O.Option<Record<string, string>>> {
		try {
			const filepath = path.resolve(name);
			const data = await fs.promises.readFile(filepath, "utf-8");

			return O.some(JSON5.parse(data));
		} catch (error) {
			return O.none();
		}
	}

	getSecretSync(name: string, version?: string): O.Option<Record<string, string>> {
		try {
			const filepath = path.resolve(name);
			const data = fs.readFileSync(filepath, "utf-8");

			return O.some(JSON5.parse(data));
		} catch (error) {
			return O.none();
		}
	}
}
