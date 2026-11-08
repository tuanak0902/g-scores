import { useTranslation } from 'react-i18next'
import type { TopStudent } from '../api/types'
import PageHeader from '../components/PageHeader'
import Skeleton from '../components/Skeleton'
import StatusMessage from '../components/StatusMessage'
import { useFetch } from '../hooks/useFetch'
import { formatScore, useLocale } from '../hooks/useLocale'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Dashboard() {
  const { t } = useTranslation()
  usePageTitle(t('dashboard.title'))
  const locale = useLocale()

  const { data, loading, error, reload } = useFetch<TopStudent[]>('/api/reports/top-students')

  return (
    <>
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.description')}
      />

      <section className="card table-card">
        {loading && (
          <>
            <StatusMessage loading loadingText={t('dashboard.loading')} />
            <Skeleton rows={10} height={40} />
          </>
        )}

        <StatusMessage error={!loading ? error?.message : null} onRetry={reload} />

        {data && !loading && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="rank-col">{t('dashboard.colRank')}</th>
                  <th>{t('dashboard.colSbd')}</th>
                  <th className="num">{t('dashboard.colMath')}</th>
                  <th className="num">{t('dashboard.colPhysics')}</th>
                  <th className="num">{t('dashboard.colChemistry')}</th>
                  <th className="num">{t('dashboard.colTotal')}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((s, i) => (
                  <tr key={s.sbd}>
                    <td className="rank-col">
                      <span className={`rank${i === 0 ? ' first' : ''}`}>{i + 1}</span>
                    </td>
                    <td className="sbd-cell">{s.sbd}</td>
                    <td className="num">{formatScore(s.math, locale)}</td>
                    <td className="num">{formatScore(s.physics, locale)}</td>
                    <td className="num">{formatScore(s.chemistry, locale)}</td>
                    <td className="num total">{formatScore(s.total, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
