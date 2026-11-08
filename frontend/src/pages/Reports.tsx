import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import type { SubjectDistribution } from '../api/types'
import PageHeader from '../components/PageHeader'
import Skeleton from '../components/Skeleton'
import StatusMessage from '../components/StatusMessage'
import { useFetch } from '../hooks/useFetch'
import { useLocale } from '../hooks/useLocale'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLevels } from '../levels'

const SUBJECT_KEY_BY_CODE: Record<string, string> = {
  toan: 'math',
  ngu_van: 'literature',
  ngoai_ngu: 'foreignLanguage',
  vat_li: 'physics',
  hoa_hoc: 'chemistry',
  sinh_hoc: 'biology',
  lich_su: 'history',
  dia_li: 'geography',
  gdcd: 'civicEducation',
}

const SUBJECT_KEY_BY_NAME: Record<string, string> = {
  Math: 'math',
  Literature: 'literature',
  'Foreign Language': 'foreignLanguage',
  Physics: 'physics',
  Chemistry: 'chemistry',
  Biology: 'biology',
  History: 'history',
  Geography: 'geography',
  'Civic Education': 'civicEducation',
}

export default function Reports() {
  const { t } = useTranslation()
  usePageTitle(t('reports.title'))

  const LEVELS = useLevels()
  const locale = useLocale()

  const compact = useMemo(
    () => new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }),
    [locale],
  )

  const { data, loading, error, reload } = useFetch<SubjectDistribution[]>('/api/reports/score-distribution')

  const chartData = useMemo(() => {
    if (!data) return []
    return data.map((row) => {
      const subjectKey = SUBJECT_KEY_BY_CODE[row.code] ?? SUBJECT_KEY_BY_NAME[row.name]
      const displayName = subjectKey ? t(`subjects.${subjectKey}`) : row.name

      return {
        ...row,
        displayName,
      }
    })
  }, [data, t])

  return (
    <>
      <PageHeader
        title={t('reports.title')}
        description={t('reports.description')}
      />

      <section className="card">
        <ul className="legend">
          {LEVELS.map((l) => (
            <li key={l.key}>
              <span className="swatch" style={{ background: l.color }} aria-hidden="true" />
              <strong>{l.name}</strong>
              <span className="muted">{l.range}</span>
            </li>
          ))}
        </ul>

        {loading && (
          <>
            <StatusMessage loading loadingText={t('reports.loading')} />
            <Skeleton height={380} />
          </>
        )}

        <StatusMessage error={!loading ? error?.message : null} onRetry={reload} />

        {chartData.length > 0 && !loading && (
          <>
            <p className="scroll-hint">{t('reports.scrollHint')}</p>
            <div className="chart-scroll">
              <div className="chart-inner">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: 0 }} barCategoryGap="22%">
                    <CartesianGrid stroke="#e6e9f3" vertical={false} />
                    <XAxis
                      dataKey="displayName"
                      tick={{ fontSize: 13, fill: '#3b4363' }}
                      tickLine={false}
                      axisLine={{ stroke: '#cfd5e8' }}
                      interval={0}
                      dy={6}
                    />
                    <YAxis
                      tickFormatter={(v: number) => compact.format(v)}
                      tick={{ fontSize: 12, fill: '#59627f' }}
                      tickLine={false}
                      axisLine={false}
                      width={52}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(31, 59, 179, 0.06)' }}
                      contentStyle={{
                        borderRadius: 10,
                        border: '1px solid #e1e5f0',
                        boxShadow: 'none',
                        fontSize: 13,
                      }}
                      formatter={(v) => Number(v).toLocaleString(locale)}
                    />
                    {LEVELS.map((level) => (
                      <Bar
                        key={level.key}
                        dataKey={level.key}
                        name={level.name}
                        fill={level.color}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={20}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </section>

      {chartData.length > 0 && !loading && (
        <details className="card details">
          <summary>{t('reports.viewNumbers')}</summary>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t('reports.colSubject')}</th>
                  {LEVELS.map((l) => (
                    <th key={l.key} className="num">
                      <span className="swatch" style={{ background: l.color }} aria-hidden="true" />
                      {l.name}
                    </th>
                  ))}
                  <th className="num">{t('reports.colStudents')}</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => (
                  <tr key={row.code}>
                    <td>{row.displayName}</td>
                    {LEVELS.map((l) => (
                      <td key={l.key} className="num">
                        {row[l.key].toLocaleString(locale)}
                      </td>
                    ))}
                    <td className="num strong">
                      {(row.excellent + row.good + row.average + row.poor).toLocaleString(locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </>
  )
}
