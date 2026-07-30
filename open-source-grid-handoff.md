# Handoff: Open-source contributions grid

## Goal

Implement the agreed redesign of:

`/Users/jeremykreutzbender/Developer/jer-k/jeremykreutzbender.com/app/(site)/open_source/page.tsx`

Replace the single paginated pull-request list with a responsive repository grid. Each repository is a summary block, and selecting one inserts a full-width panel containing all of that repository's merged pull requests.

## Current status

- Planning/grilling is complete, and the user explicitly confirmed the plan.
- No implementation files were changed during this session.
- The next session should implement and verify the redesign.

## Confirmed product decisions

- Repository groups are keyed by `repository.nameWithOwner`.
- Repository order: newest contribution first.
- PR order within a repository: newest first.
- "Newest" and displayed contribution dates use `mergedAt`, not `createdAt`.
- Keep `createdAt` in the shared/API data contract and add `mergedAt` for backward compatibility.
- Remove page pagination; render every repository block.
- Initial state: all repositories collapsed.
- Only one repository may be expanded at a time.
- Responsive grid:
  - Below `md`: 1 column
  - `md`: 2 columns
  - `lg` and above: 3 columns
- Expanded content is a full-width panel immediately below the active block's current grid row.
- Repository blocks show:
  - Repository name with external GitHub link
  - Merged PR count
  - Most recent merge date
  - Most recent PR title, clamped to two lines
  - Expansion indicator
- The main block surface expands/collapses; the repository link remains independently clickable.
- Active block receives a stronger border/background treatment.
- Panel:
  - Single-column compact PR list
  - Sticky `top-0` header with repository link, PR count, and collapse control
  - No duplicate collapse button at the bottom
  - PR rows show merge icon, linked title, number, and merge date
  - Do not show `bodyHTML` excerpts
- Repository and PR links open GitHub in new tabs.
- Dates use a readable absolute format such as `Jul 29, 2026`, inside semantic `<time>` elements.
- Use restrained, site-native styling: subtle ring, minimal shadow, gentle hover state, stronger accent only when active.
- Use a short native transition for panel entrance/exit and grid movement; respect reduced-motion preferences.
- Expanded state is represented as `?repository=owner/name`.
- Replace the current history entry instead of adding entries for every selection.
- Invalid repository query values result in the fully collapsed state.
- Direct page loads with a valid repository query auto-scroll to the selected repository/panel once layout settles.
- Normal clicks do not force-scroll.
- Include responsive loading skeleton, empty state, and route-level retryable error state.

## Planned component strategy

Use a hybrid shadcn/custom implementation.

Reuse existing:

- `Card`
- `Button`
- `Badge`
- `Separator`
- `Skeleton`
- Lucide icons

Install/add these shadcn components:

- `Item` for compact PR rows and separators
- `Empty` for empty and error presentations

Official references:

- https://ui.shadcn.com/docs/components/base/item
- https://ui.shadcn.com/docs/components/base/empty

Do not add Accordion or Collapsible. Their trigger/content ownership assumes content adjacent to each item and conflicts with relocating one selected panel after the active responsive grid row.

Suggested component split:

- `page.tsx`: server-side fetch, initial query parsing, metadata
- Pure server-safe helper: grouping and sorting
- Client `OpenSourceGrid`: selection, responsive row-end placement, URL synchronization, transitions
- Focused repository-block component
- Focused expansion-panel component
- Focused PR-item component
- Grid skeleton and empty/error presentations

## Panel construction details

- Keep repository cards in a single CSS grid.
- Determine the active row's final item for the current 1/2/3-column breakpoint.
- Insert the panel in the React tree after that row-ending card and give it `grid-column: 1 / -1`.
- This is important: DOM, visual, and keyboard order should agree. Avoid `grid-auto-flow: dense` or rendering the panel after all cards.
- A small breakpoint subscription/hook can determine the insertion index. The cards themselves should remain CSS-responsive. Avoid duplicated mobile/tablet/desktop grids.
- The panel should be a semantic region connected to the trigger with `aria-expanded`, `aria-controls`, and `aria-labelledby`.
- Keep focus on the activating repository trigger when opening. Collapsing from the sticky header should restore focus to that repository trigger.
- To make the whole block expandable without nested interactive elements, use a stretched expansion button and layer the independent GitHub anchor above it.
- URL updates should preserve the selected client state without page scrolling. Use replacement semantics and avoid unnecessary data refetch if possible.

