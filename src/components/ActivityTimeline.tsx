import { format, parseISO } from 'date-fns'
import { ActivityEntry } from '../types'

interface Props {
  log: ActivityEntry[]
}

function EntryLabel({ entry }: { entry: ActivityEntry }) {
  if (entry.action === 'created') return <span>Ticket created</span>
  if (entry.action === 'closed') return <span>Ticket closed</span>

  if (!entry.changes || entry.changes.length === 0) return <span>Updated</span>

  return (
    <div className="space-y-2">
      {entry.changes.map(c => (
        <div key={c.field} className="flex items-baseline gap-2 flex-wrap">
          <span className="font-medium capitalize text-gray-700">{c.field}</span>
          <span className="text-gray-400">changed</span>
          {c.from && (
            <>
              <span className="text-gray-400">from</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-600 line-through">{c.from}</span>
            </>
          )}
          <span className="text-gray-400">to</span>
          <span className="rounded bg-indigo-50 px-2 py-0.5 text-sm text-indigo-600">{c.to}</span>
        </div>
      ))}
    </div>
  )
}

export default function ActivityTimeline({ log }: Props) {
  if (log.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No activity yet</p>
  }

  const sorted = [...log].sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  return (
    <ol className="space-y-0 py-2">
      {sorted.map((entry, index) => (
        <li key={entry.id} className="flex gap-4">
          <div className="flex w-4 shrink-0 flex-col items-center pt-2">
            <div className="h-3 w-3 shrink-0 rounded-full border-2 border-white bg-indigo-400" aria-hidden />
            {index < sorted.length - 1 && (
              <div className="mt-2 w-px flex-1 min-h-8 bg-gray-200" aria-hidden />
            )}
          </div>
          <div className={`min-w-0 flex-1 ${index < sorted.length - 1 ? 'pb-8' : ''}`}>
            <time className="mb-1 block text-xs text-gray-400">
              {format(parseISO(entry.timestamp), 'MMM d, yyyy · h:mm a')}
            </time>
            <div className="text-sm text-gray-600">
              <EntryLabel entry={entry} />
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
