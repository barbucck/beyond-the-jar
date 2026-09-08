# Beyond the Jar — interactive dashboard prototype

Open `index.html` directly in a browser. No install, build, API, or internet connection is required. Resize the window to compare desktop and mobile layouts.

## Scope

This is a disposable HTML/CSS/JavaScript visual prototype, not the Angular application. It adapts the existing [Figma dashboard](https://www.figma.com/design/VFmapjsBRhtFedRPmtZBkd/Beyond-the-Jar-UX-UI-Exploration?node-id=13-2): smoky plum brand, Manrope typography, warm neutral surfaces, pastel category labels, and category-colored cards without decorative notches. Desktop shows the mission grid; mobile uses a swipeable carousel with previous/next buttons and an expanded-list action.

Interactions: open a mission, simulate completion, add a physically revealed mission, record a physically drawn reward and mark it used, navigate dashboard sections, and reset the demo. Data is fictional and kept in memory only. Reloading resets everything. The header and new events use the local current date; seeded missions retain their example dates. The application never draws or reveals unknown mission or reward content.

The complete mission/reward lifecycle, editing, correction, persistence, API and later application screens are outside this dashboard prototype. The reward demonstration covers the existing Exploration milestone at 10 completed missions; it is not a full reward engine.

## Design guidance

UI UX Pro Max was consulted for design-system and keyboard-focus guidance. Its automatic marketing-layout/style suggestions did not match the established Figma direction and were deliberately not adopted. The existing product decisions take precedence. The prototype uses responsive grid/flex layout, explicit labels, native modal dialogs, visible keyboard focus, reduced-motion support, and a stacked mobile progress metric to prevent the reported collision.

## Files

- `index.html`: semantic dashboard and dialog structure.
- `styles.css`: Figma-derived design tokens and responsive layouts.
- `app.js`: in-memory demo interactions; no packages or external services.
- `assets/Manrope.ttf` and `assets/OFL.txt`: locally bundled Manrope font and license from https://github.com/google/fonts/tree/main/ofl/manrope.

No project dependencies, package metadata or Figma nodes are changed by running this prototype.


## Mission ordering and age

Filtered cards are sorted by reveal date ascending, with ID as a stable tie-breaker. In-progress age is calculated in calendar days against the local current date, independently of daylight-saving changes. Completed cards show the fixed reveal-to-completion duration. Age badges use plum, never category colors: neutral below 14 days, soft plum from 14 days, solid plum from 30 days. These are prototype thresholds for visual aging, not deadlines or overdue states. Header, new reveal date and completion date now use the current local date instead of the original fixed Figma date. Example mission dates remain historical fixtures.


## Filters, rewards and current limits

- Mission status (in progress, completed, all) and category filters combine. Three completed example records represent a subset of the 18 completed missions in the counters.
- Category progress keeps milestone markers at 10 and 20, ending at 30. The rewards section shows the closest next milestone; equal-distance categories are grouped.
- Reward history opens from navigation or “Voir toutes les récompenses”. It filters the single simulated reward by available, drawn and used state, and records draw/use dates.
- Obtained rewards count drawn rewards, including those already used, out of 15. This prototype simulates one reward only: the count is therefore 0 or 1. It does not unlock additional reward records dynamically.
- Reward surfaces stay gray, with a subtle gold glow. Global actions and age indicators stay plum; category colors remain category-specific.

Validation: mission/category filters, empty states, reveal-date ordering, calendar-day age, mission completion, reward draw/use history and dates were exercised in a browser. No application build step is required.
