import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/plugin.ts'],
	splitting: false,
	sourcemap: true,
	dts: true,
	clean: true,
	format: ['esm', 'cjs']
});
