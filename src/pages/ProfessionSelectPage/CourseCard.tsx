import type { KeyboardEvent, ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { FiArrowUpRight } from 'react-icons/fi'
import clsx from 'clsx'

import { Typograph } from '../../shared/components'

import styles from './CourseCard.module.css'

export type CourseCardAccent = 'blue' | 'green' | 'purple'

export interface CourseCardProps {
  accent?: CourseCardAccent
  actionLabel: string
  className?: string
  counter: string
  description: ReactNode
  icon: IconType
  meta: string
  onSelect?: () => void
  title: ReactNode
}

export function CourseCard({
  accent = 'blue',
  actionLabel,
  className,
  counter,
  description,
  icon: Icon,
  meta,
  onSelect,
  title,
}: CourseCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect?.()
    }
  }

  return (
    <article
      className={clsx(styles.root, className)}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-label={actionLabel}
    >
      <div className={styles.top}>
        <span className={clsx(styles.iconBox, styles[accent])}>
          <Icon className={styles.icon} aria-hidden="true" />
        </span>

        <Typograph
          className={styles.counter}
          font="mono"
          size="xs"
          tag="span"
          variant="muted"
          weight={700}
        >
          {counter}
        </Typograph>
      </div>

      <div className={styles.body}>
        <Typograph
          className={styles.title}
          size="h2"
          tag="h2"
          variant="inverse"
          weight={900}
        >
          {title}
        </Typograph>

        <Typograph
          className={styles.description}
          size="md"
          tag="p"
          variant="inverse"
          weight={600}
        >
          {description}
        </Typograph>
      </div>

      <div className={styles.footer}>
        <Typograph
          className={styles.meta}
          size="sm"
          tag="span"
          variant="inverse"
          weight={800}
        >
          {meta}
        </Typograph>

        <button
          className={styles.action}
          type="button"
          aria-label={actionLabel}
          onClick={(event) => {
            event.stopPropagation()
            onSelect?.()
          }}
        >
          <FiArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}