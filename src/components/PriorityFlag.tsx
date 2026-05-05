import { AlertTriangle } from 'lucide-react'
import { Ticket } from '../types'
import { suggestPriority } from '../utils/suggestPriority'

interface Props {
  ticket: Ticket
}

export default function PriorityFlag({ ticket }: Props) {
  const suggestion = suggestPriority(ticket.title, ticket.dueDate)
  if (!suggestion || suggestion.priority === ticket.priority) return null

  const label = `Suggested ${suggestion.priority} — ${suggestion.reasons.join(' + ')}`

  return (
    <span title={label} className="cursor-help">
      <AlertTriangle size={12} className="text-amber-400 shrink-0" />
    </span>
  )
}
