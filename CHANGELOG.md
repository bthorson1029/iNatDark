# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-07-16

### Added
- Dark styling for the sidebar layout: `.mainrow`, the collapsible `SideBar` and
  its hide button now use the card surface instead of showing through white.
- Dark styling for the left navigation menu, with the active item highlighted in
  the brand green.
- Dark styling for pagination controls, with the current page marked by a
  brand-green border.
- Dark surfaces for the universal search autocomplete dropdown, including
  squared-off result thumbnails.

### Changed
- The focused result in the search autocomplete is now marked with a brand-green
  outline, keeping keyboard navigation visible against the new dropdown surfaces.
- Added a subtle inset top shadow to the main content row for better separation
  from the header.
- Added spacing above the Add Observation button so it no longer sits flush
  against the content above it.

## [1.0.1] - 2026-07-14

### Fixed
- Dark styling no longer leaks into light mode on observation pages — the data
  quality assessment, "More from this user," and main content-column backgrounds
  are now correctly scoped to dark mode only.
- Restored the dark background on the main content column (`.col-sm-8`) that had
  stopped applying due to a selector typo.
- Removed a stray white background on app-shell pages by extending the dark theme
  to the `#app` container.

### Changed
- Clearer table zebra-striping with a brighter alternating-row color.
- Annotation tables on observation pages now use the correct dark row background,
  fixing washed-out contrast.

### Maps
- Fixed the observations map view: the map now fills the viewport height instead
  of collapsing, and its background respects the dark theme.
- Species common names on the map now use the muted text color for a cleaner
  visual hierarchy.

## [1.0.0] - 2026-07-14

### Added
- Initial release: persistent, accessible dark mode for iNaturalist.
- Draggable on-page toggle and a toolbar popup with System / Light / Dark modes.
- Preferences persisted via `storage.sync`; theme reapplied on SPA navigation via
  a `MutationObserver` and history patching.
- Dark logo swap; images, avatars, observation photos, and map tiles are never
  inverted.

[1.0.2]: https://github.com/bthorson1029/iNatDark/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/bthorson1029/iNatDark/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/bthorson1029/iNatDark/releases/tag/v1.0.0
