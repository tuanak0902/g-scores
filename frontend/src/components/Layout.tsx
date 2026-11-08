import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Brand from './Brand'
import { ChartIcon, DashboardIcon, MenuIcon, SearchIcon } from './Icons'
import LangSwitcher from './LangSwitcher'

export default function Layout() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const MENU = [
    { to: '/', label: t('nav.dashboard'), end: true, icon: <DashboardIcon /> },
    { to: '/search', label: t('nav.search'), end: false, icon: <SearchIcon /> },
    { to: '/reports', label: t('nav.reports'), end: false, icon: <ChartIcon /> },
  ]

  return (
    <div className="shell">
      <header className="topbar">
        <button
          className="icon-button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="sidebar"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </button>
        <Brand />
      </header>

      <aside id="sidebar" className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <Brand />
        </div>

        <nav aria-label="Main menu">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <LangSwitcher />
          <p className="sidebar-note">{t('sidebarNote')}</p>
        </div>
      </aside>

      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      <main className="content">
        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
