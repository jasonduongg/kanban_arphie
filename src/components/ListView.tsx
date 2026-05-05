import { useState } from 'react'
import { isSameDay } from 'date-fns'
import { parseLocalDate } from '../utils/helpers'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Ticket, PRIORITIES } from '../types'
import { useStore } from '../store'
import { Filters } from './FilterBar'
import TicketRow from './TicketRow'
import TicketModal from './TicketModal'

type SortKey = 'title' | 'description' | 'status' | 'priority' | 'assignee' | 'dueDate' | 'createdAt'
type SortDir = 'asc' | 'desc'

interface Props {
  filters: Filters
}

const COLUMNS: { label: string; key: SortKey }[] = [
  { label: 'Title',       key: 'title' },
  { label: 'Description', key: 'description' },
  { label: 'Status',      key: 'status' },
  { label: 'Priority',    key: 'priority' },
  { label: 'Assignee',    key: 'assignee' },
  { label: 'Due Date',    key: 'dueDate' },
  { label: 'Created',     key: 'createdAt' },
]

function applyFilters(tickets: Ticket[], f: Filters): Ticket[] {
  return tickets.filter(t => {
    if (f.search && !t.title.toLowerCase().includes(f.search.toLowerCase()) &&
        !t.description.toLowerCase().includes(f.search.toLowerCase())) return false
    if (f.status    && t.status !== f.status) return false
    if (f.priority  && t.priority !== f.priority) return false
    if (f.assignee  && !t.assignee.toLowerCase().includes(f.assignee.toLowerCase())) return false
    if (f.label     && !t.labels.includes(f.label)) return false
    if (f.dueDate && (!t.dueDate || !isSameDay(parseLocalDate(t.dueDate), parseLocalDate(f.dueDate)))) return false
    if (!f.showBacklog && t.status === 'Backlog' && f.status !== 'Backlog') return false
    return true
  })
}

function applySort(tickets: Ticket[], key: SortKey, dir: SortDir): Ticket[] {
  return [...tickets].sort((a, b) => {
    let av: string
    let bv: string
    if (key === 'priority') {
      av = String(PRIORITIES.indexOf(a.priority))
      bv = String(PRIORITIES.indexOf(b.priority))
    } else {
      av = (a[key] ?? '').toLowerCase()
      bv = (b[key] ?? '').toLowerCase()
    }
    const cmp = av.localeCompare(bv)
    return dir === 'asc' ? cmp : -cmp
  })
}

export default function ListView({ filters }: Props) {
  const { tickets } = useStore()
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [editing, setEditing] = useState<Ticket | null>(null)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const visible = applySort(applyFilters(tickets, filters), sortKey, sortDir)

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key
                      ? sortDir === 'asc'
                        ? <ChevronUp size={12} />
                        : <ChevronDown size={12} />
                      : <ChevronUp size={12} className="opacity-20" />
                    }
                  </span>
                </th>
              ))}
              <th className="max-w-48 min-w-0 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Labels
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                  No tickets match your filters
                </td>
              </tr>
            ) : (
              visible.map(t => (
                <TicketRow key={t.id} ticket={t} onClick={() => setEditing(t)} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <TicketModal ticket={editing} onClose={() => setEditing(null)} />
      )}
    </>
  )
}
