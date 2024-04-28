import { manifest } from './plugins/manifest.js';
import { underscoreReplacer } from './plugins/underscore-replacer.js';

export function extension() {
	return [manifest(), underscoreReplacer()];
}
