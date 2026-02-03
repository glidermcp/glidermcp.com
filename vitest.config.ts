import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
			$components: fileURLToPath(new URL('./src/lib/components', import.meta.url)),
			$types: fileURLToPath(new URL('./src/lib/types', import.meta.url))
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node',
		globals: true,
		setupFiles: ['./vitest.setup.ts']
	}
});
