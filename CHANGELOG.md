# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - Unreleased

### Fixed
- Startup no longer crashes: the content script called two functions that did
  not exist, so its observers never attached. Theme startup is now a single,
  smaller script.
- System mode now follows an OS light/dark switch live, without a reload.
- One stored preference (`inatDarkPref`) drives the page and the popup; the
  unused second settings key no longer competes with it.
- The page can no longer stay hidden if storage fails (one-second failsafe on
  the flash-of-light guard).
- The header logo keeps its size and its high-resolution `srcset` when swapped.
- Unreadable text: Data Quality Assessment rows, the Identify and Compare modals
  (observer, common name, "Add to Favorites", filter labels, tab headings),
  the Edit Observations header band, project curator tools, taxon Status place
  names, account settings labels, map legends and the taxon "Recent
  Observations" title.
- Light surfaces left over in dark mode: Explore species search and filter
  footer, Identify progress bar, pagination outside the Identify sidebar, the
  life-list banner, chart controls and Wikipedia boxes on taxon About tabs.
- Disabled buttons on the upload page look disabled again.
- Identify's Annotations table no longer has a white first row, and taxon
  names in the taxonomy tree, home feed and Subscriptions use the link colour
  instead of near-black.
- 20 selectors that were not scoped to dark mode no longer change light mode.

### Changed
- Dark mode now changes colour only, not layout: removed extra card padding,
  button margins, input padding and table zebra-striping that light mode does
  not have, so pages keep the same height and spacing in both themes.
- The calendar keeps light mode's meaning: out-of-month days are faded, days
  with observations are links, and their shading still scales with the count.
- Taxon names keep iNaturalist's own colours instead of turning link-blue.

### Removed
- The draggable on-page toggle, which never rendered in any release; use the
  toolbar popup to switch modes.

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

[1.0.3]: https://github.com/bthorson1029/iNatDark/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/bthorson1029/iNatDark/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/bthorson1029/iNatDark/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/bthorson1029/iNatDark/releases/tag/v1.0.0
