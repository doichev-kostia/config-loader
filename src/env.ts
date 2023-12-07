import * as process from "node:process";

import * as E from "effect/Either";
import { TreeFormatter } from "@effect/schema";

import { loadEnv } from "./loaders.js";

const record = loadEnv();
if (E.isLeft(record)) {
	console.error("Invalid environment variables ❌");
	console.error(TreeFormatter.formatErrors(record.left.errors));
	process.exit(1);
}

console.log("Environment variables loaded ✅");
export const env = record.right;
