import MuiTypography from '@mui/material/Typography'
import type { TypographyProps as MuiTypographyProps } from '@mui/material/Typography'
import type { ElementType } from 'react'
import clsx from 'clsx'

import styles from './Typograph.module.css'

export type TypographTone =
  | 'error'
  | 'inherit'
  | 'inverse'
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'success'
export type TypographLegacyVariant = 'title' | 'subtitle' | 'text'
export type TypographVariant = TypographTone | TypographLegacyVariant
export type TypographFont = 'base' | 'mono'
export type TypographSize =
  | 'base'
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xl'
  | 'xs'
export type TypographWeight = 400 | 500 | 600 | 700 | 800 | 900

export interface TypographProps extends Omit<
  MuiTypographyProps,
  'variant' | 'color' | 'fontWeight' | 'component'
> {
  font?: TypographFont
  size?: TypographSize
  tag?: ElementType
  variant?: TypographVariant
  weight?: TypographWeight
}

const legacyVariantSize: Record<TypographLegacyVariant, TypographSize> = {
  subtitle: 'h2',
  text: 'base',
  title: 'h1',
}

const toneVariants: TypographTone[] = [
  'error',
  'inherit',
  'inverse',
  'muted',
  'primary',
  'secondary',
  'success',
]

function isLegacyVariant(
  variant: TypographVariant,
): variant is TypographLegacyVariant {
  return variant in legacyVariantSize
}

function isToneVariant(variant: TypographVariant): variant is TypographTone {
  return toneVariants.includes(variant as TypographTone)
}

export function Typograph({
  font = 'base',
  size,
  tag = 'p',
  variant = 'primary',
  weight,
  className,
  ...props
}: TypographProps) {
  const resolvedSize = size ?? (
    isLegacyVariant(variant) ? legacyVariantSize[variant] : 'base'
  )
  const resolvedTone = isToneVariant(variant) ? variant : 'primary'

  return (
    <MuiTypography
      className={clsx(
        styles.root,
        font === 'mono' ? styles.fontMono : styles.fontBase,
        styles[resolvedSize],
        styles[resolvedTone],
        weight && styles[`weight${weight}`],
        className,
      )}
      component={tag}
      variant="inherit"
      {...props}
    />
  )
}
