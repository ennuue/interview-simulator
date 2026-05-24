import type { CSSProperties, ReactNode } from 'react';
import styles from './StackedSection.module.css';

export type StackedTheme = 'light' | 'muted' | 'dark' | 'brand';

export interface StackedSectionProps {
  children: ReactNode;
  /** Предустановленная тема (фон + текст + accent). */
  theme?: StackedTheme;
  /** Кастомный CSS — если нужно перебить тему. */
  style?: CSSProperties;
  className?: string;
}

const themeClass: Record<StackedTheme, string> = {
  light: styles.themeLight,
  muted: styles.themeMuted,
  dark: styles.themeDark,
  brand: styles.themeBrand,
};

/**
 * Опциональная обёртка для содержимого секции.
 * Задаёт тему (фон+текст+accent через CSS-переменные)
 * и центрирует контент по горизонтали с max-width 1200px.
 *
 * Использовать НЕОБЯЗАТЕЛЬНО — StackedScrollLayout сам оборачивает
 * каждый child в <section>. Этот компонент удобен только если хочешь
 * быстро применить тему и стандартную сетку.
 */
export function StackedSection({
  children,
  theme = 'light',
  style,
  className,
}: StackedSectionProps) {
  return (
    <div
      className={[themeClass[theme], styles.inner, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      data-stack-theme={theme}
    >
      {children}
    </div>
  );
}
