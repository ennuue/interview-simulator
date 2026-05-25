import { FiArrowRight } from 'react-icons/fi'

import {
  Badge,
  Button,
  Card,
  OptionCard,
  ProgressBar,
  TimerBadge,
  Typograph,
} from '../../shared/components'

import styles from './MainPage.module.css'

const answerOptions = [
  'Делает текст жирным',
  'Создаёт flex-контейнер',
  'Добавляет анимацию',
  'Меняет шрифт',
]

export interface MainPageProps {
  onStartPreparation?: () => void
}

export function MainPage({ onStartPreparation }: MainPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <Badge className={styles.heroBadge}>Тренажёр собеседований</Badge>
            <Typograph
              className={styles.title}
              size="display"
              tag="h1"
              weight={900}
            >
              <span>Подготовься</span>
              <span>к техническому</span>
              <span className={styles.titleUnderlined}>собеседованию</span>
            </Typograph>
            <Typograph
              className={styles.description}
              size="lg"
              tag="p"
              variant="muted"
            >
              Выбери профессию, ответь на вопросы и получи понятный разбор по
              каждой теме. В конце сервис покажет слабые места и рекомендации
              для подготовки.
            </Typograph>
            <Button className={styles.cta} onClick={onStartPreparation}>
              Начать подготовку
              <FiArrowRight className={styles.buttonArrow} aria-hidden="true" />
            </Button>
          </div>

          <Card
            className={styles.questionCard}
            title={
              <span className={styles.questionHeader}>
                <Badge>Пример вопроса</Badge>
                <TimerBadge seconds={34} label="Время" />
              </span>
            }
          >
            <div className={styles.questionContent}>
              <Typograph
                className={styles.questionTitle}
                size="h3"
                tag="h2"
                weight={900}
              >
                Что делает <code>display: flex</code>?
              </Typograph>
              <ProgressBar
                className={styles.progress}
                value={64}
                aria-hidden="true"
              />

              <div className={styles.answers}>
                {answerOptions.map((option, index) => (
                  <OptionCard
                    active={index === 1}
                    key={option}
                  >
                    {option}
                  </OptionCard>
                ))}
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  )
}
