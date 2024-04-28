import { assert, describe, expect, it } from 'vitest';
import { buildFixture } from './utils/fixture.js';

describe('build', () => {
	it('outputs action default popup', async () => {
		const result = await buildFixture('action-default-popup');

		assert(!Array.isArray(result), 'must have a single output');
		assert('output' in result, 'must not be a watcher');

		let cssAsset;
		let htmlAsset;
		let manifestChunk;
		let javaScriptChunk;
		for (const output of result.output) {
			if (output.name === 'main.css') cssAsset = output;
			if (output.fileName === 'index.html') htmlAsset = output;
			if (output.fileName === 'manifest.json') manifestChunk = output;
			if (output.fileName === 'main.js') javaScriptChunk = output;
		}

		assert(cssAsset?.type === 'asset', 'css must be defined');
		expect(cssAsset.source).toMatchFileSnapshot(
			`./fixtures/action-default-popup/main.css`,
		);

		assert(htmlAsset?.type === 'asset', 'html must be defined');

		assert(manifestChunk?.type === 'chunk', 'manifest must be defined');
		expect(JSON.parse(manifestChunk.code).action).toStrictEqual({
			default_popup: 'index.html',
		});

		assert(javaScriptChunk?.type === 'chunk', 'javascript must be defined');
		expect(javaScriptChunk.code).toMatchFileSnapshot(
			`./fixtures/action-default-popup/main.ts`,
		);
	});
});
