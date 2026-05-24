export interface InterviewAnswerReference {
  title: string
  url: string
}

export interface InterviewAnswerRecord {
  correctAnswerIds: string[]
  correctAnswerTexts: string[]
  explanation: string
  isCorrect: boolean
  order: number
  questionId: string
  questionTitle: string
  references: InterviewAnswerReference[]
  selectedAnswerIds: string[]
  selectedAnswerTexts: string[]
  topic: string
  type: string
}

export interface InterviewResultTopic {
  correctCount: number
  incorrectCount: number
  percent: number
  topic: string
  totalCount: number
}

export interface InterviewResult {
  answers: InterviewAnswerRecord[]
  correctCount: number
  durationSeconds: number
  incorrectCount: number
  level: string
  percent: number
  professionId: string
  professionTitle: string
  topics: InterviewResultTopic[]
  totalQuestions: number
}

export interface BuildInterviewResultParams {
  answers: InterviewAnswerRecord[]
  durationSeconds: number
  level: string
  professionId: string
  professionTitle: string
}

export function buildInterviewResult({
  answers,
  durationSeconds,
  level,
  professionId,
  professionTitle,
}: BuildInterviewResultParams): InterviewResult {
  const totalQuestions = answers.length
  const correctCount = answers.filter((answer) => answer.isCorrect).length
  const incorrectCount = totalQuestions - correctCount

  const percent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const topicMap = new Map<
    string,
    {
      correctCount: number
      incorrectCount: number
      totalCount: number
    }
  >()

  answers.forEach((answer) => {
    const topicData = topicMap.get(answer.topic) ?? {
      correctCount: 0,
      incorrectCount: 0,
      totalCount: 0,
    }

    topicData.totalCount += 1

    if (answer.isCorrect) {
      topicData.correctCount += 1
    } else {
      topicData.incorrectCount += 1
    }

    topicMap.set(answer.topic, topicData)
  })

  const topics = Array.from(topicMap.entries()).map(([topic, topicData]) => ({
    correctCount: topicData.correctCount,
    incorrectCount: topicData.incorrectCount,
    percent:
      topicData.totalCount > 0
        ? Math.round((topicData.correctCount / topicData.totalCount) * 100)
        : 0,
    topic,
    totalCount: topicData.totalCount,
  }))

  return {
    answers,
    correctCount,
    durationSeconds,
    incorrectCount,
    level,
    percent,
    professionId,
    professionTitle,
    topics,
    totalQuestions,
  }
}