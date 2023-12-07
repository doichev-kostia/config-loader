import { type SecretManager } from "~/services/secrets/types.js";
import { v1 } from "@google-cloud/secret-manager";
import * as O from "effect/Option";
import { milliseconds } from "~/constants.js";
import JSON5 from "json5";
import { env } from "~/env.js";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isUint8Array } from "~/utils.js";

const dir = fileURLToPath(new URL('.', import.meta.url));

const syncFilePath = path.resolve(dir, 'sync-load-secrets.js')

export class GcpSecretManager implements SecretManager {
	#projectId: string;
	#client: v1.SecretManagerServiceClient;

	constructor() {
		this.#projectId = env.GCP_PROJECT_ID;
		this.#client = new v1.SecretManagerServiceClient({
			projectId: this.#projectId,
			keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS,
		});
	}

	async getSecret(name: string, version?: string): Promise<O.Option<Record<string, string>>> {
		try {
			const [response] = await this.#client.accessSecretVersion(
				{
					name: this.constructURL(name, version),
				},
				{
					timeout: 5 * milliseconds.second,
				},
			);

			if (!response.payload?.data) {
				return O.none();
			}

			const data = response.payload.data.toString();
			return O.some(JSON5.parse(data));
		} catch (error) {
			return O.none();
		}
	}

	getSecretSync(name: string, version?: string): O.Option<Record<string, string>> {
		try {

			const secretName = this.constructURL(name, version)
			const res = execSync(`node ${syncFilePath}`, {
				env: {
					GOOGLE_APPLICATION_CREDENTIALS: env.GOOGLE_APPLICATION_CREDENTIALS,
					GCP_PROJECT_ID: env.GCP_PROJECT_ID,
					SECRET_NAME: secretName,
				}
			});

			const data = res.toString();
			return O.some(JSON5.parse(data));
		} catch (error) {
			if (isUint8Array(error.stderr)) {
				console.error(error.stderr.toString())
			}
			console.error(error);
			return O.none();
		}
	}

	private constructURL(name: string, version = 'latest'): string {
		return `projects/${this.#projectId}/secrets/${name}/versions/${version}`;
	}
}
