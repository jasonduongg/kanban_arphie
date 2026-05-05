import { format } from 'date-fns'
import { Draggable } from '@hello-pangea/dnd'
import { Calendar, User } from 'lucide-react'
import { Ticket } from '../types'
import { isTicketOverdue, parseLocalDate, previewDescription } from '../utils/helpers'
import PriorityBadge from './PriorityBadge'
import LabelBadge from './LabelBadge'
import PriorityFlag from './PriorityFlag'

interface Props {
  ticket: Ticket
  index: number
  onClick: () => void
}

export default function KanbanCard({ ticket, index, onClick }: Props) {
  const isOverdue = isTicketOverdue(ticket)
  const descPreview = previewDescription(ticket.description, 160)

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`cursor-pointer select-none space-y-2 rounded-lg border bg-white p-3 transition-shadow ${
            snapshot.isDragging
              ? 'rotate-1 border-indigo-300 shadow-md'
              : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
          }`}
        >
          {/* Title */}
          <p className="text-sm font-medium text-gray-900 leading-snug">{ticket.title}</p>

          {descPreview && (
            <p className="line-clamp-2 text-sm leading-snug text-gray-500">{descPreview}</p>
          )}

          {/* Labels */}
          {ticket.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ticket.labels.map(l => <LabelBadge key={l} label={l} />)}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1">
              <PriorityBadge priority={ticket.priority} />
              <PriorityFlag ticket={ticket} />
            </div>
            <div className="flex min-w-0 items-center gap-2 text-sm text-gray-500">
              {ticket.assignee && (
                <span className="flex items-center gap-1 truncate">
                  <User size={11} />
                  {ticket.assignee}
                </span>
              )}
              {ticket.dueDate && (
                <span className={`flex items-center gap-1 shrink-0 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                  <Calendar size={11} />
                  {format(parseLocalDate(ticket.dueDate), 'MMM d')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
