import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/exports/index.ts'],
	outDir: 'distLib',
	splitting: false,
	sourcemap: true,
	dts: true,
	clean: true,
	format: ['esm', 'cjs']
});
