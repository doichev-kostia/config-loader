import { match } from "ts-pattern";
import { config } from "~/config.js";
import { StripePaymentService } from "~/services/payment/stripe-payment-service.js";
import { secrets } from "~/secrets.js";
import { MockPaymentService } from "~/services/payment/mock-payment-service.js";
import { GcpSecretManager } from "~/services/secrets/gcp-secret-manager.js";
import { LocalSecretManager } from "~/services/secrets/local-secret-manager.js";
import { ServiceContainer } from "~/services/service-container.js";


const paymentService = match(config.services.payment)
	.with({ implementation: "stripe" }, () => {
		return new StripePaymentService({
			apiKey: secrets.STRIPE_API_KEY,
			webhookSecret: secrets.STRIPE_WEBHOOK_SECRET,
		});
	})
	.with({ implementation: "mock" }, () => {
		return new MockPaymentService();
	})
	.exhaustive();

const secretsManager = match(config.services.secrets)
	.with({ implementation: "gcp" }, () => {
		return new GcpSecretManager();
	})
	.with({ implementation: "local" }, () => {
		return new LocalSecretManager();
	})
	.exhaustive();



const services = {
	payment: paymentService,
	secrets: secretsManager,
};

const DependencyContainer = new ServiceContainer(services);

export { DependencyContainer };
