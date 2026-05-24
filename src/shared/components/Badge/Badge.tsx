import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

import styles from './Badge.module.css'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <span className={clsx(styles.root, className)} {...props}>
      {children}
    </span>
  )
}
