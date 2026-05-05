import { useRef } from 'react'
import { Inbox, Search } from 'lucide-react'
import { Status, Priority, STATUSES, PRIORITIES } from '../types'
import { toSelfSelectOptions } from '../utils/helpers'
import Select from './Select'
import DatePicker from './DatePicker'
import Combobox from './Combobox'

export interface Filters {
  search: string
  status: Status | ''
  priority: Priority | ''
  assignee: string
  label: string
  dueDate: string
  showBacklog: boolean
}

export const EMPTY_FILTERS: Filters = {
  search: '',
  status: '',
  priority: '',
  assignee: '',
  label: '',
  dueDate: '',
  showBacklog: false,
}

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
  assignees: string[]
  labels: string[]
  searchRef?: React.RefObject<HTMLInputElement>
}

export default function FilterBar({ filters, onChange, assignees, labels, searchRef }: Props) {
  const internalRef = useRef<HTMLInputElement>(null)
  const ref = searchRef ?? internalRef

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value })
  }

  const hasFilters =
    filters.search !== '' ||
    filters.status !== '' ||
    filters.priority !== '' ||
    filters.assignee !== '' ||
    filters.label !== '' ||
    filters.dueDate !== '' ||
    filters.showBacklog

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <div className="relative shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={ref}
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            placeholder="Search tickets…"
            className="w-40 rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <Select
          value={filters.status}
          onChange={v => set('status', v)}
          placeholder="All statuses"
          className="w-36 shrink-0"
          options={toSelfSelectOptions(STATUSES)}
        />

        <Select
          value={filters.priority}
          onChange={v => set('priority', v)}
          placeholder="All priorities"
          className="w-32 shrink-0"
          options={toSelfSelectOptions(PRIORITIES)}
        />

        <Combobox
          value={filters.assignee}
          onChange={v => set('assignee', v)}
          options={assignees}
          placeholder="Assignee"
          allowFreeText={false}
          className="w-36 shrink-0"
        />

        <Combobox
          value={filters.label}
          onChange={v => set('label', v)}
          options={labels}
          placeholder="All labels"
          allowFreeText={false}
          className="w-36 shrink-0"
        />

        <DatePicker
          value={filters.dueDate}
          onChange={v => set('dueDate', v)}
          placeholder="Filter by date"
          className="w-40 shrink-0"
        />

        <button
          type="button"
          role="switch"
          aria-checked={filters.showBacklog}
          aria-label={filters.showBacklog ? 'Backlog tickets shown in list' : 'Backlog tickets hidden from list'}
          onClick={() => set('showBacklog', !filters.showBacklog)}
          className={`flex w-40 shrink-0 items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            filters.showBacklog
              ? 'border-indigo-400'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            <Inbox size={14} className="shrink-0 text-gray-400" />
            <span className={filters.showBacklog ? 'truncate text-gray-900' : 'truncate text-gray-400'}>
              Backlog
            </span>
          </span>
          <span
            className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
              filters.showBacklog ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
            aria-hidden
          >
            <span
              className={`size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                filters.showBacklog ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </span>
        </button>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="shrink-0 self-start text-sm font-medium text-red-600 transition-colors hover:text-red-700 sm:self-auto"
        >
          Clear
        </button>
      )}
    </div>
  )
}
