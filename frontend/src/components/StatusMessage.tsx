import { useTranslation } from 'react-i18next'

interface Props {
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  loadingText?: string
}

/** Shared loading / error line used by every page. Renders nothing when idle. */
export default function StatusMessage({ loading, error, onRetry, loadingText = 'Loading...' }: Props) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <p className="status" role="status">
        {loadingText}
      </p>
    )
  }
  if (error) {
    return (
      <div className="status error" role="alert">
        <span>{error}</span>
        {onRetry && (
          <button className="link-button" onClick={onRetry}>
            {t('shared.tryAgain')}
          </button>
        )}
      </div>
    )
  }
  return null
}
