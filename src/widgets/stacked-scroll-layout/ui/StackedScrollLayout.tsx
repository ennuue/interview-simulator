import { Children, isValidElement, type ReactNode, useEffect, useRef, useState } from 'react';
import styles from './StackedScrollLayout.module.css';

export interface StackedScrollLayoutProps {
  /** Каждый child автоматически становится sticky-секцией. */
  children: ReactNode;
  /** Показать индикатор-точки активной секции сверху. */
  showProgress?: boolean;
  /** Индекс секции, к которой нужно перейти после маунта. */
  initialSection?: number;
  /** Меняется, когда нужно повторно проскроллить к той же секции. */
  scrollRequestKey?: number;
  /** Вызывается, когда пользователь доскроллил до конца последней секции. */
  onEndReached?: () => void;
  /** Кастомный класс на корневой элемент. */
  className?: string;
}

/**
 * Layout-виджет «стопка карточек».
 * Использование:
 *   <StackedScrollLayout>
 *     <StackedSection>...</StackedSection>
 *     <StackedSection theme="dark">...</StackedSection>
 *     <StackedSection theme="brand">...</StackedSection>
 *   </StackedScrollLayout>
 *
 * Любой child, у которого нет класса от StackedSection, всё равно
 * обернётся в section-обёртку, так что можно вкладывать любой React-узел.
 */
export function StackedScrollLayout({
  children,
  showProgress = true,
  initialSection = 0,
  scrollRequestKey = 0,
  onEndReached,
  className,
}: StackedScrollLayoutProps) {
  const items = Children.toArray(children).filter(isValidElement);
  const total = items.length;
  const [active, setActive] = useState(0);
  const endReachedRef = useRef(false);
  const didScrollToInitialRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const sections = root.querySelectorAll<HTMLElement>(`.${styles.section}`);
      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const scrollLine = window.scrollY + window.innerHeight / 2;
      let nextActive = 0;

      sections.forEach((section, i) => {
        const sectionTop = rootTop + section.offsetTop;
        if (scrollLine >= sectionTop) {
          nextActive = i;
        }
      });

      setActive(nextActive);

      if (!onEndReached || total === 0) {
        return;
      }

      const scrollBottom = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtLastSection = nextActive === total - 1;
      const isAtDocumentEnd = scrollBottom >= documentHeight - 4;

      if (isAtLastSection && isAtDocumentEnd && !endReachedRef.current) {
        endReachedRef.current = true;
        onEndReached();
      }

      if (!isAtDocumentEnd) {
        endReachedRef.current = false;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onEndReached, total]);

  useEffect(() => {
    const sections = rootRef.current?.querySelectorAll<HTMLElement>(
      `.${styles.section}`,
    );

    const behavior = didScrollToInitialRef.current ? 'smooth' : 'auto';
    const element = sections?.[initialSection];
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior });
    }
    didScrollToInitialRef.current = true;
  }, [initialSection, scrollRequestKey]);

  const scrollTo = (i: number) => {
    const sections = rootRef.current?.querySelectorAll<HTMLElement>(
      `.${styles.section}`,
    );

    if (sections) {
      sections[i]?.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(' ')}>
      {showProgress && total > 1 && (
        <div className={styles.progress} role="tablist" aria-label="Секции">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={[styles.dot, i === active ? styles.active : ''].join(' ')}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      )}

      {items.map((child, i) => (
        // оборачиваем каждый child в section, даже если это не StackedSection
        // (так компонент терпим к голому JSX)
        <section key={i} className={styles.section}>
          {child}
        </section>
      ))}
    </div>
  );
}
