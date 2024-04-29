const STYLE_ID = 'translucent-background-style';
let styleTag = document.getElementById(STYLE_ID);
if (!styleTag) {
	styleTag = document.createElement('style');
	styleTag.setAttribute('id', STYLE_ID);
	document.head.appendChild(styleTag);
}

const NO_STYLES = '';
const DARK_STYLES = '* { background: rgb(255 255 255 / 10%) !important; }';
const LIGHT_STYLES = '* { background: rgb(0 0 0 / 10%) !important; }';

if (styleTag.textContent === NO_STYLES) {
	styleTag.textContent = DARK_STYLES;
} else if (styleTag.textContent === DARK_STYLES) {
	styleTag.textContent = LIGHT_STYLES;
} else if (styleTag.textContent === LIGHT_STYLES) {
	styleTag.textContent = NO_STYLES;
}

// TypeScript treat this file as module
export {};
