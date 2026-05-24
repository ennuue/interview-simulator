import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

import styles from './ProgressBar.module.css'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
  value: number
}

export function ProgressBar({
  className,
  max = 100,
  value,
  ...props
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 100
  const clampedValue = Math.min(Math.max(value, 0), safeMax)
  const progress = (clampedValue / safeMax) * 100

  return (
    <div
      className={clsx(styles.root, className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clampedValue}
      {...props}
    >
      <span className={styles.fill} style={{ width: `${progress}%` }} />
    </div>
  )
}
