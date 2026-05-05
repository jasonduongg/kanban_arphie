# Tradeoffs

## Storage: localStorage JSON vs SQL

**Chose: localStorage JSON**

Pros:

- Zero setup — no DB install, no migrations, no server process
- Ticket data is naturally nested (activityLog[], labels[] live inside the ticket object)
- Filtering/sorting 50–200 tickets in memory is instant
- Evaluator runs `npm run dev` and it just works

Cons:

- No relational queries (cross-ticket blocking/dependency would need manual joins)
- ~5MB localStorage limit (fine for demo scale, not for production)
- No concurrent access (single browser tab only)

SQL would only win if: complex cross-ticket queries, multi-user, or large data volume — none of which apply here.

---

## Framework: React + Vite vs Next.js

**Chose: React + Vite**

Pros:

- No SSR complexity — this is a pure client-side local app, SSR adds nothing
- Faster dev server startup
- Simpler bundle output

Cons:

- No file-based routing (not needed for a single-page app)
- No built-in API routes (not needed, no backend)

---

## Styling: Tailwind CSS vs CSS Modules

**Chose: Tailwind CSS**

Pros:

- Fast to build UI without context-switching to separate files
- Consistent design tokens out of the box
- Easy responsive and conditional styling

Cons:

- Verbose class strings can be hard to read
- Harder to theme dynamically (e.g. dark mode requires extra config)
