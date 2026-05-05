import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { Ticket } from '../types'
import { useStore } from '../store'
import { now, makeActivityEntry } from '../utils/helpers'
import PriorityBadge from './PriorityBadge'
import Select from './Select'

interface Props {
  onClose: () => void
}

function moveToStatus(
  ticket: Ticket,
  nextStatus: Ticket['status'],
  dispatch: (action: { type: 'UPDATE'; ticket: Ticket }) => void
) {
  if (ticket.status === nextStatus) return
  const activityLog = [
    ...ticket.activityLog,
    makeActivityEntry('changed', [{ field: 'status', from: ticket.status, to: nextStatus }]),
  ]
  dispatch({
    type: 'UPDATE',
    ticket: { ...ticket, status: nextStatus, updatedAt: now(), activityLog },
  })
}

export default function BacklogModal({ onClose }: Props) {
  const { tickets, dispatch } = useStore()
  const [sendId, setSendId] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const backlog = useMemo(
    () => tickets.filter(t => t.status === 'Backlog').sort((a, b) => a.title.localeCompare(b.title)),
    [tickets]
  )

  const onBoard = useMemo(
    () => tickets.filter(t => t.status !== 'Backlog').sort((a, b) => a.title.localeCompare(b.title)),
    [tickets]
  )

  const sendTicket = onBoard.find(t => t.id === sendId)

  const sendOptions = useMemo(
    () =>
      onBoard.map(t => ({
        value: t.id,
        label: `${t.title} (${t.status})`,
      })),
    [onBoard]
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg max-h-[85vh] bg-white rounded-xl shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Backlog</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="shrink-0 px-5 py-4 border-b border-gray-100 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Send to backlog</p>
          <p className="text-sm text-gray-500">Pick a ticket on the board, then move it to the queue.</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
            <Select
              value={sendId}
              options={sendOptions}
              onChange={setSendId}
              placeholder="Select ticket…"
              className="flex-1 min-w-0 w-full"
            />
            <button
              type="button"
              disabled={!sendTicket}
              onClick={() => {
                if (!sendTicket) return
                moveToStatus(sendTicket, 'Backlog', dispatch)
                setSendId('')
              }}
              className="shrink-0 text-sm font-medium px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors sm:mt-0"
            >
              To backlog
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0 px-5 py-4">
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">In backlog</p>
            {backlog.length === 0 ? (
              <p className="text-sm text-gray-500">No tickets in backlog.</p>
            ) : (
              <ul className="space-y-2">
                {backlog.map(t => (
                  <li
                    key={t.id}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/80 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{t.title}</p>
                      <div className="mt-1.5 flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto">
                        <PriorityBadge priority={t.priority} />
                        {t.assignee && (
                          <span className="truncate text-sm text-gray-500">{t.assignee}</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        moveToStatus(t, 'Todo', dispatch)
                      }}
                      className="shrink-0 rounded-md border border-indigo-200 px-2 py-1 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-800"
                    >
                      Move to Todo
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
