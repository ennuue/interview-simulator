import { useState, type CSSProperties } from 'react'
import { FiArrowLeft } from 'react-icons/fi'

import {
  Badge,
  Button,
  Card,
  formatDuration,
  ProgressBar,
  Typograph,
} from '../../shared/components'
import type { InterviewResult } from '../../shared/model'
import { InterviewSidebar } from '../../widgets'

import styles from './ResultPage.module.css'

export interface ResultPageProps {
  onBackHome?: () => void
  result: InterviewResult
}

function getTopicWord(count: number) {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'тем'
  }

  if (lastDigit === 1) {
    return 'тема'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'темы'
  }

  return 'тем'
}

export function ResultPage({ onBackHome, result }: ResultPageProps) {
  const [isAnswerHistoryOpen, setIsAnswerHistoryOpen] = useState(false)

  const durationSeconds = result.durationSeconds ?? 0

  const hasMistakes = result.incorrectCount > 0
  const resultTitle = hasMistakes
    ? 'Есть над чем поработать'
    : 'Отличный результат'

  const resultDescription = hasMistakes
    ? 'Повтори ключевые темы и попробуй ещё раз.'
    : 'Все ответы верные. Можно переходить к следующему направлению.'

  const topicsToRepeat = result.topics.filter(
    (topic) => topic.incorrectCount > 0,
  )

  const wrongAnswersByTopic = topicsToRepeat.map((topic) => ({
    answers: result.answers.filter(
      (answer) => answer.topic === topic.topic && !answer.isCorrect,
    ),
    topic,
  }))

  const topicsCountText = `${result.topics.length} ${getTopicWord(result.topics.length)}`
  const repeatTopicsCountText = `${topicsToRepeat.length} ${getTopicWord(
    topicsToRepeat.length,
  )}`

  const stages = [
    {
      description: result.professionTitle,
      id: 'profession',
      state: 'done',
      title: 'Профессия',
    },
    {
      description: `${result.totalQuestions} из ${result.totalQuestions} пройдено`,
      id: 'questions',
      state: 'done',
      title: 'Вопросы',
    },
    {
      description: 'Разбор и рекомендации',
      id: 'result',
      state: 'active',
      title: 'Результат',
    },
  ] as const

  return (
    <main className={styles.page}>
      <InterviewSidebar
        actionLabel="На главную"
        onAction={onBackHome}
        steps={stages}
      />

      <section className={styles.content}>
        <button
          className={styles.mobileBackButton}
          type="button"
          onClick={onBackHome}
        >
          <FiArrowLeft aria-hidden="true" />

          <Typograph size="base" tag="span" variant="inherit" weight={800}>
            На главную
          </Typograph>
        </button>

        <header className={styles.header}>
          <Typograph
            className={styles.eyebrow}
            font="mono"
            size="xs"
            tag="p"
            variant="muted"
            weight={600}
          >
            Результат · {result.professionTitle} · базовый уровень
          </Typograph>

          <Typograph
            className={styles.title}
            size="h1"
            tag="h1"
            weight={900}
          >
            {resultTitle}
          </Typograph>

          <Typograph
            className={styles.description}
            size="base"
            tag="p"
            variant="secondary"
            weight={500}
          >
            {resultDescription}
          </Typograph>
        </header>

        <div className={styles.topGrid}>
          <Card className={styles.summaryCard}>
            <div className={styles.summaryContent}>
              <div
                className={styles.scoreRing}
                style={
                  {
                    '--score-percent': `${result.percent}%`,
                  } as CSSProperties
                }
              >
                <Typograph size="h3" tag="span" weight={900}>
                  {result.percent}%
                </Typograph>
              </div>

              <div className={styles.summaryText}>
                <div className={styles.scoreGroup}>
                  <Typograph
                    className={styles.scoreValue}
                    size="h2"
                    tag="p"
                    variant="secondary"
                    weight={900}
                  >
                    {result.correctCount}/{result.totalQuestions}
                  </Typograph>

                  <Typograph
                    className={styles.scoreLabel}
                    size="sm"
                    tag="p"
                    variant="muted"
                    weight={700}
                  >
                    правильных ответов
                  </Typograph>
                </div>

                <div className={styles.badges}>
                  <Badge className={styles.successBadge}>
                    {result.correctCount} верных
                  </Badge>

                  <Badge className={styles.errorBadge}>
                    {result.incorrectCount} ошибок
                  </Badge>

                  <Badge className={styles.timeBadge}>
                    {formatDuration(durationSeconds)}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className={styles.topicsCard}>
            <div className={styles.cardHeader}>
              <Typograph size="lg" tag="h2" weight={900}>
                По темам
              </Typograph>

              <Typograph
                className={styles.meta}
                font="mono"
                size="xs"
                tag="span"
                variant="muted"
                weight={700}
              >
                {topicsCountText}
              </Typograph>
            </div>

            <div className={styles.topicList}>
              {result.topics.map((topic) => (
                <div className={styles.topicRow} key={topic.topic}>
                  <div className={styles.topicInfo}>
                    <Typograph size="md" tag="h3" weight={900}>
                      {topic.topic}
                    </Typograph>

                    <Typograph
                      className={styles.topicCount}
                      size="sm"
                      tag="p"
                      variant="muted"
                      weight={600}
                    >
                      {topic.correctCount}/{topic.totalCount}
                    </Typograph>
                  </div>

                  <ProgressBar
                    className={styles.topicProgress}
                    value={topic.percent}
                  />

                  <Typograph
                    className={styles.topicPercent}
                    size="sm"
                    tag="span"
                    variant={topic.percent === 100 ? 'success' : 'error'}
                    weight={900}
                  >
                    {topic.percent}%
                  </Typograph>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className={styles.repeatCard}>
          <div className={styles.cardHeader}>
            <Typograph size="lg" tag="h2" weight={900}>
              Что повторить
            </Typograph>

            <Typograph
              className={styles.meta}
              font="mono"
              size="xs"
              tag="span"
              variant="muted"
              weight={700}
            >
              {repeatTopicsCountText}
            </Typograph>
          </div>

          {wrongAnswersByTopic.length > 0 ? (
            <div className={styles.repeatList}>
              {wrongAnswersByTopic.map(({ answers, topic }, index) => (
                <article className={styles.repeatItem} key={topic.topic}>
                  <Typograph
                    className={styles.repeatNumber}
                    font="mono"
                    size="sm"
                    tag="span"
                    variant="primary"
                    weight={900}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Typograph>

                  <div className={styles.repeatContent}>
                    <Typograph
                      className={styles.repeatTitle}
                      size="lg"
                      tag="h3"
                      weight={900}
                    >
                      {topic.topic}
                    </Typograph>

                    <Typograph
                      className={styles.repeatExample}
                      size="md"
                      tag="p"
                      variant="secondary"
                      weight={600}
                    >
                      Например: «{answers[0]?.questionTitle}»
                    </Typograph>

                    {!!answers[0]?.references?.length && (
                      <Typograph
                        className={styles.repeatLinks}
                        size="sm"
                        tag="p"
                        weight={700}
                      >
                        {answers[0].references.map((reference, linkIndex) => (
                          <span key={reference.url}>
                            {linkIndex > 0 && ', '}

                            <a
                              href={reference.url}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {reference.title}
                            </a>
                          </span>
                        ))}
                      </Typograph>
                    )}
                  </div>

                  <Typograph
                    className={styles.repeatPercent}
                    size="xl"
                    tag="span"
                    variant="error"
                    weight={900}
                  >
                    {topic.percent}%
                  </Typograph>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyRepeat}>
              <Typograph size="base" tag="p" variant="success" weight={700}>
                Ошибок нет. Для закрепления можно повторить любую тему из
                пройденного набора.
              </Typograph>
            </div>
          )}
        </Card>

        <div className={styles.historyActions}>
          <Button
            className={styles.historyButton}
            onClick={() => setIsAnswerHistoryOpen((value) => !value)}
          >
            {isAnswerHistoryOpen
              ? 'Скрыть историю ответов'
              : 'Показать историю ответов'}
          </Button>
        </div>

        {isAnswerHistoryOpen && (
          <Card className={styles.historyCard}>
            <div className={styles.cardHeader}>
              <Typograph size="lg" tag="h2" weight={900}>
                История ответов
              </Typograph>

              <Typograph
                className={styles.meta}
                font="mono"
                size="xs"
                tag="span"
                variant="muted"
                weight={700}
              >
                {result.answers.length} вопросов
              </Typograph>
            </div>

            <div className={styles.historyList}>
              {result.answers.map((answer) => (
                <article
                  className={[
                    styles.historyItem,
                    answer.isCorrect
                      ? styles.historyItemSuccess
                      : styles.historyItemError,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={answer.questionId}
                >
                  <div className={styles.historyHeader}>
                    <div>
                      <Typograph
                        className={styles.historyOrder}
                        font="mono"
                        size="xs"
                        tag="p"
                        variant="muted"
                        weight={700}
                      >
                        Вопрос {answer.order} · {answer.topic}
                      </Typograph>

                      <Typograph
                        className={styles.historyQuestion}
                        size="lg"
                        tag="h3"
                        weight={900}
                      >
                        {answer.questionTitle}
                      </Typograph>
                    </div>

                    <Badge
                      className={
                        answer.isCorrect
                          ? styles.successBadge
                          : styles.errorBadge
                      }
                    >
                      {answer.isCorrect ? 'Верно' : 'Ошибка'}
                    </Badge>
                  </div>

                  <div className={styles.answerGrid}>
                    <div className={styles.answerBlock}>
                      <Typograph
                        className={styles.answerBlockTitle}
                        size="sm"
                        tag="p"
                        variant="muted"
                        weight={800}
                      >
                        Твой ответ
                      </Typograph>

                      <Typograph
                        size="base"
                        tag="p"
                        variant="secondary"
                        weight={700}
                      >
                        {answer.selectedAnswerTexts.length > 0
                          ? answer.selectedAnswerTexts.join('; ')
                          : 'Ответ не указан'}
                      </Typograph>
                    </div>

                    <div className={styles.answerBlock}>
                      <Typograph
                        className={styles.answerBlockTitle}
                        size="sm"
                        tag="p"
                        variant="muted"
                        weight={800}
                      >
                        Правильный ответ
                      </Typograph>

                      <Typograph
                        size="base"
                        tag="p"
                        variant="secondary"
                        weight={700}
                      >
                        {answer.correctAnswerTexts.join('; ')}
                      </Typograph>
                    </div>
                  </div>

                  <div className={styles.noteBlock}>
                    <Typograph
                      className={styles.answerBlockTitle}
                      size="sm"
                      tag="p"
                      variant="muted"
                      weight={800}
                    >
                      Заметка
                    </Typograph>

                    <Typograph
                      size="base"
                      tag="p"
                      variant="secondary"
                      weight={600}
                    >
                      {answer.explanation}
                    </Typograph>
                  </div>

                  {!!answer.references?.length && (
                    <Typograph
                      className={styles.historyLinks}
                      size="sm"
                      tag="p"
                      weight={700}
                    >
                      <span>Где почитать: </span>

                      {answer.references.map((reference, index) => (
                        <span key={reference.url}>
                          {index > 0 && ', '}

                          <a
                            href={reference.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {reference.title}
                          </a>
                        </span>
                      ))}
                    </Typograph>
                  )}
                </article>
              ))}
            </div>
          </Card>
        )}
      </section>
    </main>
  )
}