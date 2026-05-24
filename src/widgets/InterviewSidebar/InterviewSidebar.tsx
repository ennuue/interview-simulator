import type { ReactNode } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { IoCheckmark } from 'react-icons/io5'
import clsx from 'clsx'

import { Typograph } from '../../shared/components'

import styles from './InterviewSidebar.module.css'

export type InterviewSidebarStepState = 'done' | 'active' | 'default'

export interface InterviewSidebarStep {
  description: ReactNode
  id: string
  state: InterviewSidebarStepState
  title: ReactNode
}

export interface InterviewSidebarProps {
  actionLabel: ReactNode
  onAction?: () => void
  steps: ReadonlyArray<InterviewSidebarStep>
}

export function InterviewSidebar({
  actionLabel,
  onAction,
  steps,
}: InterviewSidebarProps) {
  return (
    <aside className={styles.root}>
      <div className={styles.brand}>
        <span className={styles.logo}>
          <Typograph size="lg" tag="span" variant="inverse" weight={900}>
            И
          </Typograph>
        </span>
        <Typograph
          className={styles.brandName}
          size="xl"
          tag="span"
          weight={900}
        >
          Интервью
        </Typograph>
      </div>

      <nav className={styles.steps} aria-label="Этапы теста">
        <Typograph
          className={styles.stepsLabel}
          size="sm"
          tag="p"
          variant="muted"
          weight={700}
        >
          Этап
        </Typograph>

        <div className={styles.stepsList}>
          {steps.map((step, index) => (
            <div
              className={clsx(styles.step, styles[step.state])}
              key={step.id}
            >
              <span className={styles.stepIcon} aria-hidden="true">
                {step.state === 'done' ? (
                  <IoCheckmark className={styles.checkIcon} />
                ) : (
                  <Typograph
                    size="md"
                    tag="span"
                    variant="inherit"
                    weight={900}
                  >
                    {index + 1}
                  </Typograph>
                )}
              </span>

              <span className={styles.stepText}>
                <Typograph
                  className={styles.stepTitle}
                  size="base"
                  tag="span"
                  weight={900}
                >
                  {step.title}
                </Typograph>
                <Typograph
                  className={styles.stepDescription}
                  size="sm"
                  tag="span"
                  variant="secondary"
                  weight={600}
                >
                  {step.description}
                </Typograph>
              </span>
            </div>
          ))}
        </div>
      </nav>

      <button className={styles.actionButton} type="button" onClick={onAction}>
        <FiArrowLeft aria-hidden="true" />
        <Typograph size="base" tag="span" variant="inherit" weight={800}>
          {actionLabel}
        </Typograph>
      </button>
    </aside>
  )
}
