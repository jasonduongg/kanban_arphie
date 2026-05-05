import { useRef, useState } from 'react'
import { LayoutList, Columns2, Plus, Keyboard } from 'lucide-react'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useStore } from './store'
import { Filters, EMPTY_FILTERS } from './components/FilterBar'
import FilterBar from './components/FilterBar'
import ListView from './components/ListView'
import KanbanView from './components/KanbanView'
import TicketModal from './components/TicketModal'
import NextTaskBanner from './components/NextTaskBanner'
import { collectLabelOptions, uniqueAssignees } from './utils/helpers'

type View = 'list' | 'kanban'

export default function App() {
  const { tickets } = useStore()
  const assignees = uniqueAssignees(tickets)
  const allLabels = collectLabelOptions(tickets)
  const [view, setView] = useState<View>('list')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [showNew, setShowNew] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useKeyboardShortcuts({
    onNewTicket:   () => setShowNew(true),
    onFocusSearch: () => { setView('list'); searchRef.current?.focus() },
    onKanbanView:  () => setView('kanban'),
    onListView:    () => setView('list'),
    onEsc:         () => { setShowNew(false); setShowShortcuts(false) },
  })

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">Task Tracker</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowShortcuts(s => !s)}
              className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-expanded={showShortcuts}
              aria-haspopup="dialog"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard size={16} />
            </button>

            {showShortcuts && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
                role="dialog"
                aria-label="Keyboard shortcuts"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Keyboard Shortcuts
                </p>
                <div className="space-y-2">
                  {[
                    ['N', 'New ticket'],
                    ['F', 'Focus search'],
                    ['K', 'Kanban view'],
                    ['L', 'List view'],
                    ['Esc', 'Close modal'],
                  ].map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-600">{label}</span>
                      <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">
                        {key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center overflow-hidden rounded-md border border-gray-200">
            <button
              type="button"
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                view === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <LayoutList size={14} /> List
            </button>
            <button
              type="button"
              onClick={() => setView('kanban')}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                view === 'kanban' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Columns2 size={14} /> Kanban
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Plus size={15} /> New Ticket
          </button>
        </div>
      </header>

      {/* Main */}
      <main
        className={
          view === 'kanban'
            ? 'px-4 sm:px-6 py-6 w-full max-w-none space-y-4'
            : 'px-6 py-6 max-w-screen-xl mx-auto space-y-4'
        }
      >
        <NextTaskBanner />
        {view === 'list' && (
          <>
            <FilterBar filters={filters} onChange={setFilters} assignees={assignees} labels={allLabels} searchRef={searchRef} />
            <ListView filters={filters} />
          </>
        )}
        {view === 'kanban' && <KanbanView />}
      </main>

      {showNew && <TicketModal onClose={() => setShowNew(false)} />}
    </div>
  )
}
