import InputBase from '@mui/material/InputBase'
import type { InputBaseProps } from '@mui/material/InputBase'
import clsx from 'clsx'

import styles from './Input.module.css'

export interface InputProps
  extends Omit<InputBaseProps, 'classes' | 'color' | 'size'> {}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <InputBase
      className={clsx(styles.root, styles.default, className)}
      classes={{
        focused: styles.focused,
        disabled: styles.disabled,
        error: styles.error,
      }}
      error={error}
      {...props}
    />
  )
}
