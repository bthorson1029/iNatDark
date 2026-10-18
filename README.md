# iNaturalist Dark Mode Toggle (MV3)


A Chrome/Firefox MV3 extension that adds a persistent, accessible dark mode to iNaturalist, with a toolbar popup for System / Light / Dark and storage-backed preferences.


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
- Open the toolbar popup to choose **System**, **Light** or **Dark**. System follows your OS setting live.


## Design & Accessibility
- Theme is applied via `html.inat-dark` and CSS variables to reduce risk of site breakage.
- Images, avatars, observation photos, and map tiles are never inverted.
- Focus states are visible; respects `prefers-reduced-motion`.
- Targets WCAG AA contrast with calibrated colors.


## How It Works
- **FOUC prevention**: the content script hides the page at `document_start` until the saved preference is read, with a one-second failsafe.
- **Persistence**: the popup stores `inatDarkPref` (`dark`, `light`, or unset for System) in `storage.sync`; every open tab picks up changes through `storage.onChanged`.
- **Dynamic content**: the theme is a single `html.inat-dark` class, which survives in-page navigation, so no re-application is needed.


## Development
- Edit CSS variables in `content/content.css` for quick visual tuning.
- Add specific component fixes under the `html.inat-dark` scope only.
- Change colors, not layout: check each fix against light mode so spacing and states match.
- Avoid blanket `filter: invert()` techniques.


## Known Limitations
- If iNat ships structural CSS changes, some selectors may need updates.


## Packaging
- **Chrome**: Use the Extensions page > Pack extension, or `npm i -g chrome-extension-cli` equivalents.
- **Firefox**: Use `web-ext build` to produce a signed bundle for AMO.


## License
MIT