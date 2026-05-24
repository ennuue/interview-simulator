import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

import { Typograph } from '../../shared/components'

import styles from './Header.module.css'

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

export function Header({ children, className, ...props }: HeaderProps) {
  return (
    <header className={clsx(styles.root, className)} {...props}>
      <div className={styles.brand}>
        <span className={styles.logo}>
          <Typograph size="lg" tag="span" variant="inverse" weight={900}>
            IT
          </Typograph>
        </span>
        <Typograph
          className={styles.title}
          size="h3"
          tag="span"
          weight={900}
        >
          Тренажёр собеседований
        </Typograph>
      </div>

      {children && <div className={styles.content}>{children}</div>}
    </header>
  )
}
