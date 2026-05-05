import { Status } from '../types'
import { BADGE_BASE, STATUS_COLORS } from '../utils/helpers'

interface Props {
  status: Status
}

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`${BADGE_BASE} whitespace-nowrap ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  )
}
