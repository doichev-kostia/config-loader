import process from "node:process";

import * as E from "effect/Either";
import { TreeFormatter } from "@effect/schema";

import { env } from "./env.js";
import { loadConfig } from "./loaders.js";

const record = loadConfig(env.APP_CONFIG);
if (E.isLeft(record)) {
	console.error("Invalid config ❌");
	console.error(TreeFormatter.formatErrors(record.left.errors));
	process.exit(1);
}

console.log("Config loaded ✅");
export const config = record.right;
