import type { Plugin } from 'vite';
import { manifestBuild } from './build.js';

/**
 * A Vite plugin for building browser extensions
 */
export function manifest(): Plugin[] {
	return [manifestBuild()];
}
