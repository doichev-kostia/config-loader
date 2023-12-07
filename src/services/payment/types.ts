import type * as O from "effect/Option";

export type WebhookEvent = {
	type: string;
	payload: unknown;
};

export interface PaymentService {
	parseWebhookEvent(payload: Uint8Array, signature: string): O.Option<WebhookEvent>;
}
