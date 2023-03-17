const boot = () => {
	const blocks = document.querySelectorAll('code');
	blocks.forEach(block => execute(block))
}

document.addEventListener('DOMContentLoaded', () => {
    boot();
})