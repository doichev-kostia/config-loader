import { type PaymentService } from "~/services/payment/types.js";
import { type SecretManager } from "~/services/secrets/types.js";

export type Services = {
	payment: PaymentService;
	secrets: SecretManager;
};

export class ServiceContainer {
	#services: Services;

	constructor(services: Services) {
		this.#services = services;
	}

	get<K extends keyof Services>(name: K): Services[K] {
		return this.#services[name];
	}

	set<K extends keyof Services>(name: K, service: Services[K]): void {
		this.#services[name] = service;
	}
}
