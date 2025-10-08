/* Storage helpers with small schema + migration */
(function () {
    const KEY = 'inatDarkSettings';
    const DEFAULTS = {
        mode: 'system', // 'dark' | 'light' | 'system'
        darkMapUI: false,
        toggleCorner: 'bottom-right', // 'bottom-right'|'bottom-left'|'top-right'|'top-left'
        positions: {} // { origin: { x, y } } for draggable toggle
    };


    const api = typeof browser !== 'undefined' ? browser : chrome;


    async function getSettings() {
        return new Promise(resolve => {
            api.storage.sync.get([KEY], data => {
                const val = data[KEY] || {};
                resolve({ ...DEFAULTS, ...val });
            });
        });
    }


    async function setSettings(next) {
        const prev = await getSettings();
        const merged = { ...prev, ...next };
        return new Promise(resolve => api.storage.sync.set({ [KEY]: merged }, resolve));
    }


    async function setMode(mode) { return setSettings({ mode }); }
    async function setToggleCorner(toggleCorner) { return setSettings({ toggleCorner }); }
    async function setDarkMapUI(darkMapUI) { return setSettings({ darkMapUI }); }
    async function setPositionForOrigin(origin, pos) {
        const s = await getSettings();
        const positions = { ...s.positions, [origin]: pos };
        return setSettings({ positions });
    }
    async function getPositionForOrigin(origin) {
        const s = await getSettings();
        return s.positions[origin] || null;
    }


    // Expose
    window.__inatStorage = {
        KEY,
        getSettings,
        setSettings,
        setMode,
        setToggleCorner,
        setDarkMapUI,
        setPositionForOrigin,
        getPositionForOrigin
    };
})();