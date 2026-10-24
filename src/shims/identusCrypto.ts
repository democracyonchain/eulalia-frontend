// The SDK's browser bundle imports Node's webcrypto name. Use the browser API.
export const webcrypto = globalThis.crypto;
