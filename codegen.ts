import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: {
		'https://api.github.com/graphql': {
			headers: {
				'User-Agent': 'Embodi/1.0',
				Authorization: `Bearer ${process.env.GITHUB_DEV_TOKEN}`
			}
		}
	},
	documents: ['src/**/*.{ts,tsx,js,jsx}', '!src/lib/gql/**/*'],
	generates: {
		'./src/lib/gql/': {
			preset: 'client',
			plugins: [],
			config: {
				useTypeImports: true,
				scalars: {
					DateTime: 'string',
					URI: 'string',
					HTML: 'string',
					Base64String: 'string',
					GitObjectID: 'string',
					GitRefname: 'string',
					GitSSHRemote: 'string',
					GitTimestamp: 'string',
					PreciseDateTime: 'string',
					X509Certificate: 'string'
				}
			}
		}
	},
	ignoreNoDocuments: true
};

export default config;
