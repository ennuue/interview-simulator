import MuiCheckbox from '@mui/material/Checkbox'
import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox'
import type { ReactNode } from 'react'
import { IoCheckmark } from 'react-icons/io5'
import clsx from 'clsx'

import styles from './Checkbox.module.css'

export type CheckboxStatus = 'success' | 'error'

export interface CheckboxProps
  extends Omit<MuiCheckboxProps, 'classes' | 'color' | 'size'> {
  label: ReactNode
  status?: CheckboxStatus
}

export function Checkbox({
  label,
  className,
  disableRipple = true,
  status,
  ...props
}: CheckboxProps) {
  return (
    <label className={clsx(styles.root, status && styles[status], className)}>
      <MuiCheckbox
        className={styles.control}
        checkedIcon={
          <span
            aria-hidden="true"
            className={clsx(styles.icon, styles.checkedIcon)}
          />
        }
        disableRipple={disableRipple}
        icon={<span aria-hidden="true" className={styles.icon} />}
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
