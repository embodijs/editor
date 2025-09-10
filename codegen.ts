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
	documents: [
		'src/**/*.{ts,tsx,js,jsx}',
		'!src/lib/gql/**/*' // Exclude generated files],
	],
	generates: {
		'./src/lib/gql/': {
			preset: 'client',
			plugins: [],
			config: {
				useTypeImports: true
			}
		}
	},
	ignoreNoDocuments: true,
	config: {
		scalars: {
			DateTime: 'string',
			URI: 'string',
			HTML: 'string'
		}
	}
};

export default config;
