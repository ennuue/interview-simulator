# `widgets/stacked-scroll-layout`

Layout-виджет «стопка карточек»: каждая секция приклеивается к верху и
наезжает на предыдущую с закруглёнными углами.

## Где лежит (по FSD)

```
src/
└─ widgets/
   └─ stacked-scroll-layout/
      ├─ ui/
      │  ├─ StackedScrollLayout.tsx          ← основной компонент
      │  ├─ StackedScrollLayout.module.css
      │  ├─ StackedSection.tsx               ← опциональная обёртка с темой
      │  └─ StackedSection.module.css
      ├─ index.ts                            ← public API (barrel)
      └─ README.md
```

## Использование

### Минимальный вариант — просто оборачиваешь свои секции

```tsx
import { StackedScrollLayout } from '@/widgets/stacked-scroll-layout';

export function HomePage() {
  return (
    <StackedScrollLayout>
      <HeroSection />
      <ProfessionsSection />
      <HowItWorksSection />
      <CtaSection />
    </StackedScrollLayout>
  );
}
```

Каждый child автоматически становится `position: sticky; top: 0`
секцией высотой `100svh`. Скролл идёт через `window` — никаких
дополнительных контейнеров не нужно.

### С темой и центрированием через `StackedSection`

```tsx
import {
  StackedScrollLayout,
  StackedSection,
} from '@/widgets/stacked-scroll-layout';

export function HomePage() {
  return (
    <StackedScrollLayout>
      <StackedSection theme="light">
        <HeroSection />
      </StackedSection>

      <StackedSection theme="dark">
        <ProfessionsSection />
      </StackedSection>

      <StackedSection theme="brand">
        <HowItWorksSection />
      </StackedSection>

      <StackedSection theme="muted">
        <CtaSection />
      </StackedSection>
    </StackedScrollLayout>
  );
}
```

Доступные темы: `light` (по умолчанию) · `muted` · `dark` · `brand`.

### Прятать индикатор-точки

```tsx
<StackedScrollLayout showProgress={false}>...</StackedScrollLayout>
```

## Кастомизация через CSS-переменные

Layout читает три переменные:

| Переменная        | Что задаёт            | По умолчанию |
| ----------------- | --------------------- | ------------ |
| `--stack-bg`      | Фон секции            | `#ffffff`    |
| `--stack-fg`      | Цвет текста секции    | `#0f172a`    |
| `--stack-accent`  | Активная точка-прогресс | `#2563eb`  |

Переопределить можно либо темой `StackedSection`, либо `style` на самой секции:

```tsx
<StackedScrollLayout>
  <section style={{ '--stack-bg': '#fdf2f8', '--stack-fg': '#831843' }}>
    ...
  </section>
</StackedScrollLayout>
```

## Зависимости

Никаких. Чистый React + CSS (sticky positioning).

Если хочешь добавить инерционный smooth-scroll — оберни приложение
один раз в `<LenisProvider>`-обёртку (или подключи `lenis` глобально).
Виджет совместим.

## Доступность

- Индикатор-прогресс — это `role="tablist"` с `<button role="tab">`,
  у активной точки `aria-selected="true"`. Клик скроллит к секции.
- `prefers-reduced-motion: reduce` отключает scroll-анимацию плавности.

## Импорт по FSD

Из `pages/*`, `app/*` — **только через barrel**:

```ts
// ✅ ok
import { StackedScrollLayout } from '@/widgets/stacked-scroll-layout';

// ❌ нельзя — обход public API
import { StackedScrollLayout } from '@/widgets/stacked-scroll-layout/ui/StackedScrollLayout';
```
