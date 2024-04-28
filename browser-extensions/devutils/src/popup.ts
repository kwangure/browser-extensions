import borderRedAll from './scripts/border-red-all.js?worker&url';

document
	.getElementById('border-red-all')
	?.addEventListener('click', async function executBorderRedAll() {
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
