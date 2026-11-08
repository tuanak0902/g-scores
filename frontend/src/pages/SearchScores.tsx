import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Student } from '../api/types'
import { SearchIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import Skeleton from '../components/Skeleton'
import StatusMessage from '../components/StatusMessage'
import { useFetch } from '../hooks/useFetch'
import { formatScore, useLocale } from '../hooks/useLocale'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLevelOf } from '../levels'

const SBD_LENGTH = 8
const EXAMPLE_SBD = '01000001'

type ScoreKey = Exclude<keyof Student, 'sbd' | 'foreignLanguageCode'>

// Sub-component so each row can safely call the useLevelOf hook
function ScoreRow({ label, score }: { label: string; score: number | null }) {
  const { t } = useTranslation()
  const locale = useLocale()
  const level = useLevelOf(score ?? 0)

  if (score === null) {
    return (
      <li className="score-row">
        <span className="subject">{label}</span>
        <span className="track untaken" aria-hidden="true" />
        <span className="score-val muted">{t('search.notTaken')}</span>
      </li>
    )
  }

  return (
    <li className="score-row">
      <span className="subject">{label}</span>
      <span className="track" aria-hidden="true">
        <i className="fill" style={{ width: `${score * 10}%`, background: level.color }} />
        <i className="tick" style={{ left: '40%' }} />
        <i className="tick" style={{ left: '60%' }} />
        <i className="tick" style={{ left: '80%' }} />
      </span>
      <span className="score-val">
        <strong>{formatScore(score, locale)}</strong>
        <span className="pill" style={{ color: level.text, background: level.tint }}>
          {level.name}
        </span>
      </span>
    </li>
  )
}

export default function SearchScores() {
  const { t } = useTranslation()
  usePageTitle(t('search.title'))

  const SUBJECTS: { key: ScoreKey; label: string }[] = [
    { key: 'math',           label: t('subjects.math') },
    { key: 'literature',     label: t('subjects.literature') },
    { key: 'foreignLanguage',label: t('subjects.foreignLanguage') },
    { key: 'physics',        label: t('subjects.physics') },
    { key: 'chemistry',      label: t('subjects.chemistry') },
    { key: 'biology',        label: t('subjects.biology') },
    { key: 'history',        label: t('subjects.history') },
    { key: 'geography',      label: t('subjects.geography') },
    { key: 'civicEducation', label: t('subjects.civicEducation') },
  ]

  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const { data: student, loading, error, reload } = useFetch<Student>(
    submitted ? `/api/scores/${submitted}` : null,
  )

  function search(sbd: string) {
    if (sbd.length !== SBD_LENGTH) {
      setValidationError(t('search.validationLength', { n: SBD_LENGTH }))
      return
    }
    setValidationError(null)
    if (sbd === submitted) reload()
    else setSubmitted(sbd)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    search(input.trim())
  }

  function useExample() {
    setInput(EXAMPLE_SBD)
    search(EXAMPLE_SBD)
  }

  return (
    <>
      <PageHeader
        title={t('search.title')}
        description={t('search.description')}
      />

      <section className="card">
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="sbd">{t('search.labelSbd')}</label>
          <div className="form-row">
            <div className="field">
              <SearchIcon />
              <input
                id="sbd"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={SBD_LENGTH}
                placeholder={t('search.placeholder')}
                value={input}
                aria-invalid={validationError ? true : undefined}
                aria-describedby={validationError ? 'sbd-error' : undefined}
                onChange={(e) => {
                  setInput(e.target.value.replace(/\D/g, ''))
                  setValidationError(null)
                }}
              />
            </div>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? t('search.buttonLoading') : t('search.buttonLookup')}
            </button>
          </div>
          {validationError ? (
            <p id="sbd-error" className="field-error" role="alert">
              {validationError}
            </p>
          ) : (
            <p className="hint">
              {t('search.hintNoNumber')}{' '}
              <button type="button" className="link-button" onClick={useExample}>
                {t('search.hintUse', { sbd: EXAMPLE_SBD })}
              </button>
            </p>
          )}
        </form>
      </section>

      {loading && (
        <section className="card">
          <StatusMessage loading loadingText={t('search.loadingScores')} />
          <Skeleton rows={9} height={34} />
        </section>
      )}

      {!loading && error && (
        <section className="card">
          <StatusMessage
            error={error.message}
            onRetry={error.status === 404 || error.status === 400 ? undefined : reload}
          />
        </section>
      )}

      {!loading && !error && !student && (
        <section className="empty">
          <p>{t('search.emptyState')}</p>
        </section>
      )}

      {!loading && !error && student && (
        <article className="card slip">
          <header className="slip-head">
            <div>
              <span className="label">{t('search.labelRegNumber')}</span>
              <strong className="sbd">{student.sbd}</strong>
            </div>
            {student.foreignLanguageCode && (
              <div className="slip-lang">
                <span className="label">{t('search.labelForeignCode')}</span>
                <span className="chip">{student.foreignLanguageCode}</span>
              </div>
            )}
          </header>

          <ul className="score-list">
            {SUBJECTS.map(({ key, label }) => (
              <ScoreRow key={key} label={label} score={student[key]} />
            ))}
          </ul>

          <p className="slip-note">{t('search.slipNote')}</p>
        </article>
      )}
    </>
  )
}
