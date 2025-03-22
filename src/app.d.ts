// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$services/session').SessionValidationResult['user'];
			session: import('$services/session').SessionValidationResult['session'];
		}
	}
}

export {};
