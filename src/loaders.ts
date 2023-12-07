import * as fs from "node:fs";
import * as process from "node:process";
import * as path from "node:path";

import { parse } from "dotenv";
import JSON5 from "json5";

import { pipe } from "effect";
import type * as E from "effect/Either";
import * as O from "effect/Option";
import * as S from "@effect/schema/Schema";
import { type ParseError } from "@effect/schema/ParseResult";

import { type Env, EnvSchema } from "./schemas/env.schema.js";
import { type Config, ConfigSchema } from "./schemas/config.schema.js";

const lookupFile = (file: string): O.Option<string> => {
	const fullPath = path.resolve(file);
	if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
		return O.some(fullPath);
	}

	return O.none();
};

const parseEnv = (file: string): O.Option<Record<string, any>> => {
	try {
		const record = parse(fs.readFileSync(file));
		return O.some(record);
	} catch (error) {
		console.error(`Failed to load env file ${file}`, error);
		return O.none();
	}
};

const parseJson5 = (file: string): O.Option<Record<string, any>> => {
	try {
		const record = JSON5.parse(fs.readFileSync(file, "utf-8"));
		return O.some(record);
	} catch (error) {
		console.error(`Failed to load json5 file ${file}`, error);
		return O.none();
	}
};

const envFile = `.env`;
const emptyRecord: Record<string, any> = {};

export const loadEnv = (): E.Either<ParseError, Env> => {
	const result = pipe(
		lookupFile(envFile),
		O.flatMap((f) => parseEnv(f)),
		(record) => O.getOrElse(record, () => emptyRecord),
		(record) => Object.assign({}, record, process.env),
		(record) => S.parseEither(EnvSchema)(record, { errors: "all" }),
	);

	return result;
};

export const loadConfig = (filepath: string): E.Either<ParseError, Config> => {
	const result = pipe(
		lookupFile(filepath),
		O.flatMap((f) => parseJson5(f)),
		(record) => O.getOrElse(record, () => emptyRecord),
		(record) => S.parseEither(ConfigSchema)(record, { errors: "all" }),
	);

	return result;
};
