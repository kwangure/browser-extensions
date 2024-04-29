<script lang="ts">
	import backgroundAll from '$scripts/background-translucent-all.js?worker&url';
	import borderAll from '$scripts/border-red-all.js?worker&url';

	async function executeScripts(...scripts: string[]) {
		const [activeTabResult] = await chrome.tabs.query({
			active: true,
			lastFocusedWindow: true,
		});
		if (!activeTabResult?.id) {
			console.warn(
				'Active tab not found.',
				activeTabResult ? { activeTabResult } : '',
			);
			return;
		}
		chrome.scripting.executeScript({
			target: { tabId: activeTabResult.id },
			files: scripts,
		});
	}

	function toggleBackgroundAll() {
		executeScripts(backgroundAll);
	}

	function toggleBorderAll() {
		executeScripts(borderAll);
	}
</script>

<div class="button-wrapper">
	<button on:click={toggleBackgroundAll}> Background Translucent All </button>
	<button on:click={toggleBorderAll}> Border Red All </button>
</div>

<style>
	.button-wrapper {
		display: flex;
		flex-direction: column;
		width: max-content;
		padding: var(--st-size-1) var(--st-size-2);
		gap: var(--st-size-1);
	}
	button {
		border-radius: var(--st-size-1);
		padding: var(--st-size-1) var(--st-size-2);
		white-space: nowrap;
		width: 100%;
		text-align: left;
	}
	button:hover {
		background-color: rgb(0, 0, 0, 0.1);
	}
</style>
