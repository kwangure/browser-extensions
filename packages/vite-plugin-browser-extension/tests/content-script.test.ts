import type { OutputAsset, OutputChunk } from 'rollup';
import { assert, describe, expect, it } from 'vitest';
import { buildFixture } from './utils/fixture.js';

describe('build', () => {
	it('outputs JS content-scripts', async () => {
		const result = await buildFixture('content-script-js');

		assert(!Array.isArray(result), 'must have a single output');
		assert('output' in result, 'must not be a watcher');

		let manifestChunk;
		const chunks: OutputChunk[] = [];
		for (const output of result.output) {
			if (output.fileName === 'manifest.json') {
				manifestChunk = output;
			} else {
				assert(output.type === 'chunk', 'must be a chunk');
				chunks.push(output);
			}
		}

		assert(manifestChunk?.type === 'chunk', 'manifest must be defined');
		expect(JSON.parse(manifestChunk.code).content_scripts).toStrictEqual([
			{
				js: ['script.0.js', 'script.1.js'],
				matches: ['<all_urls>'],
			},
			{
				js: ['script.2.js', 'script.3.js'],
				matches: ['<all_urls>'],
			},
		]);

		for (let index = 0; index < chunks.length; index++) {
			expect(chunks[index]?.fileName).toEqual(`script.${index}.js`);
			expect(chunks[index]?.code).toMatchFileSnapshot(
				`./fixtures/content-script-js/script.${index}.${
					index % 2 ? 'js' : 'ts'
				}`,
			);
		}
	});
	it('outputs CSS content-scripts', async () => {
		const result = await buildFixture('content-script-css');

		assert(!Array.isArray(result), 'must have a single output');
		assert('output' in result, 'must not be a watcher');

		let manifestChunk;
		const assets: OutputAsset[] = [];
		for (const output of result.output) {
			if (output.fileName === 'manifest.json') {
				manifestChunk = output;
			} else {
				assert(output.type === 'asset', 'must be an asset');
				assets.push(output);
			}
		}

		assert(manifestChunk?.type === 'chunk', 'manifest must be defined');
		expect(JSON.parse(manifestChunk.code).content_scripts).toStrictEqual([
			{
				css: ['script.0.css', 'script.1.css'],
				matches: ['<all_urls>'],
			},
			{
				css: ['script.2.css', 'script.3.css'],
				matches: ['<all_urls>'],
			},
		]);

		for (let index = 0; index < assets.length; index++) {
			expect(assets[index]?.fileName).toEqual(`script.${index}.css`);
			expect(assets[index]?.source).toMatchFileSnapshot(
				`./fixtures/content-script-css/script.${index}.css`,
			);
		}
	});
});
