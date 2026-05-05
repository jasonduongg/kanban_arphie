import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Lightbulb, CheckCircle, Trash2, Plus } from 'lucide-react'
import { Ticket, STATUSES, PRIORITIES } from '../types'
import Select from './Select'
import DatePicker from './DatePicker'
import Combobox from './Combobox'
import { useStore } from '../store'
import {
  diffTicket,
  labelChipOrder,
  makeActivityEntry,
  newId,
  now,
  priorityWeight,
  toSelfSelectOptions,
  uniqueAssignees,
} from '../utils/helpers'
import { suggestPriority } from '../utils/suggestPriority'
import ActivityTimeline from './ActivityTimeline'
import PriorityBadge from './PriorityBadge'

interface Props {
  ticket?: Ticket
  onClose: () => void
}

type Tab = 'details' | 'activity'

const EMPTY: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'activityLog'> = {
  title: '',
  assignee: '',
  status: 'Todo',
  priority: 'P2',
  dueDate: '',
  description: '',
  labels: [],
}

export default function TicketModal({ ticket, onClose }: Props) {
  const { dispatch, tickets } = useStore()
  const assignees = uniqueAssignees(tickets)
  const isEdit = !!ticket
  const [tab, setTab] = useState<Tab>('details')
  const [form, setForm] = useState(ticket ?? { ...EMPTY })
  const allLabels = useMemo(() => labelChipOrder(tickets, form.labels), [tickets, form.labels])
  const [suggestionDismissed, setSuggestionDismissed] = useState(false)
  const [labelInput, setLabelInput] = useState('')
  const labelInputRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const savedRef = useRef<Ticket | null>(ticket ?? null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function addLabel(val: string) {
    const trimmed = val.trim()
    if (!trimmed) return
    setForm(prev => {
      if (prev.labels.includes(trimmed)) return prev
      return { ...prev, labels: [...prev.labels, trimmed] }
    })
    setLabelInput('')
  }

  const computed = suggestionDismissed ? null : suggestPriority(form.title, form.dueDate)
  const suggestion = computed && computed.priority !== form.priority ? computed : null
  const isDowngrade =
    suggestion && priorityWeight(suggestion.priority) < priorityWeight(form.priority)
  const hasChanges = !isEdit || (savedRef.current ? diffTicket(savedRef.current, form as Ticket).length > 0 : true)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (key === 'title' || key === 'dueDate') setSuggestionDismissed(false)
  }

  function toggleLabel(label: string) {
    setForm(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label],
    }))
  }

  function applySuggestion() {
    if (!suggestion) return
    set('priority', suggestion.priority)
    setSuggestionDismissed(true)
  }

  function handleSave() {
    if (!form.title.trim()) return

    if (isEdit && savedRef.current) {
      const changes = diffTicket(savedRef.current, form as Ticket)
      const log = changes.length > 0
        ? [...savedRef.current.activityLog, makeActivityEntry('changed', changes)]
        : savedRef.current.activityLog
      const updated: Ticket = {
        ...(form as Ticket),
        updatedAt: now(),
        activityLog: log,
      }
      dispatch({ type: 'UPDATE', ticket: updated })
      savedRef.current = updated
    } else {
      const created: Ticket = {
        ...(form as Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'activityLog'>),
        id: newId(),
        createdAt: now(),
        updatedAt: now(),
        activityLog: [makeActivityEntry('created')],
      }
      dispatch({ type: 'CREATE', ticket: created })
      onClose()
    }
  }

  function handleDelete() {
    if (!ticket) return
    dispatch({ type: 'DELETE', id: ticket.id })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Ticket' : 'New Ticket'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs (edit only) */}
        {isEdit && (
          <div className="flex border-b border-gray-200 px-6">
            {(['details', 'activity'] as Tab[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`mr-8 border-b-2 px-1 py-2 text-sm font-medium capitalize transition-colors last:mr-0 ${
                  tab === t
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="min-w-0 flex-1 overflow-y-auto px-6 py-5">
          {tab === 'activity' && ticket ? (
            <ActivityTimeline log={ticket.activityLog} />
          ) : (
            <div className="min-w-0 space-y-4">
              {/* Smart Priority Suggestion */}
              {suggestion && (
                <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${isDowngrade ? 'border-blue-200 bg-blue-50' : 'border-amber-200 bg-amber-50'}`}>
                  <Lightbulb size={16} className={`mt-0.5 shrink-0 ${isDowngrade ? 'text-blue-400' : 'text-amber-500'}`} />
                  <div className={`flex flex-1 flex-wrap items-center gap-2 ${isDowngrade ? 'text-blue-800' : 'text-amber-800'}`}>
                    <span className="font-medium">{isDowngrade ? 'Looks lower priority than set' : 'This might need higher priority'}</span>
                    <span className="text-gray-500">·</span>
                    <span>{suggestion.reasons.join(', ')}</span>
                    <span className="text-gray-500">·</span>
                    <span>switch to</span>
                    <PriorityBadge priority={suggestion.priority} />
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className={`flex items-center gap-1 text-sm font-medium ${isDowngrade ? 'text-blue-700 hover:text-blue-900' : 'text-amber-700 hover:text-amber-900'}`}
                    >
                      <CheckCircle size={13} /> Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setSuggestionDismissed(true)}
                      className={`text-sm ${isDowngrade ? 'text-blue-500 hover:text-blue-700' : 'text-amber-600 hover:text-amber-800'}`}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Title <span className="text-red-500">*</span></label>
                <input
                  ref={titleRef}
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Assignee */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Assignee</label>
                <Combobox
                  value={form.assignee}
                  onChange={v => set('assignee', v)}
                  options={assignees}
                  placeholder="Who owns this?"
                  allowFreeText={true}
                  className="w-full"
                />
              </div>

              {/* Status + Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Status</label>
                  <Select
                    value={form.status}
                    onChange={v => set('status', v)}
                    options={toSelfSelectOptions(STATUSES)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Priority</label>
                  <Select
                    value={form.priority}
                    onChange={v => set('priority', v)}
                    options={toSelfSelectOptions(PRIORITIES)}
                  />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Due Date</label>
                <DatePicker
                  value={form.dueDate}
                  onChange={v => set('dueDate', v)}
                  placeholder="Pick a due date"
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Add more context..."
                  rows={4}
                  className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Labels</label>
                <div className="flex flex-wrap gap-2">
                  {allLabels.map(label => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleLabel(label)}
                      className={`inline-flex w-fit shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
                        form.labels.includes(label)
                          ? 'border-transparent bg-indigo-600 text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-400'
                      }`}
                    >
                      {label}
                    </button>
                  ))}

                  <div
                    className="inline-flex max-w-full min-w-0 shrink-0 cursor-text items-center gap-2 rounded-full border border-dashed border-gray-300 px-2 py-1 transition-colors hover:border-indigo-400"
                    onClick={() => labelInputRef.current?.focus()}
                  >
                    <Plus size={11} className="shrink-0 text-gray-400" />
                    <input
                      ref={labelInputRef}
                      value={labelInput}
                      onChange={e => setLabelInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.nativeEvent.isComposing) return
                        if (e.key === 'Escape') {
                          setLabelInput('')
                          labelInputRef.current?.blur()
                          return
                        }
                        if (e.key !== 'Enter') return
                        e.preventDefault()
                        e.stopPropagation()
                        addLabel(e.currentTarget.value)
                      }}
                      placeholder="Add label…"
                      className="min-w-[8ch] max-w-[min(100%,20rem)] flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none [field-sizing:content]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="flex gap-2">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Delete ticket"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {isEdit ? (
              hasChanges && (
                <button
                  type="button"
                  onClick={() => { setForm(savedRef.current!); setSuggestionDismissed(false) }}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Revert
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.title.trim() || !hasChanges}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isEdit ? 'Save Changes' : 'Create Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
