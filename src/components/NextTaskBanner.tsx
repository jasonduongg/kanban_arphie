import { useState } from 'react'
import { Zap, ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import { suggestPriority } from '../utils/suggestPriority'
import { Priority, Ticket } from '../types'
import { priorityWeight } from '../utils/helpers'
import TicketModal from './TicketModal'
import PriorityBadge from './PriorityBadge'

function pickNextTask(tickets: Ticket[]): { ticket: Ticket; reasons: string[]; priority: Priority } | null {
  const open = tickets.filter(t => t.status !== 'Done')
  if (open.length === 0) return null

  let best: { ticket: Ticket; reasons: string[]; priority: Priority; score: number } | null = null

  for (const ticket of open) {
    const suggestion = suggestPriority(ticket.title, ticket.dueDate)
    const rankPriority = suggestion?.priority ?? ticket.priority
    const score = priorityWeight(rankPriority)
    const reasons = suggestion?.reasons ?? []

    if (!best || score > best.score) {
      best = { ticket, reasons, priority: suggestion?.priority ?? ticket.priority, score }
    }
  }

  return best
}

export default function NextTaskBanner() {
  const { tickets } = useStore()
  const [dismissed, setDismissed] = useState(false)
  const [editing, setEditing] = useState<Ticket | null>(null)

  if (dismissed) return null

  const next = pickNextTask(tickets)
  if (!next) return null

  return (
    <>
      <div className="flex items-center gap-4 rounded-lg border border-indigo-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2 shrink-0">
          <Zap size={15} className="text-indigo-500" />
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Next up</span>
        </div>

        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="shrink-0">
            <PriorityBadge priority={next.priority} />
          </span>
          <span className="text-sm font-medium text-gray-900 truncate">{next.ticket.title}</span>
          {next.reasons.length > 0 && (
            <span className="hidden shrink-0 text-sm text-gray-500 sm:block">· {next.reasons.join(' · ')}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setEditing(next.ticket)}
          className="flex shrink-0 items-center gap-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
        >
          View <ArrowRight size={12} />
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          Dismiss
        </button>
      </div>

      {editing && <TicketModal ticket={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
