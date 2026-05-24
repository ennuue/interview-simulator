import { useEffect, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { IoCheckmark } from 'react-icons/io5'

import {
  AnswerFeedback,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  ProgressBar,
  Radio,
  RadioGroup,
  TimerBadge,
  Typograph,
  type CheckboxStatus,
  type RadioStatus,
} from '../../shared/components'
import {
  getInterviewTestByProfessionMock,
  type InterviewQuestion,
  type InterviewTest,
  type ProfessionId,
  type QuestionType,
} from '../../shared/api/mock'
import {
  buildInterviewResult,
  type InterviewAnswerRecord,
  type InterviewResult,
} from '../../shared/model'
import { InterviewSidebar } from '../../widgets'

import styles from './TestPage.module.css'

type MatchPair = {
  value: string
  label: string
}

type MatchQuestion = InterviewQuestion & {
  matchPairs?: MatchPair[]
}

const questionTypeLabels: Record<QuestionType, string> = {
  match: 'Сопоставление',
  multiple: 'Несколько ответов',
  single: 'Один ответ',
  text: 'Короткий ответ',
}

function getMatchPairs(question: InterviewQuestion): MatchPair[] {
  return (question as MatchQuestion).matchPairs ?? []
}

function normalizeAnswer(answer: InterviewQuestion['correctAnswer']): string[] {
  if (Array.isArray(answer)) {
    return answer.map(String)
  }

  if (typeof answer === 'object' && answer !== null) {
    return Object.entries(answer).map(
      ([optionId, matchValue]) => `${optionId}:${String(matchValue)}`,
    )
  }

  return [String(answer)]
}

function normalizeOpenAnswer(answer: string) {
  return answer
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[‐-–—]/g, '-')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ')
}

function areAnswerSetsEqual(
  selected: string[],
  correct: string[],
  normalizeText = false,
) {
  if (normalizeText) {
    const selectedAnswer = normalizeOpenAnswer(selected[0] ?? '')

    return correct.some(
      (correctAnswer) => normalizeOpenAnswer(correctAnswer) === selectedAnswer,
    )
  }

  if (selected.length !== correct.length) {
    return false
  }

  const correctSet = new Set(correct)

  return selected.every((answerId) => correctSet.has(answerId))
}

function getMatchAnswerText(question: InterviewQuestion, answerId: string) {
  const [optionId, matchValue] = answerId.split(':')

  const optionText =
    question.options?.find((option) => option.id === optionId)?.text ?? optionId

  const matchText =
    getMatchPairs(question).find((pair) => pair.value === matchValue)?.label ??
    matchValue

  return `${optionText} — ${matchText}`
}

function getAnswerTexts(question: InterviewQuestion, answerIds: string[]) {
  if (question.type === 'match') {
    return answerIds.map((answerId) => getMatchAnswerText(question, answerId))
  }

  const optionById = new Map(
    question.options?.map((option) => [option.id, option.text]),
  )

  return answerIds.map((answerId) => optionById.get(answerId) ?? answerId)
}

function createAnswerRecord({
  correctAnswerIds,
  isCorrect,
  question,
  selectedAnswerIds,
}: {
  correctAnswerIds: string[]
  isCorrect: boolean
  question: InterviewQuestion
  selectedAnswerIds: string[]
}): InterviewAnswerRecord {
  return {
    correctAnswerIds,
    correctAnswerTexts: getAnswerTexts(question, correctAnswerIds),
    explanation: question.explanation,
    isCorrect,
    order: question.order,
    questionId: question.id,
    questionTitle: question.title,
    references: question.references,
    selectedAnswerIds,
    selectedAnswerTexts: getAnswerTexts(question, selectedAnswerIds),
    topic: question.topic,
    type: question.type,
  }
}

export interface TestPageProps {
  onExit?: () => void
  onFinish?: (result: InterviewResult) => void
  professionId?: ProfessionId
}

