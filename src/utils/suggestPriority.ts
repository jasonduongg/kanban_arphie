import { differenceInDays, startOfDay } from 'date-fns'
import { Priority } from '../types'
import { parseLocalDate } from './helpers'

const KEYWORD_SCORES: { pattern: RegExp; score: number }[] = [
  { pattern: /\b(crash|crashed|crashing|outage|down|critical|blocker|blocked|blocking)\b/i, score: 4 },
  { pattern: /\b(urgent|emergency|asap|hotfix|broken|breaking)\b/i, score: 3 },
  { pattern: /\b(bug|error|fail|failing|failed|regression|incident)\b/i, score: 2 },
  { pattern: /\b(feature|improve|improvement|enhance|enhancement|perf|performance)\b/i, score: 1 },
  { pattern: /\b(docs|documentation|cleanup|clean up|refactor|chore|typo)\b/i, score: 0 },
]

function keywordSignal(title: string): { score: number; reason?: string } {
  for (const { pattern, score } of KEYWORD_SCORES) {
    if (!pattern.test(title)) continue
    const word = title.match(pattern)?.[0]
    return {
      score,
      reason:
        score >= 2 && word ? `title contains "${word.toLowerCase()}"` : undefined,
    }
  }
  return { score: 1 }
}

function dueDateDays(dueDate: string): number | null {
  if (!dueDate) return null
  return differenceInDays(parseLocalDate(dueDate), startOfDay(new Date()))
}

function scoreToP(score: number): Priority {
  if (score >= 4) return 'P0'
  if (score >= 3) return 'P1'
  if (score >= 2) return 'P2'
  return 'P3'
}

export interface PrioritySuggestion {
  priority: Priority
  reasons: string[]
}

export function suggestPriority(title: string, dueDate: string): PrioritySuggestion | null {
  if (!title && !dueDate) return null

  const reasons: string[] = []
  let score = 0

  const kw = keywordSignal(title)
  score = Math.max(score, kw.score)
  if (kw.reason) reasons.push(kw.reason)

  const days = dueDateDays(dueDate)
  if (days !== null) {
    if (days < 0) {
      score = Math.max(score, 4)
      reasons.push(`overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}`)
    } else if (days === 0) {
      score = Math.max(score, 3)
      reasons.push('due today')
    } else if (days === 1) {
      score = Math.max(score, 3)
      reasons.push('due tomorrow')
    } else if (days <= 3) {
      score = Math.max(score, 2)
      reasons.push(`due in ${days} days`)
    } else if (days <= 7) {
      score = Math.max(score, 1)
      reasons.push('due this week')
    } else {
      score = Math.max(score, 0)
      reasons.push(days <= 30 ? `due in ${days} days` : 'due date is far out')
    }
  }

  if (reasons.length === 0) return null

  return { priority: scoreToP(score), reasons }
}
