import { FiArrowRight } from 'react-icons/fi'
import { IoCheckmark } from 'react-icons/io5'

import { Badge, Button, Typograph } from '../../shared/components'

import styles from './FormatPage.module.css'

const features = [
  {
    description: 'Single, multiple choice, match и короткий ввод.',
    title: '7 вопросов разного типа',
  },
  {
    description: 'Объяснение появляется сразу после ответа, даже если он верный.',
    title: 'Мгновенный разбор',
  },
  {
    description: 'В конце — темы с пробелами и рекомендации, что повторить.',
    title: 'Карта слабых тем',
  },
  {
    description: 'Анонимное прохождение.',
    title: 'Без регистрации',
  },
]

export interface FormatPageProps {
  onChooseProfession?: () => void
}

export function FormatPage({ onChooseProfession }: FormatPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.content}>
          <div className={styles.hero}>
            <Badge className={styles.badge}>02 — формат</Badge>

            <Typograph
              className={styles.title}
              size="h1"
              tag="h1"
              variant="inverse"
              weight={900}
            >
              <span>7 вопросов.</span>
              <span>Разбор сразу.</span>
              <span>Карта</span>
              <span>пробелов.</span>
            </Typograph>

            <Typograph
              className={styles.description}
              size="lg"
              tag="p"
              variant="inverse"
              weight={500}
            >
              Сервис помогает проверить базу и понять, какие темы стоит
              повторить перед собеседованием.
            </Typograph>

            <Button
              className={styles.button}
              variant="secondary"
              onClick={onChooseProfession}
            >
              Выбрать профессию
              <FiArrowRight className={styles.buttonIcon} aria-hidden="true" />
            </Button>
          </div>

          <div className={styles.features} aria-label="Формат тренажёра">
            {features.map((feature) => (
              <article className={styles.feature} key={feature.title}>
                <span className={styles.iconBox} aria-hidden="true">
                  <IoCheckmark className={styles.icon} />
                </span>

                <div className={styles.featureText}>
                  <Typograph
                    className={styles.featureTitle}
                    size="base"
                    tag="h2"
                    variant="inverse"
                    weight={900}
                  >
                    {feature.title}
                  </Typograph>

                  <Typograph
                    className={styles.featureDescription}
                    size="sm"
                    tag="p"
                    variant="inverse"
                    weight={700}
                  >
                    {feature.description}
                  </Typograph>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}