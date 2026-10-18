# Dark Mode for iNaturalist

A Chrome and Firefox extension that adds a persistent, accessible dark mode to [iNaturalist](https://www.inaturalist.org/).

<!-- Screenshot: add an image of a dark-mode page here, e.g. ![Observation page in dark mode](docs/screenshot.png) -->

## Install

- **Chrome / Edge:** [Chrome Web Store](https://chromewebstore.google.com/detail/dark-mode-for-inaturalist/ebjjolldjgccdfipdbdfmpcmienpfblg)
- **Firefox:** [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/dark-mode-for-inaturalist/)

## Usage

Open the toolbar popup and choose **System**, **Light** or **Dark**. System follows your OS setting live, and the choice applies to every open iNaturalist tab.

## Privacy

The extension collects no data. It stores only your theme choice, in your browser's synced extension storage. See [PRIVACY.md](PRIVACY.md).

## Reporting a broken page

iNaturalist changes its pages often, so some areas may need new rules. [Open an issue](https://github.com/bthorson1029/iNatDark/issues) with the page URL and a screenshot of the problem.

## Design & Accessibility

- The theme is a single `html.inat-dark` class plus CSS variables, which keeps the risk of breaking the site low.
- Images, avatars, observation photos, and map tiles are never inverted.
- Focus states are visible, and `prefers-reduced-motion` is respected.
- Colors target WCAG AA contrast.

## How It Works

- **No flash of light theme:** the content script hides the page at `document_start` until the saved preference is read, with a one-second failsafe.
- **Persistence:** the popup stores `inatDarkPref` (`dark`, `light`, or unset for System) in `storage.sync`; every open tab picks up changes through `storage.onChanged`.
- **Dynamic content:** the theme is one class on `<html>`, which survives in-page navigation, so nothing needs re-applying.

## Development

Load the extension from source:

- **Chrome / Edge:** go to `chrome://extensions/`, turn on **Developer mode**, click **Load unpacked** and select the folder containing `manifest.json`. After editing files, click the reload icon on the extension's card, then refresh iNaturalist.
- **Firefox:** go to `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on...** and select `manifest.json`.

Guidelines:

- Scope every rule under `html.inat-dark`, so light mode is never affected.
- Change colors, not layout: check each fix against light mode so spacing and states match.
- When an area breaks, extend the existing rule for that kind of surface or text before adding a new one.
- Avoid blanket `filter: invert()` techniques.

## Releasing

1. Bump `version` in `manifest.json` and date the entry in [CHANGELOG.md](CHANGELOG.md).
2. Commit to `main` and tag it `vX.Y.Z`.
3. Build two zips of the tagged files into `dist/` (ignored by git), with `manifest.json` at the zip root:
   - `iNatDark-chrome-X.Y.Z.zip`: every tracked file except `.gitignore`.
   - `dark_mode_for_inaturalist-X.Y.Z.zip`: the same, minus `README.md` and `CHANGELOG.md`.
4. Upload the Chrome zip in the Chrome Web Store developer dashboard, and the Firefox zip as a new version on AMO. AMO signs it after review.

## License

MIT. See [LICENSE](LICENSE).
