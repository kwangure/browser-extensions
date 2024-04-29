import { defineConfig } from 'vite';
import { extension } from 'vite-plugin-browser-extension';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';

export default defineConfig({
	plugins: [extension(), svelte()],
	resolve: {
		alias: {
			$scripts: path.resolve('./src/scripts'),
			$apps: path.resolve('./src/apps'),
		},
	},
});