## Motion approach

The project uses Next.js 16.2.7 and React 19.2.7. Use React's native `<ViewTransition>` and `startTransition`; do not add an animation library or React canary.

- Animate panel enter/exit with a restrained fade/vertical movement.
- Use keyed list identity so cards move smoothly when the panel is inserted or removed.
- Add the view-transition CSS recipes and reduced-motion rule prescribed by the local skill.
- Ensure unrelated transitions do not animate by using `default="none"` where appropriate.

## Existing implementation facts

### `lib/github.ts`

- `PullRequest` currently contains `createdAt`, `number`, `title`, `bodyHTML`, `permalink`, and repository metadata.
- The GraphQL query fetches merged PRs, orders by `CREATED_AT`, fetches `closedAt`, and filters out repositories owned by `jer-k`.
- Add and expose `mergedAt`; sort the page-derived groups explicitly by it.
- The function fetches all pages before returning, so removing UI pagination does not require a new fetch strategy.

### Current page

- `app/(site)/open_source/page.tsx` is an async server component.
- It slices results into pages of 25 and uses `PullRequestCard` plus `Pagination`.
- The route already receives an `Open Source` hero from `app/(site)/@hero/open_source/page.tsx`; do not add a redundant page heading.

### Shared API

- `app/api/open-source/route.ts` calls the same `openSourcePullRequests()` function.
- It retains its own authenticated API pagination and excludes `bodyHTML`.
- The page's pagination should be removed, but the API's pagination should remain.
- The API should add `mergedAt` while retaining `createdAt`.

### Existing obsolete presentation

After the redesign, remove:

- `components/pull-request-card.tsx`
- `components/skeletons/pull-request-card-skeleton.tsx`
- Their Storybook stories

Replace their useful presentation coverage with repository-block, expanded-panel, PR-item, and grid-skeleton stories/tests.

### UI configuration

- `components.json` uses shadcn `base-nova`, Base UI, Tailwind CSS variables, and Lucide icons.
- Existing UI primitives live under `components/ui`.

## Testing and verification

Add coverage for:

- Grouping by full repository name
- Repository sorting by latest `mergedAt`
- PR sorting by `mergedAt`
- Single-panel open, switch, and collapse
- Active-card styling/state
- URL initialization and replacement
- Valid and invalid query parameters
- Initial direct-link scrolling versus no forced scroll on clicks
- Keyboard activation, focus restoration, and ARIA relationships
- Loading and empty states
- API output retains `createdAt`, adds `mergedAt`, and still excludes `bodyHTML`

Run:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Perform responsive visual/interaction QA at mobile, `md`, and `lg` widths, including dark mode, sticky header behavior, long repository names, long PR titles, reduced motion, direct-link loading, and switching repositories in different rows.

## Suggested skills

- `worktree-random-port`: invoke before implementation/dev-server work because this repository requires worktree usage and a non-3000 random port.
- `vercel-react-view-transitions`: invoke before adding motion; follow its audit, CSS recipes, Next.js integration, and reduced-motion guidance.
- `agent-browser`: use for responsive local visual QA, keyboard interaction checks, direct-link behavior, and screenshots after implementation.

## Repository instructions

Repository root:

`/Users/jeremykreutzbender/Developer/jer-k/jeremykreutzbender.com`

Follow the local `AGENTS.md` rules:

- 2-space formatting and double quotes
- Strict TypeScript; no explicit `any`
- Prefer `const`
- Tailwind styling with `cn()`
- Follow shadcn patterns
- Use `@/*` imports
- Biome linting and typecheck

