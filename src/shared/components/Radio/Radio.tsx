import MuiRadio from '@mui/material/Radio'
import type { RadioProps as MuiRadioProps } from '@mui/material/Radio'
import type { ReactNode } from 'react'
import { IoCheckmark } from 'react-icons/io5'
import clsx from 'clsx'

import styles from './Radio.module.css'

export type RadioStatus = 'success' | 'error'

export interface RadioProps
  extends Omit<MuiRadioProps, 'classes' | 'color' | 'size'> {
  label: ReactNode
  status?: RadioStatus
}

export function Radio({
  label,
  className,
  disableRipple = true,
  status,
  ...props
}: RadioProps) {
  return (
    <label className={clsx(styles.root, status && styles[status], className)}>
      <MuiRadio
        className={styles.control}
        disableRipple={disableRipple}
        size="small"
        {...props}
      />
      <span className={styles.label}>{label}</span>
      {status === 'success' && (
        <IoCheckmark className={styles.statusIcon} aria-hidden="true" />
      )}
    </label>
  )
}
