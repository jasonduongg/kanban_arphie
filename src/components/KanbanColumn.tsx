import { Droppable } from '@hello-pangea/dnd'
import { Status } from '../types'
import { Ticket } from '../types'
import { STATUS_COLORS } from '../utils/helpers'
import KanbanCard from './KanbanCard'

interface Props {
  status: Status
  tickets: Ticket[]
  onCardClick: (ticket: Ticket) => void
}

export default function KanbanColumn({ status, tickets, onCardClick }: Props) {
  return (
    <div className="flex flex-col min-w-0 w-full max-w-full">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[status].split(' ')[0].replace('bg-', 'bg-').replace('-100', '-400')}`} />
          <h3 className="text-sm font-semibold text-gray-700">{status}</h3>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
          {tickets.length}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-lg p-2 space-y-2 min-h-24 transition-colors ${
              snapshot.isDraggingOver ? 'bg-indigo-50 border border-dashed border-indigo-300' : 'bg-gray-50'
            }`}
          >
            {tickets.map((t, i) => (
              <KanbanCard key={t.id} ticket={t} index={i} onClick={() => onCardClick(t)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
