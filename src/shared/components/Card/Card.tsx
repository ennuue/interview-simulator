import MuiCard from '@mui/material/Card'
import type { CardProps as MuiCardProps } from '@mui/material/Card'
import type { ReactNode } from 'react'
import clsx from 'clsx'

import styles from './Card.module.css'

export type CardVariant = 'primary' | 'secondary' | 'mini'

export interface CardProps extends Omit<MuiCardProps, 'title' | 'variant'> {
  active?: boolean
  title?: ReactNode
  variant?: CardVariant
}

export function Card({
  title,
  active = false,
  children,
  className,
  variant = 'primary',
  ...props
}: CardProps) {
  return (
    <MuiCard
      className={clsx(
        styles.root,
        styles[variant],
        active && styles.active,
        className,
      )}
      elevation={0}
      {...props}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      {children && <div className={styles.content}>{children}</div>}
    </MuiCard>
  )
}
