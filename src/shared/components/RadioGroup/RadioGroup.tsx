import MuiRadioGroup from '@mui/material/RadioGroup'
import type { RadioGroupProps as MuiRadioGroupProps } from '@mui/material/RadioGroup'
import clsx from 'clsx'

import styles from './RadioGroup.module.css'

export type RadioGroupProps = MuiRadioGroupProps

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <MuiRadioGroup
      className={clsx(styles.root, className)}
      {...props}
    />
  )
}
