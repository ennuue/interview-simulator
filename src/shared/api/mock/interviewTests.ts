import type { InterviewTest, ProfessionId } from './types'

const interviewTestsUrl = new URL('./interview-tests.json', import.meta.url).href

export async function getInterviewTestsMock(): Promise<InterviewTest[]> {
  const response = await fetch(interviewTestsUrl)

  if (!response.ok) {
    throw new Error('Ошибка загрузка моковых вопросов')
  }

  return await response.json() as Promise<InterviewTest[]>
}

export async function getInterviewTestByProfessionMock(
  professionId: ProfessionId,
): Promise<InterviewTest | undefined> {
  const tests = await getInterviewTestsMock()

  return tests.find((test) => test.professionId === professionId)
}
