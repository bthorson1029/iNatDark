/* Theme application + FOUC prevention */
(function () {
    const api = typeof browser !== 'undefined' ? browser : chrome;
    const DOC = document.documentElement;


    // Early FOUC guard if injected at document_start (content.js also duplicates fallback)
    if (!DOC.__inatFOUCStyle) {
        const s = document.createElement('style');
        s.textContent = 'html{visibility:hidden}';
        s.setAttribute('data-inat-fouc', '');
        document.documentElement.appendChild(s);
        DOC.__inatFOUCStyle = s;
    }


    async function applyInitialTheme() {
        const settings = await window.__inatStorage.getSettings();
        const mode = settings.mode;
        const dark = mode === 'dark' || (mode === 'system' && window.__inatDom.prefersDark());
        DOC.classList.toggle('inat-dark', !!dark);
        DOC.style.visibility = 'visible';
        const guard = DOC.querySelector('style[data-inat-fouc]');
        if (guard) guard.remove();
    }


    // Public
    window.__inatTheme = {
        async set(mode) {
            await window.__inatStorage.setMode(mode);
            const dark = mode === 'dark' || (mode === 'system' && window.__inatDom.prefersDark());
            DOC.classList.toggle('inat-dark', !!dark);
        },
        async reapply() {
            const s = await window.__inatStorage.getSettings();
            const dark = s.mode === 'dark' || (s.mode === 'system' && window.__inatDom.prefersDark());
            DOC.classList.toggle('inat-dark', !!dark);
        },
        applyInitialTheme
    };
})();