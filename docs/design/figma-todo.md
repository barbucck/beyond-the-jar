# Figma follow-up

Temporary design tasks. Last resumed: 2026-09-07.

## Figma location

- File: https://www.figma.com/design/VFmapjsBRhtFedRPmtZBkd/Beyond-the-Jar-UX-UI-Exploration
- Existing component canvas: `8:2` (10 Component · Mission Card).
- Mobile dashboard: `13:2` (390 × 844).
- Desktop dashboard: `20:28` (1440 × 1000), incomplete.
- Desktop sidebar: `20:29`; main content: `20:30`.
- Mission Card component set: `8:143`.

## Brand color migration

- [x] Update `brand/deep` to `#4B3F50` and `brand/soft` to `#E9E1E9`. Existing aliases update global progress and primary actions.
- [x] Bind the mobile eyebrow, "Voir les 3", and active navigation icon and label to `action/primary`.
- [x] Keep Exploration card labels, stars, status indicator and ticket accents green.
- [x] Recolor the generic Mission Card documentation eyebrow and the corresponding accents in the existing standalone content copy (`15:15`).
- [ ] Add or verify hover/pressed `#5D4D63` and focus outline `#927D98` tokens and interaction states. White on primary remains `#FFFFFF`.
- [ ] Audit the cover and foundations documentation for remaining generic green accents and outdated written color values.

## Mobile dashboard corrections

- [x] Remove the collision between "18 missions accomplies" and "18 / 150".
- [x] Stack the eyebrow, "18 / 150" metric, and "missions accomplies" label in a vertical auto-layout at 390 px width.
- [x] Widen the rewards navigation item so its label fits.
- [x] Inspect the progress block and complete mobile screenshot after the plum migration.
- [x] Verify the mobile text still uses Manrope.

## Desktop dashboard — in progress

- [x] Create the desktop wrapper on the existing canvas, with auto-layout sidebar and main content.
- [x] Adapt the existing header and navigation to desktop; inspect the header screenshot.
- [ ] Add the desktop progress block. The attempted write was rejected by the MCP quota; it was not applied.
- [ ] Add the missions section, reusing Mission Card instances for the three in-progress missions.
- [ ] Add the available reward section.
- [ ] Keep the same hierarchy as mobile: overall progress and primary action, in-progress missions, available reward.
- [ ] Validate resizing, text fit, Manrope typography, semantic color bindings and the complete desktop screenshot.
- [ ] Obtain user validation of the completed dashboard direction before creating the remaining application screens.

## Resume notes

- The Figma Starter MCP call limit was reached again on 2026-09-07. Account inspection confirmed the Starter tier.
- Resume in the existing desktop frame; do not create a duplicate.
- Desktop contains only its header and sidebar so far and is not ready for visual approval.
- Keep additional mockups on the existing component canvas to respect the three-page constraint.
- [ ] Fix the progress summary in the standalone content copy (`15:15`) beside mobile: the user reported its remaining overlap on 2026-09-07. Apply the same vertical metric/label layout as mobile `13:2`. The correction was attempted but rejected by the MCP quota; no change was applied to this copy.
- No application implementation was started.


## Local prototype follow-up — 2026-09-08

- The interactive dashboard is available in `prototype/index.html`; open it directly without installing dependencies.
- It includes mobile carousel, mission category/status filters, completion examples, chronological sorting, age badges, reward history, obtained-reward total and closest upcoming milestone.
- Later prototype refinements (including removal of ticket notches) have not been synchronized back to Figma. The incomplete Figma desktop frame and other unchecked tasks above remain outstanding.
- See `prototype/README.md` for the in-memory data and single-reward simulation limits.

## Figma synchronization attempt — 2026-09-10

- Updated all ten Mission Card variants: removed decorative ticket notches, applied pastel surface tints, increased title size to 21 px, and added a check to completed labels.
- Fixed the stale overlapping progress summary in standalone copy `15:15`.
- Added mobile status/category filter mockups and carousel control labels. The featured card includes a 17-day age label for the September 10 snapshot.
- Mobile frame `13:2` was extended to 1300 px to accommodate follow-up sections; the bottom navigation was moved down. This is an intermediate canvas state, not a final validated viewport.
- Inspected the mobile content screenshot. Further visual QA and closer alignment with the HTML prototype are still required, including real icon vectors, a separate age badge and the carousel next-card preview.
- The next write (reward total/history entry, gold accent, nearest reward, and category progression) was rejected by the Starter MCP quota and was not applied.
- Desktop `20:28` remains incomplete. Reward history mockups and final full-frame verification remain outstanding.
- Resume from these existing nodes, without creating duplicate filters or replacing the HTML prototype.
## Figma synchronization — 2026-09-14

- Confirmed existing mobile filters and desktop shell via a successful read.
- Added mobile Rewards section `31:24`: heading, `0 / 15 récompenses obtenues`, closest reward `Insolite — encore 7 missions`, and history link.
- Reparented existing reward card `13:37` into this section, resized it to 342 x 112, and applied a subtle gold inner glow while keeping the gray fill. This is an interim treatment; compare with the prototype gift halo during visual QA.
- Updated mobile canvas height and bottom navigation position.
- Created nodes: `31:24`, `31:25`, `31:26`, `31:27`, `31:28`. Mutated: `13:3`, `13:37`, `13:41`, `13:2`, `13:44`.
- The next screenshot call hit the Figma MCP Starter limit. Changes were confirmed by the successful write response but have NOT been visually verified.
- Next: screenshot `31:24` and the mobile screen; complete category progression, proper vector controls and age badge, then desktop and reward history views. The history text currently has no prototype interaction.
