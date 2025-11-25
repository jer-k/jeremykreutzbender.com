# Agent Guidelines for jeremykreutzbender.com

## Commands
- **Build**: `npm run build`
- **Lint**: `npm run lint` (uses Biome)
- **Test**: `npm test` (Vitest with jsdom)
- **Single test**: `npm test -- path/to/test.test.ts`
- **Dev**: `npm run dev` (runs on port 6001)
- **Typecheck**: `npm run typecheck` (runs on pre-commit)
- **Storybook**: `npm run storybook` (port 6006)

## Code Style
- **Formatting**: 2 spaces, double quotes, Biome formatter
- **Imports**: Use `@/*` path aliases, organize imports automatically
- **TypeScript**: Strict mode enabled, prefer `const` over `let`
- **Components**: Use forwardRef for refs, export interfaces separately
- **Styling**: Tailwind CSS with `cn()` utility for class merging
- **UI**: Follow shadcn/ui patterns with class-variance-authority
- **Error handling**: No explicit `any` types, use proper TypeScript types
- **File naming**: kebab-case for files, PascalCase for components
- **Pre-commit**: Runs Biome check and typecheck on staged files