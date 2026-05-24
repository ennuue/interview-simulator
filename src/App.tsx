import { useCallback, useEffect, useState } from 'react'

import {
  FormatPage,
  MainPage,
  ProfessionSelectPage,
  ResultPage,
  TestPage,
} from './pages'
import type { ProfessionId } from './shared/api/mock'
import type { InterviewResult } from './shared/model'
import { StackedScrollLayout } from './widgets/stacked-scroll-layout'

import styles from './App.module.css'

type AppMode = 'landing' | 'result' | 'test'

const FORMAT_SECTION_INDEX = 1
const PROFESSION_SELECT_SECTION_INDEX = 2

function App() {
  const [mode, setMode] = useState<AppMode>('landing')
  const [selectedProfession, setSelectedProfession] =
    useState<ProfessionId>('frontend')
  const [interviewResult, setInterviewResult] =
    useState<InterviewResult | null>(null)
  const [initialLandingSection, setInitialLandingSection] = useState(0)
  const [landingScrollRequestKey, setLandingScrollRequestKey] = useState(0)

  const startTest = useCallback(
    (professionId?: ProfessionId) => {
      const nextProfession = professionId ?? selectedProfession

      setSelectedProfession(nextProfession)
      setInterviewResult(null)
      setMode('test')
    },
    [selectedProfession],
  )

  const goToLandingSection = useCallback((sectionIndex: number) => {
    setInitialLandingSection(sectionIndex)
    setLandingScrollRequestKey((key) => key + 1)
  }, [])

  const goToFormat = useCallback(() => {
    goToLandingSection(FORMAT_SECTION_INDEX)
  }, [goToLandingSection])

  const goToProfessionSelect = useCallback(() => {
    goToLandingSection(PROFESSION_SELECT_SECTION_INDEX)
  }, [goToLandingSection])

  const returnToProfessionSelect = () => {
    goToProfessionSelect()
    setInterviewResult(null)
    setMode('landing')
  }

  const returnToMainPage = () => {
    goToLandingSection(0)
    setInterviewResult(null)
    setMode('landing')
  }

  const showResult = (result: InterviewResult) => {
    setInterviewResult(result)
    setMode('result')
  }

  useEffect(() => {
    if (mode === 'result' || mode === 'test') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [mode])

  if (mode === 'test') {
    return (
      <div className={styles.routeShell} key="test">
        <TestPage
          professionId={selectedProfession}
          onExit={returnToProfessionSelect}
          onFinish={showResult}
        />
      </div>
    )
  }

  if (mode === 'result' && interviewResult) {
    return (
      <div className={styles.routeShell} key="result">
        <ResultPage result={interviewResult} onBackHome={returnToMainPage} />
      </div>
    )
  }

  return (
    <div className={styles.routeShell} key="landing">
      <StackedScrollLayout
        initialSection={initialLandingSection}
        scrollRequestKey={landingScrollRequestKey}
      >
        <MainPage onStartPreparation={goToFormat} />
        <FormatPage onChooseProfession={goToProfessionSelect} />
        <ProfessionSelectPage onSelectProfession={startTest} />
      </StackedScrollLayout>
    </div>
  )
}

export default App