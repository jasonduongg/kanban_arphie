import { Priority } from '../types'
import { BADGE_BASE, PRIORITY_COLORS } from '../utils/helpers'

interface Props {
  priority: Priority
}

export default function PriorityBadge({ priority }: Props) {
  return (
    <span className={`${BADGE_BASE} ${PRIORITY_COLORS[priority]}`}>
      {priority}
    </span>
  )
}
