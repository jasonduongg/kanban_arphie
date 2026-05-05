## Build Plan

### 1. Setup
- [ ] 1.1. Scaffold Vite React-TS project in repo root
- [ ] 1.2. Install deps: tailwindcss, @tailwindcss/vite, @hello-pangea/dnd, lucide-react, date-fns, uuid + @types/uuid
- [ ] 1.3. Configure tailwind in vite.config.ts and import in index.css

### 2. Data Layer
- [ ] 2.1. Write src/types.ts — Ticket, Status, Priority, Label, ActivityEntry interfaces
- [ ] 2.2. Write src/store.tsx — React context + useReducer with localStorage persistence; actions: CREATE, UPDATE, DELETE ticket
- [ ] 2.3. Write src/utils/helpers.ts — ID gen, activity entry factory, status/priority color maps
- [ ] 2.4. Write src/utils/suggestPriority.ts — heuristic engine: score by due date proximity, title keywords (crash/blocker/urgent → P0, bug/broken → P1, feature/improve → P2, docs/cleanup → P3), and ticket age

### 3. Shared Components
- [ ] 3.1. Write src/components/PriorityBadge.tsx — colored P0–P3 chip
- [ ] 3.2. Write src/components/StatusBadge.tsx — colored status chip
- [ ] 3.3. Write src/components/LabelBadge.tsx — pill label with color (used in modal, list row, and kanban card)
- [ ] 3.4. Write src/components/ActivityTimeline.tsx — visual per-ticket timeline of field changes with from→to diffs and timestamps

### 4. Ticket Modal & Filters
- [ ] 4.1. Write src/components/TicketModal.tsx — create/edit form with all fields (title, assignee, status, priority, dueDate, description, labels), activity timeline tab, and dismissible smart priority suggestion banner
- [ ] 4.2. Write src/components/FilterBar.tsx — filter inputs for status, priority, assignee, label, due date

### 5. List View
- [ ] 5.1. Write src/components/TicketRow.tsx — single row for list view
- [ ] 5.2. Write src/components/ListView.tsx — filterable/sortable table of tickets

### 6. Kanban View (Drag & Drop)
- [ ] 6.1. Write src/components/KanbanCard.tsx — draggable ticket card showing priority, labels, assignee, due date
- [ ] 6.2. Write src/components/KanbanColumn.tsx — droppable column per status with within-column reorder support
- [ ] 6.3. Write src/components/KanbanView.tsx — DragDropContext wiring; on drop update ticket status + log activity entry

### 7. Keyboard Shortcuts
- [ ] 7.1. Write src/hooks/useKeyboardShortcuts.ts — global keydown listener; N = new ticket, F = focus filter, K = kanban view, L = list view, Esc = close modal
- [ ] 7.2. Mount hook in App.tsx and wire to existing modal/view state

### 8. App Shell & Seeding
- [ ] 8.1. Write src/App.tsx — tab switcher (List / Kanban), new-ticket button, modal state
- [ ] 8.2. Write src/main.tsx — mount app with StoreProvider
- [ ] 8.3. Seed localStorage with a few demo tickets for first load

### 9. QA & Docs
- [ ] 9.1. Smoke-test: npm run dev, verify both views, drag-and-drop, create/edit/close, filters, activity timeline, priority suggestions, keyboard shortcuts
- [ ] 9.2. Write README.md — run instructions + feature rationale
