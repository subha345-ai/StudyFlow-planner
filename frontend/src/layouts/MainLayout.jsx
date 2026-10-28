import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const navigationItems = [
  { icon: '⌂', label: 'Dashboard', path: '/dashboard' },
  { icon: '⌕', label: 'Search', path: '/search' },
  { icon: '▦', label: 'Schedule', path: '/schedule' },
  { icon: '☑', label: 'Tasks', path: '/tasks' },
  { icon: '◴', label: 'Pomodoro', path: '/pomodoro' },
  { icon: '▥', label: 'Progress', path: '/progress' },
  { icon: '♧', label: 'Subjects', path: '/subjects' },
  { icon: '🎓', label: 'Chapters', path: '/chapters' },
]

function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [lightMode, setLightMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userName, setUserName] = useState(() => localStorage.getItem('user_name') || 'Student')
  const [editName, setEditName] = useState(userName)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showNotifModal, setShowNotifModal] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_name')
    navigate('/')
  }

  const handleSaveProfile = () => {
    const name = editName.trim()
    if (!name) return
    setUserName(name)
    localStorage.setItem('user_name', name)
    setShowProfileModal(false)
  }

  const renderNavigation = (mobile = false) => navigationItems.map(item => {
    const isActive = location.pathname === item.path ||
      (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`)) ||
      (item.path === '/chapters' && location.pathname.startsWith('/chapter/')) ||
      (item.path === '/tasks' && location.pathname.startsWith('/task/'))

    return (
      <Link
        key={item.path}
        to={item.path}
        aria-current={isActive ? 'page' : undefined}
        className={`${mobile
          ? 'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs'
          : 'shine-button relative flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm'
        } font-medium transition-all duration-200 ${
          isActive
            ? 'nav-active bg-gradient-to-r from-cyan-500/20 via-blue-600/90 to-purple-700 text-white shadow-lg shadow-purple-600/25 ring-1 ring-cyan-300/30'
            : lightMode
              ? 'text-[#263a6b] hover:bg-purple-500/15'
              : 'text-[#d5e0ff] hover:bg-white/[0.07] hover:text-cyan-200'
        }`}
      >
        <span className={`${mobile ? '' : 'w-6 text-center text-lg'}`}>{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    )
  })

  return (
    <div className={`dashboard-shell relative isolate min-h-screen w-full overflow-x-hidden font-inter transition-colors duration-300 ${lightMode ? 'bg-[#e9efff] text-[#17264b]' : 'water-flow-enabled bg-[#03091f] text-white'}`}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        {!lightMode && (
          <>
            <div className="aurora-orb aurora-one" />
            <div className="aurora-orb aurora-two" />
            <div className="aurora-orb aurora-three" />
          </>
        )}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col p-2 sm:p-4">
        <div className={`flex min-h-[calc(100vh-1rem)] flex-1 flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl sm:min-h-[calc(100vh-2rem)] sm:rounded-3xl ${lightMode ? 'border-purple-300/50 bg-white/85' : 'border-white/10 bg-[#030a20]/75 shadow-purple-950/40'}`}>
          <header className={`flex min-h-16 shrink-0 items-center gap-2 border-b bg-gradient-to-r px-3 backdrop-blur-2xl transition-colors duration-300 sm:min-h-20 sm:gap-4 sm:px-6 ${lightMode ? 'border-purple-300/40 from-[#f8faff]/95 to-[#eeeaff]/90' : 'border-white/10 from-[#050d2b]/80 to-[#1a0b4e]/80'}`}>
            <Link to="/dashboard" className="flex shrink-0 items-center gap-2 sm:gap-3" aria-label="StudyFlow dashboard">
              <span className="text-2xl drop-shadow-[0_0_12px_rgba(6,182,212,0.55)] sm:text-3xl">🎓</span>
              <span className={`hidden text-lg font-bold tracking-tight sm:block sm:text-xl ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>
                Study<span className="text-purple-400">flow</span>
              </span>
            </Link>

            <div className="topbar-search mr-auto sm:ml-6">
              <div aria-hidden="true" className="darkBorderBg" />
              <div aria-hidden="true" className="glow" />
              <div aria-hidden="true" className="border" />
              <div className="input-mask">
                <label htmlFor="topbar-search" className="search-icon" aria-label="Focus search">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
                    <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </label>
              <input
                id="topbar-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search dashboard tasks"
                className="cyber-search-input"
              />
                <button type="button" className="filter-icon" aria-label="Search filters">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 5h16l-6.2 7.1v5.1l-3.6 1.8v-6.9L4 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNotifModal(true)}
              aria-label="Open notifications"
              className={`notification-neon-button shine-button relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 sm:h-11 sm:w-11 ${lightMode ? 'opacity-90' : ''}`}
            >
              <span aria-hidden="true" className="notification-neon-orb">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 sm:h-8 sm:w-8">
                  <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="notification-neon-count">1</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setLightMode(mode => !mode)}
              aria-label={`Switch to ${lightMode ? 'dark' : 'light'} theme`}
              className={`shine-button relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-gradient-to-br text-lg shadow-inner transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 sm:h-11 sm:w-11 ${lightMode ? 'border-amber-300/70 from-amber-100 to-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]' : 'border-cyan-300/30 from-cyan-400/30 to-amber-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:border-cyan-200/70 hover:shadow-[0_0_22px_rgba(234,179,8,0.65)]'}`}
            >
              {lightMode ? '☀️' : '🌙'}
            </button>

            <button
              type="button"
              onClick={() => { setEditName(userName); setShowProfileModal(true) }}
              className={`shine-button relative flex h-10 items-center gap-2 rounded-full border bg-gradient-to-br px-2.5 text-sm font-semibold shadow-inner transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 sm:h-11 sm:px-3 ${lightMode ? 'border-purple-300/70 from-white to-purple-100 text-[#17264b] shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'border-purple-300/30 from-purple-500/30 to-indigo-900/80 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:border-purple-300/70 hover:shadow-[0_0_22px_rgba(168,85,247,0.75)]'}`}
            >
              <span className="text-lg">👤</span>
              <span className="hidden max-w-28 truncate sm:inline">{userName}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="logout-neon-button shine-button relative h-10 w-10 shrink-0 rounded-full p-[2px] text-white transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 sm:h-11 sm:w-[9.5rem] sm:rounded-full"
            >
              <span className="logout-neon-surface flex h-full w-full items-center justify-center gap-3 rounded-full px-0 sm:justify-start sm:px-2">
                <span className="logout-neon-orbit relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9">
                  <span className="logout-neon-icon flex h-full w-full items-center justify-center rounded-full">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6">
                      <path d="M13 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M10 12h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
                <span className="hidden flex-1 text-left text-base font-bold tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.45)] sm:inline">
                  Logout
                </span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="hidden h-5 w-5 shrink-0 text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.9)] sm:block">
                  <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <aside className={`hidden w-60 shrink-0 flex-col border-r p-6 backdrop-blur-2xl lg:flex ${lightMode ? 'border-purple-300/50 bg-gradient-to-b from-[#e4eaff]/95 to-[#f5f0ff]/90' : 'border-white/10 bg-gradient-to-b from-[#07132f]/90 via-[#020a22]/85 to-[#251078]/80'}`}>
              <div className="mb-8 flex items-center gap-3 px-2">
                <div>
                  <h2 className={`text-xl font-bold tracking-tight ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>
                    Study<span className="text-purple-400">flow</span>
                  </h2>
                  <p className={`text-[10px] ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>Learn · Plan · Grow</p>
                </div>
              </div>
              <nav className="flex-1 space-y-2">{renderNavigation()}</nav>
              <div className="mt-6 px-4">
                <div className="mb-3 text-2xl text-cyan-300">🌱</div>
                <p className={`text-xs leading-relaxed ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                  Small steps<br />make big progress.
                </p>
                <p className="mt-3 text-xs tracking-widest text-purple-400">〰〰〰</p>
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <nav aria-label="Main navigation" className="flex gap-2 overflow-x-auto border-b border-white/10 p-3 lg:hidden">
                {renderNavigation(true)}
              </nav>
              <div className="min-w-0">
                <Outlet context={{ lightMode, searchQuery, userName, setUserName }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl ${lightMode ? 'border-purple-300/50 bg-white/95' : 'border-white/10 bg-[#0b1738]/95'}`}>
            <h2 className={`mb-4 text-xl font-bold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>Edit profile</h2>
            <label htmlFor="layout-display-name" className={`mb-1 block text-xs ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>Display name</label>
            <input
              id="layout-display-name"
              value={editName}
              onChange={event => setEditName(event.target.value)}
              maxLength={35}
              className={`mb-5 w-full rounded-xl border border-purple-500/30 px-4 py-3 text-sm outline-none ${lightMode ? 'bg-[#f0f4ff] text-[#17264b]' : 'bg-[#101e49] text-white'}`}
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowProfileModal(false)} className={`flex-1 rounded-xl border border-purple-500/40 py-3 text-sm font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>Cancel</button>
              <button type="button" onClick={handleSaveProfile} className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {showNotifModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl ${lightMode ? 'border-purple-300/50 bg-white/95' : 'border-white/10 bg-[#0b1738]/95'}`}>
            <h2 className={`mb-4 text-xl font-bold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>Notifications</h2>
            <p className={`mb-5 text-sm ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>You're all caught up! 🎯</p>
            <button type="button" onClick={() => setShowNotifModal(false)} className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg">Got it</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainLayout
