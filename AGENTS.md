# Agent Guidelines for jeremykreutzbender.com

## Commands
- **Build**: `npm run build`
- **Lint**: `npm run lint` (uses Biome)
- **Test**: `npm test` (Jest with Next.js)
- **Single test**: `npm test -- path/to/test.test.ts`
- **Dev**: `npm run dev -p 6001`
- **Typecheck**: `tsc --noEmit` (runs on pre-commit)

## Code Style
- **Formatting**: 2 spaces, double quotes, Biome formatter
- **Imports**: Use `@/*` path aliases, organize imports automatically
- **TypeScript**: Strict mode enabled, prefer `const` over `let`
- **Components**: Use forwardRef for refs, export interfaces separately
- **Styling**: Tailwind CSS with `cn()` utility for class merging
- **UI**: Follow shadcn/ui patterns with class-variance-authority
- **Error handling**: No explicit `any` types, use proper TypeScript types
- **File naming**: kebab-case for files, PascalCase for components