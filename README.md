# iNaturalist Dark Mode Toggle (MV3)


A Chrome/Firefox MV3 extension that adds a persistent, accessible dark mode to iNaturalist, with a draggable on-page toggle, MutationObserver handling for SPA-like navigation, and storage-backed preferences.


## Install (Developer Mode)


### Chrome / Edge (Chromium)
1. Download this repo as a folder.
2. Go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the folder containing `manifest.json`.


### Firefox (MV3)
1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...** and select `manifest.json`.


> Note: Firefox MV3 support is evolving; the extension is MV3-compatible and tested on recent versions. If needed, use `web-ext` for a smoother dev loop.


## Usage
- Visit `https://www.inaturalist.org/`.
- Toggle the plugin menu in the browser toolbar.
- Open the toolbar popup to change **Mode** (System/Light/Dark)


## Design & Accessibility
- Theme is applied via `html.inat-dark` and CSS variables to reduce risk of site breakage.
- Images, avatars, observation photos, and map tiles are never inverted.
- Focus states are visible; respects `prefers-reduced-motion`.
- Targets WCAG AA contrast with calibrated colors.


## How It Works
- **FOUC prevention**: content script injects a tiny style at `document_start`, then resolves visibility after reading settings.
- **Persistence**: preferences stored in `storage.sync` override system theme after first toggle.
- **Dynamic content**: a `MutationObserver` re-applies the theme when SPA navigation/infinite-scroll injects new nodes; route changes detected by patching `history` and listening to `popstate`.


## Development
- Edit CSS variables in `content/content.css` for quick visual tuning.
- Add specific component fixes under the `html.inat-dark` scope only.
- Avoid blanket `filter: invert()` techniques.


## Known Limitations
- If iNat ships structural CSS changes, some selectors may need updates.


## Packaging
- **Chrome**: Use the Extensions page > Pack extension, or `npm i -g chrome-extension-cli` equivalents.
- **Firefox**: Use `web-ext build` to produce a signed bundle for AMO.


## License
MIT