const styleId = 'red-border-style';
const styleTag = document.getElementById(styleId);
if (styleTag) {
	styleTag.remove();
} else {
	const style = document.createElement('style');
	style.id = 'red-border-style';
	style.textContent = '* { border: 1px solid red !important; }';
	document.head.appendChild(style);
}
