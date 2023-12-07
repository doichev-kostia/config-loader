import { type PaymentService, type WebhookEvent, } from "~/services/payment/types.js";
import { Stripe } from "stripe";
import * as O from "effect/Option";

export class StripePaymentService implements PaymentService {
	#client: Stripe;
	#webhookSecret: string;

	constructor({
		apiKey,
		webhookSecret,
		apiVersion = "2023-10-16",
	}: {
		apiKey: string;
		webhookSecret: string;
		apiVersion?: "2023-10-16";
	}) {
		this.#webhookSecret = webhookSecret;
		this.#client = new Stripe(apiKey, {
			apiVersion,
		});
	}

	parseWebhookEvent(payload: Uint8Array, signature: string): O.Option<WebhookEvent> {
		try {
			const event = this.#client.webhooks.constructEvent(
				payload.toString(),
				signature,
				this.#webhookSecret,
			);


			return O.some({
				type: event.type,
				payload: event.data,
			});
		} catch (error) {

			return O.none();
		}
	}
}
