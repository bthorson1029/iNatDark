// Content script: early FOUC guard + toggle injection + observers
// Enhanced with persistent theme saving and dark logo swap

const API = typeof browser !== 'undefined' ? browser : chrome;

function attachObservers() {
    window.__inatDom.observeMutations(() => {
        window.__inatTheme.reapply();
        setTimeout(bindToggleOnce, 0);
    });
    window.__inatDom.onRouteChange(() => {
        window.__inatTheme.reapply();
        setTimeout(() => { renderToggle(); bindToggleOnce(); }, 0);
    });
}

(async function main() {
    try {
        await initTheme();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => { renderToggle(); attachObservers(); bindToggleOnce(); }, { once: true });
        } else { renderToggle(); attachObservers(); bindToggleOnce(); }
    } catch (err) {
        document.documentElement.style.visibility = 'visible';
        const guard = document.documentElement.querySelector('style[data-inat-fouc]');
        if (guard) guard.remove();
        console.error('[iNat Dark] init error', err);
    }
})();

(function () {
    try {
        API.runtime.onMessage.addListener((msg) => {
            if (!msg || typeof msg !== 'object') return;
            if (msg.type === 'inat-set-mode') {
                setModeFromPopup(msg.mode);
            }
        });
    } catch (e) { }
})();

const DARK_LOGO_URL = API.runtime.getURL('assets/iNat-logo--white.svg');

function applyStoredTheme() {
    API.storage.sync.get('inatDarkPref', ({ inatDarkPref }) => {
        if (inatDarkPref === 'dark') {
            document.documentElement.classList.add('inat-dark');
        } else if (inatDarkPref === 'light') {
            document.documentElement.classList.remove('inat-dark');
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('inat-dark');
            } else {
                document.documentElement.classList.remove('inat-dark');
            }
        }
        syncLogoWithTheme();
    });
}

function setModeFromPopup(mode) {
    if (mode === 'dark') {
        document.documentElement.classList.add('inat-dark');
        API.storage.sync.set({ inatDarkPref: 'dark' });
    } else if (mode === 'light') {
        document.documentElement.classList.remove('inat-dark');
        API.storage.sync.set({ inatDarkPref: 'light' });
    } else {
        API.storage.sync.remove('inatDarkPref', function(){ applyStoredTheme(); });
        return;
    }
    syncLogoWithTheme();
}

function bindToggleOnce(){
    const btn = document.getElementById('inat-dark-toggle');
    if (btn && !btn.dataset.bound) {
        btn.addEventListener('click', () => {
            const dark = document.documentElement.classList.toggle('inat-dark');
            API.storage.sync.set({ inatDarkPref: dark ? 'dark' : 'light' });
            syncLogoWithTheme();
            API.runtime.sendMessage({ type: 'inat-mode-updated', mode: dark ? 'dark' : 'light' });
        });
        btn.dataset.bound = '1';
    }
}

applyStoredTheme();

(function watchHistory() {
    const pushState = history.pushState;
    history.pushState = function () {
        pushState.apply(this, arguments);
        applyStoredTheme();
        bindToggleOnce();
    };
    window.addEventListener('popstate', function(){ applyStoredTheme(); bindToggleOnce(); });
})();

if (API.storage && API.storage.onChanged && typeof API.storage.onChanged.addListener === 'function') {
    API.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.inatDarkPref) {
            applyStoredTheme();
        }
    });
}

function findLogo() {
    return (
        document.querySelector('#header img') ||
        document.querySelector('#header .logo img') ||
        document.querySelector('.navbar-brand img') ||
        null
    );
}

function syncLogoWithTheme() {
    const logo = findLogo();
    if (!logo) return;
    const dark = document.documentElement.classList.contains('inat-dark');

    if (!logo.dataset.originalLogo) {
        logo.dataset.originalLogo = logo.currentSrc || logo.src || '';
        logo.dataset.originalWidth = logo.width;
        logo.dataset.originalHeight = logo.height;
    }

    if (dark) {
        if (logo.src !== DARK_LOGO_URL) {
            logo.src = DARK_LOGO_URL;
            logo.srcset = DARK_LOGO_URL;
            if (logo.dataset.originalWidth) logo.width = logo.dataset.originalWidth;
            if (logo.dataset.originalHeight) logo.height = logo.dataset.originalHeight;
            logo.style.removeProperty('filter');
        }
    } else {
        const orig = logo.dataset.originalLogo;
        if (orig && logo.src !== orig) {
            logo.src = orig;
            logo.srcset = orig;
            if (logo.dataset.originalWidth) logo.width = logo.dataset.originalWidth;
            if (logo.dataset.originalHeight) logo.height = logo.dataset.originalHeight;
            logo.style.removeProperty('filter');
        }
    }
}

const classObserver = new MutationObserver(() => syncLogoWithTheme());
classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

const domObserver = new MutationObserver(() => { syncLogoWithTheme(); bindToggleOnce(); });
domObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });