import { useState } from 'react'
import { Inbox } from 'lucide-react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { KANBAN_STATUSES, Status, Ticket } from '../types'
import { useStore } from '../store'
import { now, makeActivityEntry } from '../utils/helpers'
import KanbanColumn from './KanbanColumn'
import TicketModal from './TicketModal'
import BacklogModal from './BacklogModal'

export default function KanbanView() {
  const { tickets, dispatch } = useStore()
  const [editing, setEditing] = useState<Ticket | null>(null)
  const [backlogOpen, setBacklogOpen] = useState(false)

  const backlogCount = tickets.filter(t => t.status === 'Backlog').length

  function onDragEnd(result: DropResult) {
    if (!result.destination) return

    const { draggableId, destination, source } = result
    const newStatus = destination.droppableId as Status

    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const ticket = tickets.find(t => t.id === draggableId)
    if (!ticket) return

    const statusChanged = ticket.status !== newStatus
    const activityLog = statusChanged
      ? [...ticket.activityLog, makeActivityEntry('changed', [{ field: 'status', from: ticket.status, to: newStatus }])]
      : ticket.activityLog

    dispatch({
      type: 'UPDATE',
      ticket: { ...ticket, status: newStatus, updatedAt: now(), activityLog },
    })
  }

  return (
    <>
      <div className="w-full min-w-0 max-w-full box-border">
        <div className="flex items-center justify-end gap-3 mb-4 min-w-0">
          <button
            type="button"
            onClick={() => setBacklogOpen(true)}
            className="shrink-0 flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Inbox size={16} className="text-gray-500" />
            Backlog
            {backlogCount > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                {backlogCount}
              </span>
            )}
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full min-w-0">
            {KANBAN_STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tickets={tickets.filter(t => t.status === status)}
                onCardClick={setEditing}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {editing && (
        <TicketModal ticket={editing} onClose={() => setEditing(null)} />
      )}
      {backlogOpen && (
        <BacklogModal onClose={() => setBacklogOpen(false)} />
      )}
    </>
  )
}
