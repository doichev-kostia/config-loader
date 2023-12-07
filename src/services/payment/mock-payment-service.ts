import { type PaymentService, type WebhookEvent, } from "~/services/payment/types.js";
import type * as O from "effect/Option";

export class MockPaymentService implements PaymentService {

	parseWebhookEvent(payload: Uint8Array, signature: string): O.Option<WebhookEvent> {
		throw new Error("Method not implemented.");
	}

}
