import './boot.js'
import { DependencyContainer } from "~/services.js";


function main() {
	console.log('Hello World!')
	DependencyContainer.get("payment").parseWebhookEvent(new Uint8Array([]), 'signature');
}
