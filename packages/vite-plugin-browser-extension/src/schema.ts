import { z } from 'zod';

const contentScriptSchema = z.object({
	matches: z.array(z.string()),
	js: z
		.string()
		.refine(
			(value) => value.at(0) !== '.' && value.at(0) !== '/',
			(value) => ({
				message: `Path should not be relative or absolute. Example: "src/file.js", found "${value}" instead.`,
			}),
		)
		.array()
		.optional(),
	css: z
		.string()
		.refine(
			(value) => value.at(0) !== '.' && value.at(0) !== '/',
			(value) => ({
				message: `Path should not be relative or absolute. Example: "src/file.css", found "${value}" instead.`,
			}),
		)
		.array()
		.optional(),
	run_at: z
		.enum(['document_start', 'document_end', 'document_idle'])
		.optional(),
	match_about_blank: z.boolean().optional(),
	match_origin_as_fallback: z.boolean().optional(),
	world: z.enum(['ISOLATED', 'MAIN']).optional(),
});

const actionSchema = z.object({
	default_title: z.optional(z.string()),
	default_popup: z.optional(z.string()),
});

const permissions = z.enum([
	'activeTab',
	'alarms',
	'background',
	'bookmarks',
	'browsingData',
	'certificateProvider',
	'clipboardRead',
	'clipboardWrite',
	'contentSettings',
	'contextMenus',
	'cookies',
	'debugger',
	'declarativeContent',
	'declarativeNetRequest',
	'declarativeNetRequestWithHostAccess',
	'declarativeNetRequestFeedback',
	'declarativeNetRequestFeedback',
	'desktopCapture',
	'documentScan',
	'downloads',
	'enterprise.deviceAttributes',
	'enterprise.hardwarePlatform',
	'enterprise.networkingAttributes',
	'enterprise.platformKeys',
	'experimental',
	'fileBrowserHandler',
	'fileSystemProvider',
	'fontSettings',
	'gcm',
	'geolocation',
	'history',
	'identity',
	'idle',
	'loginState',
	'management',
	'nativeMessaging',
	'notifications',
	'offscreen',
	'pageCapture',
	'platformKeys',
	'power',
	'printerProvider',
	'printing',
	'printingMetrics',
	'privacy',
	'processes',
	'proxy',
	'scripting',
	'search',
	'sessions',
	'sidePanel',
	'storage',
	'system.cpu',
	'system.display',
	'system.memory',
	'system.storage',
	'tabCapture',
	'tabGroups',
	'tabs',
	'topSites',
	'tts',
	'ttsEngine',
	'unlimitedStorage',
	'vpnProvider',
	'wallpaper',
	'webAuthenticationProxy',
	'webNavigation',
	'webRequest',
	'webRequestBlocking',
]);

export const manifestSchema = z.object({
	name: z.string(),
	version: z.string(),
	manifest_version: z.literal(3).default(3),
	action: actionSchema.optional(),
	content_scripts: z.array(contentScriptSchema).optional(),
	description: z.string().optional(),
	homepage_url: z.string().optional(),
	host_permissions: z.string().array().optional(),
	optional_host_permissions: z.string().array().optional(),
	optional_permissions: permissions.array().optional(),
	permissions: permissions.array().optional(),
	short_name: z.string().optional(),
});

export type ExtensionManifest = z.output<typeof manifestSchema>;
