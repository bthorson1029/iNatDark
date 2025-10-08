/* DOM utilities: route change detection + MutationObserver */
(function () {
    const doc = document;


    function onRouteChange(callback) {
        // Patch pushState/replaceState
        const origPush = history.pushState;
        const origReplace = history.replaceState;
        function fire() { callback(location.pathname + location.search + location.hash); }
        history.pushState = function () { const r = origPush.apply(this, arguments); fire(); return r; };
        history.replaceState = function () { const r = origReplace.apply(this, arguments); fire(); return r; };
        window.addEventListener('popstate', fire, { passive: true });
    }


    function observeMutations(callback) {
        const mo = new MutationObserver(muts => {
            // Coalesce
            if (observeMutations._t) cancelAnimationFrame(observeMutations._t);
            observeMutations._t = requestAnimationFrame(() => callback(muts));
        });
        mo.observe(doc.body || doc.documentElement, { childList: true, subtree: true, attributes: true });
        return () => mo.disconnect();
    }


    function prefersDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }


    window.__inatDom = { onRouteChange, observeMutations, prefersDark };
})();