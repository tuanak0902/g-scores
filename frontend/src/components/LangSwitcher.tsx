import { useTranslation } from 'react-i18next'
import i18n, { LANGUAGES, type LangCode } from '../i18n'

export default function LangSwitcher() {
  const { i18n: i18nHook } = useTranslation()
  const current = i18nHook.language as LangCode

  function switchTo(code: LangCode) {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    // Update the html[lang] attribute for accessibility
    document.documentElement.lang = code
  }

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`lang-btn${current === code ? ' lang-btn--active' : ''}`}
          aria-pressed={current === code}
          onClick={() => switchTo(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

