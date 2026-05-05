import { format, parseISO } from 'date-fns'
import { Ticket } from '../types'
import { isTicketOverdue, parseLocalDate, previewDescription } from '../utils/helpers'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'
import LabelBadge from './LabelBadge'
import PriorityFlag from './PriorityFlag'

interface Props {
  ticket: Ticket
  onClick: () => void
}

export default function TicketRow({ ticket, onClick }: Props) {
  const isOverdue = isTicketOverdue(ticket)
  const descPreview = previewDescription(ticket.description, 240)

  return (
    <tr
      onClick={onClick}
      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-48 truncate">
        {ticket.title}
      </td>
      <td className="max-w-xs px-4 py-3 align-middle">
        {descPreview ? (
          <p className="line-clamp-2 text-sm leading-snug text-gray-500">{descPreview}</p>
        ) : (
          <span className="text-sm text-gray-300">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={ticket.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <PriorityBadge priority={ticket.priority} />
          <PriorityFlag ticket={ticket} />
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {ticket.assignee || <span className="text-gray-300">—</span>}
      </td>
      <td className="px-4 py-3 text-sm">
        {ticket.dueDate ? (
          <span className={isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}>
            {format(parseLocalDate(ticket.dueDate), 'MMM d, yyyy')}
            {isOverdue && ' · overdue'}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
        {format(parseISO(ticket.createdAt), 'MMM d, yyyy')}
      </td>
      <td className="max-w-48 min-w-0 px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {ticket.labels.map(l => <LabelBadge key={l} label={l} />)}
        </div>
      </td>
    </tr>
  )
}
