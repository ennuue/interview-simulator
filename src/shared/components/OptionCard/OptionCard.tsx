import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { IoChevronDown } from 'react-icons/io5'
import clsx from 'clsx'

import styles from './OptionCard.module.css'

export type OptionCardIndicator = 'radio' | 'chevron'

export interface OptionCardProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: ReactNode
  indicator?: OptionCardIndicator
}

export function OptionCard({
  active = false,
  children,
  className,
  indicator = 'radio',
  type = 'button',
  ...props
}: OptionCardProps) {
  return (
    <button
      className={clsx(
        styles.root,
        styles[indicator],
        active && styles.active,
        className,
      )}
      type={type}
      {...props}
    >
      {indicator === 'radio' && <span className={styles.radioIndicator} />}
      <span className={styles.content}>{children}</span>
      {indicator === 'chevron' && (
        <IoChevronDown className={styles.chevronIcon} aria-hidden="true" />
      )}
    </button>
  )
}
