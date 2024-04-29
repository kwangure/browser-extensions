const STYLE_ID = 'red-border-style';
let styleTag = document.getElementById(STYLE_ID);
if (!styleTag) {
	styleTag = document.createElement('style');
	styleTag.setAttribute('id', STYLE_ID);
	document.head.appendChild(styleTag);
}

const NO_STYLES = '';
const RED_BORDER_STYLES = '* { border: 1px solid red !important; }';
if (styleTag.textContent === RED_BORDER_STYLES) {
	styleTag.textContent = NO_STYLES;
} else {
	styleTag.textContent = RED_BORDER_STYLES;
}

// TypeScript treat this file as module
export {};
