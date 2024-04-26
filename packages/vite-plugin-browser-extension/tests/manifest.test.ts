import type { OutputChunk } from 'rollup';
import { assert, describe, expect, it } from 'vitest';
import { buildFixture } from './utils/fixture.js';

describe('build', () => {
	it('outputs manifest.json when input is valid', async () => {
		const result = await buildFixture('valid-manifest');
		let entryChunk: OutputChunk | undefined;

		if (Array.isArray(result)) {
			assert(result.length === 1, 'must have only one output');
			assert(
				result[0]?.output.length === 1,
				'must produce only one chunk',
			);
			entryChunk = result[0]?.output?.[0];
		} else {
			assert('output' in result, 'must not be a watcher');
			assert(result.output.length === 1, 'must produce only one chunk');
			entryChunk = result.output?.[0];
		}

		assert(entryChunk, 'must produce an entry chunk');
		expect(entryChunk.code).toMatchInlineSnapshot(`
			"{
			    "name": "valid-manifest",
			    "version": "1.0.0",
			    "manifest_version": 3,
			    "description": "Valid manifest."
			}
			"
		`);
	});
});
