import path from 'node:path';
import { build } from 'vite';
import { extension } from '../../src/index.js';

export async function buildFixture(
	name: string,
	options?: { write?: boolean },
) {
	const MANIFEST_ROOT = path.resolve(__dirname, `../fixtures/${name}`);
	return await build({
		root: MANIFEST_ROOT,
		logLevel: 'warn',
		plugins: [extension()],
		build: {
			minify: false,
			write: options?.write ?? false,
		},
	});
}
