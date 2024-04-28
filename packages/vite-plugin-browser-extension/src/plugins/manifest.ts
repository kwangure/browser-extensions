import type { Logger, Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { Err, parseJson } from '../utils/index.js';
import { manifestSchema, type ExtensionManifest } from '../schema.js';
import type { ZodError } from 'zod';

const MANIFEST_SUFFIX = '::manifest';

/**
 * A Vite plugin for building browser extensions
 */
export function manifest(): Plugin[] {
	let logger: Logger;
	let root: string;
	return [
		{
			// Run before vite:json loads manifest
			enforce: 'pre',
			name: 'vite-plugin-browser-extension:manifest',
			config() {
				return {
					build: {
						rollupOptions: {
							input: ['manifest.json'],
							output: {
								preserveModules: true,
								// Called for all modules when `preserveModules` is true
								entryFileNames(chunkInfo) {
									if (
										chunkInfo.facadeModuleId?.endsWith(
											MANIFEST_SUFFIX,
										)
									) {
										return 'manifest.json';
									}
									// Omit [hash] since extensions don't
									// need cache-busting, and deterministic
									// outputs simplifies testing
									return '[name].js';
								},
							},
							preserveEntrySignatures: 'strict',
						},
					},
				};
			},
			configResolved(config) {
				logger = config.logger;
				root = config.root;
			},
			resolveId(id) {
				if (id === 'manifest.json') {
					return path.join(root, `${id}${MANIFEST_SUFFIX}`);
				}
			},
			load(id) {
				if (!id.endsWith(MANIFEST_SUFFIX)) return;

				const filepath = id.replace(MANIFEST_SUFFIX, '');
				const dirname = path.dirname(filepath);
				const content = fs.readFileSync(filepath, 'utf-8');
				const parseJsonResult = parseJson(content);
				if (!parseJsonResult.ok) {
					logger.error(
						`Error parsing '${filepath}'. ${parseJsonResult.error}`,
						{ timestamp: true },
					);
					return;
				}
				const parseResult = manifestSchema.safeParse(
					parseJsonResult.value,
				);
				if (!parseResult.success) {
					logger.error(formatZodError(parseResult.error), {
						timestamp: true,
					});
					return parseResult.data;
				}

				const manifest = parseResult.data;
				const { default_popup } = manifest.action ?? {};
				if (default_popup) {
					const resolvedId = path.resolve(dirname, default_popup);
					// Emit html as a chunk so that its CSS and JS etc. can be
					// handled by Vite
					this.emitFile({
						type: 'chunk',
						importer: id,
						id: resolvedId,
					});
				}

				const contentScripts = manifest.content_scripts ?? [];
				for (const script of contentScripts) {
					const { css, js } = script;
					if (js) {
						const TS_REGEX = /\.ts$/;
						let i = 0;
						for (const jsOrTsScriptFileName of js) {
							const resolvedId = path.resolve(
								dirname,
								jsOrTsScriptFileName,
							);
							const jsScriptFileName =
								jsOrTsScriptFileName.replace(TS_REGEX, '.js');
							js[i] = jsScriptFileName;
							this.emitFile({
								type: 'chunk',
								fileName: jsScriptFileName,
								importer: id,
								id: resolvedId,
							});
							i++;
						}
					}
					if (css) {
						for (const cssScriptFileName of css) {
							const resolvedId = path.resolve(
								dirname,
								cssScriptFileName,
							);
							const code = fs.readFileSync(resolvedId, 'utf-8');
							this.emitFile({
								type: 'asset',
								fileName: cssScriptFileName,
								source: code,
							});
						}
					}
				}

				// We use `console.log` which has side effects so that it is
				// not eliminated as dead code.
				return [
					'console.log("---MANIFEST-START---",',
					`\`${JSON.stringify(parseResult.data, null, 4)}\``,
					', "---MANIFEST_END---")',
				].join('\n');
			},
			generateBundle(__outputOptions, bundle) {
				const manifestChunk = bundle['manifest.json'];
				if (manifestChunk?.type !== 'chunk') return;
				const { code } = manifestChunk;
				const manifestResult = extractManifestJSON(code);
				if (!manifestResult.ok) {
					return logger.error(
						`Error rendering "manifest.json" output. ${manifestResult.error}`,
						{ timestamp: true },
					);
				}
				manifestChunk.code = JSON.stringify(
					manifestResult.value,
					null,
					4,
				);
			},
		},
	];
}

function extractManifestJSON(jsCode: string) {
	const jsonRegex =
		/"---MANIFEST-START---".*`(\{.*\})`.*"---MANIFEST_END---"/s;
	const match = jsonRegex.exec(jsCode);
	if (!match || !match[1]) {
		return Err(
			'extract-manifest',
			new Error('Manifest missing from JavaScript code.'),
		);
	}
	return parseJson<ExtensionManifest>(match[1]);
}

const LINE_DELIMETER = '\n\t- ';
function formatZodError(error: ZodError) {
	const { fieldErrors, formErrors } = error.flatten();
	let message = formErrors.join(' ');
	if (message.length && message.at(-1) !== '.') message += '.';
	for (const [path, errors] of Object.entries(fieldErrors)) {
		message += ` Field error at "manifest.${path}"`;
		message += errors?.length
			? `:${LINE_DELIMETER}${errors.join(LINE_DELIMETER)}`
			: '';
		if (message.length && message.at(-1) !== '.') message += '.';
	}
	return message;
}
