import { useTranslation } from 'react-i18next'

export function useLocale(): string {
  const { i18n } = useTranslation()
  return i18n.language === 'vi' ? 'vi-VN' : 'en-US'
}

export function formatScore(score: number, locale: string): string {
  return score.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

