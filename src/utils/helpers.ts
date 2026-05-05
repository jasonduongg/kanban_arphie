import { isBefore, startOfToday } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import {
  ActivityEntry,
  ActivityAction,
  DEFAULT_LABELS,
  FieldChange,
  PRIORITIES,
  Priority,
  Status,
  Ticket,
  TicketField,
} from '../types'

export const BADGE_BASE =
  'inline-flex w-fit shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide'

export function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00')
}

export function isTicketOverdue(ticket: Pick<Ticket, 'dueDate' | 'status'>): boolean {
  return Boolean(
    ticket.dueDate &&
      ticket.status !== 'Done' &&
      isBefore(parseLocalDate(ticket.dueDate), startOfToday())
  )
}

export function previewDescription(text: string, maxChars = 200): string {
  const collapsed = text.replace(/\s+/g, ' ').trim()
  if (!collapsed) return ''
  if (collapsed.length <= maxChars) return collapsed
  return `${collapsed.slice(0, maxChars - 1).trimEnd()}…`
}

export function uniqueAssignees(tickets: Ticket[]): string[] {
  return [...new Set(tickets.map(t => t.assignee).filter(Boolean))]
}

export function collectLabelOptions(tickets: Ticket[], additional?: readonly string[]): string[] {
  return [
    ...new Set([
      ...DEFAULT_LABELS,
      ...tickets.flatMap(t => t.labels),
      ...(additional ?? []),
    ]),
  ]
}


export function labelChipOrder(tickets: Ticket[], formLabels?: readonly string[]): string[] {
  const merged = new Set(collectLabelOptions(tickets, formLabels))
  const fromCatalog = DEFAULT_LABELS.filter(label => merged.has(label))
  const extra = [...merged].filter(label => !DEFAULT_LABELS.includes(label))
  extra.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  return [...fromCatalog, ...extra]
}

export function toSelfSelectOptions<T extends string>(values: readonly T[]): { value: T; label: T }[] {
  return values.map(v => ({ value: v, label: v }))
}

export function priorityWeight(p: Priority): number {
  return PRIORITIES.length - PRIORITIES.indexOf(p)
}

export function newId(): string {
  return uuidv4()
}

export function now(): string {
  return new Date().toISOString()
}

export function makeActivityEntry(
  action: ActivityAction,
  changes?: FieldChange[]
): ActivityEntry {
  return { id: newId(), timestamp: now(), action, changes }
}

export function diffTicket(prev: Ticket, next: Ticket): FieldChange[] {
  const fields: TicketField[] = ['title', 'assignee', 'status', 'priority', 'dueDate', 'description', 'labels']
  const changes: FieldChange[] = []
  for (const field of fields) {
    const from = stringify(prev[field])
    const to = stringify(next[field])
    if (from !== to) changes.push({ field, from, to })
  }
  return changes
}

function stringify(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  return value == null ? '' : String(value)
}

export const STATUS_COLORS: Record<Status, string> = {
  'Backlog':     'bg-gray-100 text-gray-500',
  'Todo':        'bg-blue-100 text-blue-500',
  'In Progress': 'bg-amber-100 text-amber-600',
  'In Review':   'bg-purple-100 text-purple-600',
  'Done':        'bg-green-100 text-green-600',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  P0: 'bg-red-100 text-red-600',
  P1: 'bg-orange-100 text-orange-500',
  P2: 'bg-yellow-100 text-yellow-600',
  P3: 'bg-gray-100 text-gray-500',
}

export const LABEL_COLORS: Record<string, string> = {
  bug:       'bg-red-50 text-red-500',
  feature:   'bg-indigo-50 text-indigo-500',
  'tech-debt': 'bg-orange-50 text-orange-500',
  docs:      'bg-blue-50 text-blue-500',
  cleanup:   'bg-teal-50 text-teal-500',
  urgent:    'bg-pink-50 text-pink-500',
}

export const LABEL_FALLBACK = 'bg-gray-100 text-gray-500'
