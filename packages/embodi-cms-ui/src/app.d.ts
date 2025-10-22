// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
				// Add other environment variables here
			};
		}
		interface Locals {
			user: import('$services/session').SessionValidationResult['user'];
			session: import('$services/session').SessionValidationResult['session'];
		}
		interface Error {
			type: string;
			message: string;
		}
	}
}

export {};
