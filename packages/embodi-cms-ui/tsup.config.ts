import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/exports/index.ts'],
	outDir: 'dist/lib',
	splitting: false,
	sourcemap: true,
	dts: true,
	clean: true,
	tsconfig: './tsconfig.json',
	format: ['esm', 'cjs']
});
