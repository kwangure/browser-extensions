import { defineConfig } from 'vite';
import { extension } from 'vite-plugin-browser-extension';

export default defineConfig({
	plugins: [extension()],
});
