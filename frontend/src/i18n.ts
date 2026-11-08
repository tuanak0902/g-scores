import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import vi from './locales/vi'

export const LANGUAGES = [
  { code: 'en', label: 'ENG' },
  { code: 'vi', label: 'VN' },
] as const

export type LangCode = (typeof LANGUAGES)[number]['code']

const saved = localStorage.getItem('lang')
const defaultLang: LangCode =
  saved === 'vi' || saved === 'en' ? saved : 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    lng: defaultLang,
    fallbackLng: 'en',
    interpolation: {
      // React already escapes values
      escapeValue: false,
    },
  })

export default i18n

