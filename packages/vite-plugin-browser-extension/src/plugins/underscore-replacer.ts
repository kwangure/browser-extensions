import type { Plugin } from 'vite';

function fixKey(key: string): string {
	return key
		.split('/')
		.map((part) =>
			part.startsWith('_') ? 'noUnderscorePrefix' + part : part,
		)
		.join('/');
}

function fixValues(obj: { [key: string]: unknown }): void {
	for (const key in obj) {
		const value = obj[key];
		if (typeof value === 'string') {
			obj[key] = fixKey(value);
		}
	}
}

/**
 * Vite plugin rewrites filenames beginning "_". File & directory names in
 * Chrome extensions may not begin with "_".
 */
export function underscoreReplacer(): Plugin {
	return {
		enforce: 'pre',
		name: 'vite-plugin-browser-extension:underscore',
		generateBundle(__outputOptions, bundle) {
			for (const key in bundle) {
				if (key.includes('_')) {
					const newKey = fixKey(key);
					const oldValue = bundle[key];

					// @ts-expect-error stfu
					fixValues(oldValue);

					delete bundle[key];
					// @ts-expect-error stfu
					bundle[newKey] = oldValue;
				}
			}
		},
	};
}
