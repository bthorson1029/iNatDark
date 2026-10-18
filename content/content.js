// Content script: applies the saved theme before first paint, keeps it in sync
// with the popup and the OS setting, and swaps the header logo for a light one.
(function () {
    const API = globalThis.chrome || globalThis.browser;
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    const DARK_LOGO_URL = API.runtime.getURL('assets/iNat-logo--white.svg');

    // 'dark' | 'light' | null (follow the OS)
    let pref = null;

    // FOUC guard: hide the page until the stored preference is known. The
    // timeout is a failsafe so a storage error can never leave it hidden.
    const guard = document.createElement('style');
    guard.textContent = 'html{visibility:hidden !important}';
    root.appendChild(guard);
    const reveal = () => guard.remove();
    setTimeout(reveal, 1000);

    function isDark() {
        return pref === 'dark' || (pref !== 'light' && systemDark.matches);
    }

    function apply() {
        root.classList.toggle('inat-dark', isDark());
        syncLogo();
    }

    function readPref(value) {
        return value === 'dark' || value === 'light' ? value : null;
    }

    try {
        API.storage.sync.get('inatDarkPref', (data) => {
            pref = readPref(data && data.inatDarkPref);
            apply();
            reveal();
        });
    } catch (err) {
        console.error('[iNat Dark] could not read preference', err);
        apply();
        reveal();
    }

    // Popup changes arrive through storage, in this tab and every other one.
    API.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.inatDarkPref) {
            pref = readPref(changes.inatDarkPref.newValue);
            apply();
        }
    });

    // System mode follows the OS live, without a reload.
    systemDark.addEventListener('change', () => {
        if (pref === null) apply();
    });

    function findLogo() {
        return document.querySelector('#header img') ||
            document.querySelector('.navbar-brand img');
    }

    function syncLogo() {
        const logo = findLogo();
        if (!logo) return;

        if (!('originalSrc' in logo.dataset)) {
            // Wait until the site's logo has a size, so the swap can keep it.
            if (!logo.complete || !logo.offsetWidth) {
                if (!logo.__inatWaiting) {
                    logo.__inatWaiting = true;
                    logo.addEventListener('load', () => {
                        logo.__inatWaiting = false;
                        syncLogo();
                    }, { once: true });
                }
                return;
            }
            logo.dataset.originalSrc = logo.getAttribute('src') || '';
            logo.dataset.originalSrcset = logo.getAttribute('srcset') || '';
            logo.style.width = logo.offsetWidth + 'px';
            logo.style.height = logo.offsetHeight + 'px';
        }

        if (isDark()) {
            if (logo.getAttribute('src') !== DARK_LOGO_URL) {
                logo.removeAttribute('srcset');
                logo.setAttribute('src', DARK_LOGO_URL);
            }
        } else if (logo.getAttribute('src') !== logo.dataset.originalSrc) {
            logo.setAttribute('src', logo.dataset.originalSrc);
            if (logo.dataset.originalSrcset) logo.setAttribute('srcset', logo.dataset.originalSrcset);
        }
    }

    // The header is server-rendered, but some React pages re-render it; check
    // once per frame at most, and only while the logo still needs swapping.
    let scheduled = false;
    new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            const logo = findLogo();
            const want = isDark() ? DARK_LOGO_URL : logo && logo.dataset.originalSrc;
            if (logo && logo.getAttribute('src') !== want) syncLogo();
        });
    }).observe(root, { childList: true, subtree: true });
})();
