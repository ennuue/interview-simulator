import type { ReactNode } from 'react'
import { IoCheckmark, IoClose } from 'react-icons/io5'
import clsx from 'clsx'

import styles from './AnswerFeedback.module.css'

export type AnswerFeedbackStatus = 'success' | 'error'

export interface AnswerFeedbackProps {
  title: ReactNode
  status: AnswerFeedbackStatus
  children: ReactNode
  className?: string
}

const iconByStatus = {
  success: IoCheckmark,
  error: IoClose,
}

export function AnswerFeedback({
  status,
  children,
  title,
  className,
  ...props
}: AnswerFeedbackProps) {
  const Icon = iconByStatus[status]

  return (
    <div className={clsx(styles.root, styles[status], className)} {...props}>
      <div className={styles.iconBox}>
        <Icon className={styles.icon} aria-hidden="true" />
      </div>
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
