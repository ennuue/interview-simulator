import {
  IoDesktopOutline,
  IoFlaskOutline,
  IoServerOutline,
} from 'react-icons/io5'

import { Badge, Typograph } from '../../shared/components'
import type { ProfessionId } from '../../shared/api/mock'

import { CourseCard } from './CourseCard'
import styles from './ProfessionSelectPage.module.css'

const professions = [
  {
    accent: 'blue',
    counter: '01 / 03',
    description: 'HTML, CSS, JavaScript, базовая логика интерфейсов.',
    icon: IoDesktopOutline,
    id: 'frontend',
    meta: '7 вопросов · ~7 минут',
    title: 'Frontend-разработчик',
  },
  {
    accent: 'green',
    counter: '02 / 03',
    description: 'Тест-кейсы, баг-репорты, виды тестирования и приёмка.',
    icon: IoFlaskOutline,
    id: 'qa',
    meta: '7 вопросов · ~7 минут',
    title: 'Тестировщик',
  },
  {
    accent: 'purple',
    counter: '03 / 03',
    description: 'API, HTTP, базы данных и серверная логика.',
    icon: IoServerOutline,
    id: 'backend',
    meta: '7 вопросов · ~7 минут',
    title: 'Backend-разработчик',
  },
] as const

export interface ProfessionSelectPageProps {
  onSelectProfession?: (professionId: ProfessionId) => void
}

export function ProfessionSelectPage({
  onSelectProfession,
}: ProfessionSelectPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.content}>
          <Badge className={styles.badge}>03 — выбор профессии</Badge>

          <div className={styles.heading}>
            <Typograph
              className={styles.title}
              size="h1"
              tag="h1"
              variant="inverse"
              weight={900}
            >
              Выберите профессию
            </Typograph>
            <Typograph
              className={styles.description}
              size="base"
              tag="p"
              variant="inverse"
            >
              Для каждой профессии подготовлены вопросы уровня junior: без
              олимпиадных задач и редких тем.
            </Typograph>
          </div>

          <div className={styles.grid}>
            {professions.map((profession) => (
              <CourseCard
                accent={profession.accent}
                actionLabel={`Выбрать ${profession.title}`}
                counter={profession.counter}
                description={profession.description}
                icon={profession.icon}
                key={profession.title}
                meta={profession.meta}
                onSelect={() => onSelectProfession?.(profession.id)}
                title={profession.title}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
