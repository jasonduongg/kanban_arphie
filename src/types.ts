export type Status = 'Backlog' | 'Todo' | 'In Progress' | 'In Review' | 'Done'

export type Priority = 'P0' | 'P1' | 'P2' | 'P3'

export type ActivityAction = 'created' | 'changed' | 'closed'

export type TicketField = 'title' | 'assignee' | 'status' | 'priority' | 'dueDate' | 'description' | 'labels'

export interface FieldChange {
  field: TicketField
  from: string
  to: string
}

export interface ActivityEntry {
  id: string
  timestamp: string
  action: ActivityAction
  changes?: FieldChange[]  // all fields that changed in a single save
}

export interface Ticket {
  id: string
  title: string
  assignee: string
  status: Status
  priority: Priority
  dueDate: string
  description: string
  labels: string[]
  createdAt: string
  updatedAt: string
  activityLog: ActivityEntry[]
}

export const STATUSES: Status[] = ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done']

export const KANBAN_STATUSES: Status[] = ['Todo', 'In Progress', 'In Review', 'Done']

export const PRIORITIES: Priority[] = ['P0', 'P1', 'P2', 'P3']

export const DEFAULT_LABELS = ['bug', 'feature', 'tech-debt', 'docs', 'cleanup', 'urgent']
