## App: Arphie — Engineering Task Tracker

A local-first, single-page web app for tracking engineering tickets. No auth, no backend — data lives in localStorage.

### Stack
- React 18 + TypeScript, Vite, Tailwind CSS
- @hello-pangea/dnd for kanban drag-and-drop
- lucide-react for icons, date-fns for dates, uuid for IDs

### Core Data Model
Ticket: id, title, assignee, status, priority, dueDate, description, labels, createdAt, updatedAt, activityLog[]

### Statuses (kanban columns)
Backlog → Todo → In Progress → In Review → Done

### Base Features
- Create / edit / close tickets via modal
- List view with multi-field filtering and sorting
- Kanban view with drag-and-drop between columns (status updates on drop)

### 3 Added Features
1. **Activity Timeline** — per-ticket visual timeline of every field change (who changed what, from→to, when), shown in the ticket modal
2. **Smart Priority Suggestions** — AI-lite heuristic engine that suggests a priority when creating/editing a ticket based on due date proximity, keywords in the title (e.g. "crash", "blocker", "urgent"), and how long the ticket has been open; shows a dismissible "Suggested: P1 — due in 2 days + title contains 'bug'" badge
3. **Keyboard Shortcuts** — `N` opens new ticket, `F` focuses the filter/search bar, `K` toggles kanban view, `L` toggles list view, `Esc` closes any open modal; tiny to build, feels premium
