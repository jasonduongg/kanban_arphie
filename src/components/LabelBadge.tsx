import { BADGE_BASE, LABEL_COLORS, LABEL_FALLBACK } from '../utils/helpers'

interface Props {
  label: string
}

export default function LabelBadge({ label }: Props) {
  const color = LABEL_COLORS[label] ?? LABEL_FALLBACK
  return (
    <span className={`${BADGE_BASE} ${color}`}>
      {label}
    </span>
  )
}
