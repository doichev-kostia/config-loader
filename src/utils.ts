export function getModuleType(): "esm" | 'cjs' {
	let type = 'cjs' as 'esm' | 'cjs';
	if (typeof module !== "undefined" && module.exports) {
		type = 'cjs';
	} else if (typeof import.meta !== "undefined" && import.meta.url) {
		type = 'esm';
	}

	return type;
}

const objectToString = Object.prototype.toString;
const uint8ArrayStringified = '[object Uint8Array]';

export function isUint8Array(value) {
	if (!value) {
		return false;
	}

	if (value.constructor === Uint8Array) {
		return true;
	}

	return objectToString.call(value) === uint8ArrayStringified;
}
