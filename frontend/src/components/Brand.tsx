import { useTranslation } from 'react-i18next'

export default function Brand() {
  const { t } = useTranslation()
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">G</span>
      <span className="brand-name">{t('brand')}</span>
    </span>
  )
}