export function TestPage({
  onExit,
  onFinish,
  professionId = 'frontend',
}: TestPageProps) {
  const [test, setTest] = useState<InterviewTest | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [answerRecords, setAnswerRecords] = useState<InterviewAnswerRecord[]>(
    [],
  )
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    let isMounted = true
    const startedAt = Date.now()

    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setIsSubmitted(false)
    setAnswerRecords([])
    setElapsedSeconds(0)
    setTest(null)

    const timerId = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)

    getInterviewTestByProfessionMock(professionId).then((mockTest) => {
      if (isMounted && mockTest) {
        setTest(mockTest)
      }
    })

    return () => {
      isMounted = false
      window.clearInterval(timerId)
    }
  }, [professionId])

  const questions = test?.questions ?? []
  const question = questions[currentQuestionIndex]
  const currentQuestion = question ? currentQuestionIndex + 1 : 1
  const totalQuestions = questions.length || 1
  const correctAnswers = question ? normalizeAnswer(question.correctAnswer) : []

  const correctAnswerText = question
    ? getAnswerTexts(question, correctAnswers).join('; ')
    : ''

  const hasSelectedAnswer =
    question?.type === 'match'
      ? selectedAnswers.length === (question.options?.length ?? 0)
      : selectedAnswers.some((answer) => answer.trim().length > 0)

  const isAnswerCorrect = question
    ? areAnswerSetsEqual(
        selectedAnswers,
        correctAnswers,
        question.type === 'text',
      )
    : false

  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1

  const progressPercent =
    question && totalQuestions > 0
      ? Math.round((currentQuestion / totalQuestions) * 100)
      : 0

  const professionTitle = test?.professionTitle ?? 'Frontend-разработчик'

  const getSelectedMatchValue = (optionId: string) => {
    const prefix = `${optionId}:`
    const answer = selectedAnswers.find((selectedAnswer) =>
      selectedAnswer.startsWith(prefix),
    )

    return answer ? answer.slice(prefix.length) : ''
  }

  const getOptionStatus = (
    optionId: string,
  ): RadioStatus | CheckboxStatus | undefined => {
    if (!isSubmitted) {
      return undefined
    }

    if (correctAnswers.includes(optionId)) {
      return 'success'
    }

    if (selectedAnswers.includes(optionId)) {
      return 'error'
    }

    return undefined
  }

  const getAnswerOptionClassName = (
    status: RadioStatus | CheckboxStatus | undefined,
  ) =>
    [
      styles.answerOption,
      status === 'success' ? styles.answerOptionSuccess : '',
      status === 'error' ? styles.answerOptionError : '',
    ]
      .filter(Boolean)
      .join(' ')

  const getMatchOptionStatus = (optionId: string) => {
    if (!isSubmitted || !question || question.type !== 'match') {
      return ''
    }

    const selectedValue = getSelectedMatchValue(optionId)

    const correctValue = correctAnswers
      .find((answer) => answer.startsWith(`${optionId}:`))
      ?.slice(`${optionId}:`.length)

    if (!selectedValue) {
      return ''
    }

    return selectedValue === correctValue
      ? styles.matchRowSuccess
      : styles.matchRowError
  }

  const selectSingleAnswer = (answerId: string) => {
    if (!isSubmitted) {
      setSelectedAnswers([answerId])
    }
  }

  const toggleMultipleAnswer = (answerId: string) => {
    if (isSubmitted) {
      return
    }

    setSelectedAnswers((answers) =>
      answers.includes(answerId)
        ? answers.filter((selectedAnswer) => selectedAnswer !== answerId)
        : [...answers, answerId],
    )
  }

  const selectMatchAnswer = (optionId: string, matchValue: string) => {
    if (isSubmitted) {
      return
    }

    setSelectedAnswers((answers) => {
      const filteredAnswers = answers.filter(
        (answer) => !answer.startsWith(`${optionId}:`),
      )

      if (!matchValue) {
        return filteredAnswers
      }

      return [...filteredAnswers, `${optionId}:${matchValue}`]
    })
  }

  const goToNextQuestion = () => {
    if (isLastQuestion) {
      return
    }

    setCurrentQuestionIndex((index) => index + 1)
    setSelectedAnswers([])
    setIsSubmitted(false)
  }

  const finishTest = () => {
    if (!test) {
      return
    }

    onFinish?.(
      buildInterviewResult({
        answers: answerRecords,
        durationSeconds: elapsedSeconds,
        level: test.level,
        professionId: test.professionId,
        professionTitle: test.professionTitle,
      }),
    )
  }

  const handleFooterButtonClick = () => {
    if (!question) {
      return
    }

    if (isSubmitted) {
      if (isLastQuestion) {
        finishTest()
        return
      }

      goToNextQuestion()
      return
    }

    if (hasSelectedAnswer) {
      const answerRecord = createAnswerRecord({
        correctAnswerIds: correctAnswers,
        isCorrect: isAnswerCorrect,
        question,
        selectedAnswerIds: selectedAnswers,
      })

      setAnswerRecords((records) => [
        ...records.filter((record) => record.questionId !== question.id),
        answerRecord,
      ])

      setIsSubmitted(true)
    }
  }

  const stages = [
    {
      description: professionTitle,
      id: 'profession',
      state: 'done',
      title: 'Профессия',
    },
    {
      description: `${currentQuestion} из ${totalQuestions}`,
      id: 'questions',
      state: 'active',
      title: 'Вопросы',
    },
    {
      description: 'Разбор и рекомендации',
      id: 'result',
      state: 'default',
      title: 'Результат',
    },
  ] as const

  return (
    <main className={styles.page}>
      <InterviewSidebar
        actionLabel="Выйти из теста"
        onAction={onExit}
        steps={stages}
      />

      <section className={styles.content}>
        <ProgressBar
          className={styles.progressSlider}
          aria-label={`Пройдено ${progressPercent}%`}
          value={progressPercent}
        />

        <header className={styles.header}>
          <div className={styles.headerTop}>
            <Typograph
              className={styles.eyebrow}
              font="mono"
              size="xs"
              tag="p"
              variant="muted"
              weight={500}
            >
              Вопрос {currentQuestion} из {totalQuestions}
            </Typograph>

            <TimerBadge seconds={elapsedSeconds} />
          </div>

          <Typograph
            className={styles.title}
            size="h3"
            tag="h1"
            weight={900}
          >
            {professionTitle} · базовый уровень
          </Typograph>
        </header>

        <Card className={styles.questionCard} aria-label="Область вопроса">
          {question && (
            <>
              <div className={styles.questionMeta}>
                <Badge className={styles.topicBadge}>
                  Тема: {question.topic}
                </Badge>

                <Typograph
                  className={styles.questionType}
                  font="mono"
                  size="xs"
                  tag="span"
                  variant="muted"
                  weight={500}
                >
                  {questionTypeLabels[question.type]}
                </Typograph>
              </div>

              <Typograph
                className={styles.questionTitle}
                size="h2"
                tag="h2"
                weight={900}
              >
                {question.title}
              </Typograph>

              <div className={styles.answers}>
                {question.type === 'single' && (
                  <RadioGroup
                    name={question.id}
                    value={selectedAnswers[0] ?? ''}
                    onChange={(_, value) => selectSingleAnswer(value)}
                  >
                    {question.options?.map((option) => {
                      const status = getOptionStatus(option.id)

                      return (
                        <Radio
                          className={getAnswerOptionClassName(status)}
                          disabled={isSubmitted}
                          key={option.id}
                          label={option.text}
                          status={status}
                          value={option.id}
                        />
                      )
                    })}
                  </RadioGroup>
                )}

                {question.type === 'multiple' && (
                  <>
                    {question.options?.map((option) => {
                      const status = getOptionStatus(option.id)

                      return (
                        <Checkbox
                          checked={selectedAnswers.includes(option.id)}
                          className={getAnswerOptionClassName(status)}
                          disabled={isSubmitted}
                          key={option.id}
                          label={option.text}
                          onChange={() => toggleMultipleAnswer(option.id)}
                          status={status}
                        />
                      )
                    })}
                  </>
                )}

                {question.type === 'text' && (
                  <>
                    <Typograph
                      className={styles.textAnswerHint}
                      size="sm"
                      tag="p"
                      variant="muted"
                      weight={700}
                    >
                      {question.hint}
                    </Typograph>

                    <Input
                      className={[
                        styles.textAnswer,
                        isSubmitted
                          ? isAnswerCorrect
                            ? styles.successAnswer
                            : styles.errorAnswer
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      disabled={isSubmitted}
                      error={isSubmitted && !isAnswerCorrect}
                      onChange={(event) =>
                        setSelectedAnswers([event.target.value])
                      }
                      placeholder="Введите ответ"
                      value={selectedAnswers[0] ?? ''}
                    />
                  </>
                )}

                {question.type === 'match' && (
                  <div className={styles.matchAnswers}>
                    {question.options?.map((option) => (
                      <div
                        className={[
                          styles.matchRow,
                          getMatchOptionStatus(option.id),
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        key={option.id}
                      >
                        <div className={styles.matchOption}>
                          <span className={styles.matchOptionLabel}>
                            {option.text}
                          </span>
                        </div>

                        <div className={styles.matchSelectWrapper}>
                          <select
                            className={styles.matchSelect}
                            disabled={isSubmitted}
                            value={getSelectedMatchValue(option.id)}
                            onChange={(event) =>
                              selectMatchAnswer(option.id, event.target.value)
                            }
                          >
                            <option value="">Выберите соответствие</option>

                            {getMatchPairs(question).map((pair) => (
                              <option key={pair.value} value={pair.value}>
                                {pair.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isSubmitted && (
                <AnswerFeedback
                  className={styles.feedback}
                  status={isAnswerCorrect ? 'success' : 'error'}
                  title={isAnswerCorrect ? 'Верно!' : 'Неверно'}
                >
                  <Typograph
                    className={styles.correctAnswer}
                    size="base"
                    tag="p"
                    variant="secondary"
                    weight={700}
                  >
                    <span>Правильный ответ: </span>
                    {correctAnswerText}
                  </Typograph>

                  <Typograph
                    className={styles.explanation}
                    size="base"
                    tag="p"
                    variant="secondary"
                    weight={500}
                  >
                    <span>Заметка: </span>
                    {question.explanation}
                  </Typograph>

                  {!!question.references?.length && (
                    <Typograph
                      className={styles.references}
                      size="sm"
                      tag="p"
                      variant="secondary"
                      weight={700}
                    >
                      <span>Где почитать: </span>

                      {question.references.map((reference, index) => (
                        <span key={reference.url}>
                          {index > 0 && ', '}

                          <a
                            className={styles.referenceLink}
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
                </AnswerFeedback>
              )}

              <div className={styles.questionFooter}>
                <Button
                  className={styles.answerButton}
                  disabled={!isSubmitted && !hasSelectedAnswer}
                  onClick={handleFooterButtonClick}
                >
                  {isSubmitted
                    ? isLastQuestion
                      ? 'Завершить тест'
                      : 'Следующий вопрос'
                    : 'Ответить'}

                  {isSubmitted ? (
                    <FiArrowRight
                      className={styles.answerButtonIcon}
                      aria-hidden="true"
                    />
                  ) : (
                    <IoCheckmark
                      className={styles.answerButtonIcon}
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </div>
            </>
          )}
        </Card>
      </section>
    </main>
  )
}