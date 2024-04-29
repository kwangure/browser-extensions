import backgroundTranslucentAll from './scripts/background-translucent-all.js?worker&url';
import borderRedAll from './scripts/border-red-all.js?worker&url';

document
	.getElementById('background-translucent-all')
	?.addEventListener(
		'click',
		async function executeBackgroundTranslucentAll() {
			const tabId = await getCurrentTabId();
			if (tabId === undefined) return;
			chrome.scripting.executeScript({
				target: { tabId },
				files: [backgroundTranslucentAll],
			});
		},
	);

document
	.getElementById('border-red-all')
	?.addEventListener('click', async function executeBorderRedAll() {
		const tabId = await getCurrentTabId();
		if (tabId === undefined) return;
		chrome.scripting.executeScript({
			target: { tabId },
			files: [borderRedAll],
		});
	});

async function getCurrentTabId() {
	const queryOptions = { active: true, lastFocusedWindow: true };
	return (await chrome.tabs.query(queryOptions))[0]?.id;
}
