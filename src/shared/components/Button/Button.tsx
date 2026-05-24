import MuiButton from '@mui/material/Button'
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button'
import clsx from 'clsx'

import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps
  extends Omit<MuiButtonProps, 'variant' | 'color' | 'size'> {
  variant?: ButtonVariant
}

export function Button({
  variant = 'primary',
  className,
  disableElevation = true,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      className={clsx(styles.root, styles[variant], className)}
      disableElevation={disableElevation}
      variant="contained"
      {...props}
    />
  )
}
