import { Typograph } from '../Typograph'

import styles from './TimerBadge.module.css'

export function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds)

  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export interface TimerBadgeProps {
  seconds: number
  label?: string
}

export function TimerBadge({ seconds, label = 'Время' }: TimerBadgeProps) {
  return (
    <div className={styles.root}>
      <Typograph
        className={styles.label}
        font="mono"
        size="xs"
        tag="span"
        variant="muted"
        weight={600}
      >
        {label}
      </Typograph>

      <Typograph
        className={styles.value}
        font="mono"
        size="md"
        tag="span"
        variant="primary"
        weight={900}
      >
        {formatDuration(seconds)}
      </Typograph>
    </div>
  )
}