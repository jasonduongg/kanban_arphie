# Code Best Practices

## Simplicity (default)
- Pick the **smallest change** that satisfies the requirement: fewer files, fewer concepts, less API surface.
- **Do not** add abstractions (hooks, wrappers, config layers) for a single use; extract only after the second real duplication or when complexity clearly pays off.
- Prefer **straight-line code** (inline logic, one function) over indirection unless tests or reuse demand it.
- If two approaches are correct, choose **fewer dependencies**, **fewer states**, and **easier local reasoning** over “future flexibility.”

## General
- TypeScript strict mode — no `any`, no `!` non-null assertions unless unavoidable
- Prefer explicit return types on functions that are non-trivial
- No unused variables or imports — TypeScript strict will catch these
- No comments unless the WHY is non-obvious

## React
- Functional components only, no class components
- One component per file, filename matches component name
- Props interfaces defined inline above the component (`interface Props { ... }`)
- Avoid useEffect for derived state — compute inline or useMemo
- Keep components small — if a component exceeds ~100 lines, split it

## State
- All ticket state lives in the global store (Context + useReducer)
- Local UI state (open/close, hover) stays in the component with useState
- Never mutate state directly — always return new objects/arrays in the reducer

## File Structure
- src/types.ts — all shared types/interfaces
- src/store.tsx — context, reducer, provider
- src/utils/ — pure functions only, no React imports
- src/hooks/ — custom hooks
- src/components/ — one file per component

## Naming
- Components: PascalCase
- Hooks: camelCase prefixed with `use`
- Utils/helpers: camelCase
- Types/interfaces: PascalCase, no `I` prefix
- Constants: SCREAMING_SNAKE_CASE

## Tailwind
- Use Tailwind utility classes directly — no custom CSS unless Tailwind can't do it
- Keep class strings readable — break long className onto multiple lines with template literals if needed
- No inline styles

## Imports
- Order: React → third-party → local (types → utils → hooks → components)
- Use relative imports for local files
