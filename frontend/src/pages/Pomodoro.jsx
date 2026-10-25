import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Pomodoro() {
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [seconds, setSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus')
  const [sessions, setSessions] = useState(0)
  const navigate = useNavigate()
  const userName = localStorage.getItem('user_name') || 'Student'

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) navigate('/')
  }, [navigate])

  useEffect(() => {
    let interval = null
    if (isRunning && seconds > 0) {
      interval = setInterval(() => setSeconds(prev => prev - 1), 1000)
    } else if (seconds === 0) {
      setIsRunning(false)
      if (mode === 'focus') {
        setSessions(s => s + 1)
        setMode('break')
        setSeconds(breakTime * 60)
        alert('🎉 Focus session done! Take a break.')
      } else {
        setMode('focus')
        setSeconds(focusTime * 60)
        alert('☕ Break over! Back to focus.')
      }
    }
    return () => clearInterval(interval)
  }, [isRunning, seconds, mode, focusTime, breakTime])

  const formatTime = (total) => {
    const min = Math.floor(total / 60)
    const sec = total % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setSeconds(mode === 'focus' ? focusTime * 60 : breakTime * 60)
  }

  const switchToFocus = () => {
    setIsRunning(false)
    setMode('focus')
    setSeconds(focusTime * 60)
  }

  const switchToBreak = () => {
    setIsRunning(false)
    setMode('break')
    setSeconds(breakTime * 60)
  }

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_name')
    navigate('/')
  }

  const progressPercent = mode === 'focus'
    ? ((focusTime * 60 - seconds) / (focusTime * 60)) * 100
    : ((breakTime * 60 - seconds) / (breakTime * 60)) * 100

  return (
    <div className="min-h-screen bg-[#060b19] text-[#f0f5ff] font-inter relative overflow-hidden">
      {/* ===== Background Gradients ===== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#263c75]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#502080]/15 blur-3xl" />
      </div>

      {/* ===== TOP BAR ===== */}
      <header className="relative z-10 flex h-[78px] items-center gap-4 border-b border-[#20365e] bg-[#080f22]/95 px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="grid h-[42px] w-[42px] place-items-center rounded-[13px] bg-gradient-to-br from-[#167fff] to-[#783fff] text-2xl shadow-[0_0_30px_#367aff80,0_0_60px_#367aff40]">
            📚
          </div>
          <h1 className="text-[25px] font-extrabold tracking-tight">
            Study<span className="text-[#65a1ff]">Flow</span>
          </h1>
        </div>

        <div className="flex-1" />

        <button className="grid h-[43px] w-[43px] place-items-center rounded-[13px] border border-[#20365e] bg-[#0d1730] text-lg text-white transition hover:border-[#347cff] hover:shadow-[0_0_20px_#347cff60]">
          ♧
        </button>

        <div className="flex items-center gap-2 rounded-full border border-[#20365e] bg-[#0d1730] py-[7px] pl-[7px] pr-[14px] transition hover:border-[#347cff] hover:shadow-[0_0_20px_#347cff40]">
          <div className="grid h-[34px] w-[34px] place-items-center rounded-full bg-gradient-to-br from-[#a34cff] to-[#356fff] shadow-[0_0_15px_#a34cff60]">
            👤
          </div>
          <span className="text-sm font-medium">{userName}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-[13px] border border-[#5b1f3a] bg-[#2a0f22] px-4 py-2 text-sm font-medium text-[#ff8aa8] transition hover:border-[#a33e65] hover:bg-[#3b1930] hover:shadow-[0_0_20px_#ff668540]"
        >
          🚪 Logout
        </button>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-78px)]">
        {/* ===== SIDEBAR ===== */}
        <aside className="hidden w-[258px] flex-col border-r border-[#20365e] bg-gradient-to-b from-[#080f22] to-[#09132a] p-6 lg:flex">
          <nav className="grid gap-2">
            {[
              { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
              { icon: '🔍', label: 'Search', path: '/search' },
              { icon: '🗓️', label: 'Schedule', path: '/schedule' },
              { icon: '✅', label: 'Tasks', path: '/tasks' },
              { icon: '⏱️', label: 'Pomodoro', path: '/pomodoro', active: true },
              { icon: '📊', label: 'Progress', path: '/progress' },
              { icon: '📚', label: 'Subjects', path: '/subjects' },
              { icon: '🎓', label: 'Chapters', path: '/chapters' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`flex min-h-[53px] items-center gap-4 rounded-[13px] border px-[17px] text-sm font-medium transition ${
                  item.active
                    ? 'border-transparent bg-gradient-to-r from-[#277cff] to-[#4938e9] font-bold text-white shadow-[0_0_20px_#277cff80,0_7px_23px_#245eff35]'
                    : 'border-transparent text-[#a9bbdb] hover:border-[#243d67] hover:bg-[#132344] hover:text-white hover:shadow-[0_0_15px_#277cff40]'
                }`}
              >
                <span className="w-[25px] text-center text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-[18px] border border-[#24457a] bg-gradient-to-br from-[#10234a] to-[#171b43] p-[18px] shadow-[0_0_25px_#277cff20]">
            <div className="mb-2 text-[29px]">🌱 ✨</div>
            <strong className="block text-[15px] font-bold leading-relaxed">
              Small steps.<br />Big dreams.
            </strong>
            <p className="mt-2 text-[11px] leading-relaxed text-[#92a6c8]">
              Stay consistent, keep going!
            </p>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="min-w-0 flex-1 p-8">
          {/* Page Heading */}
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-[55px] w-[55px] place-items-center rounded-[17px] border border-[#3858a1] bg-gradient-to-br from-[#163d78] to-[#25205b] text-[27px] shadow-[0_0_25px_#315aff60,0_0_50px_#315aff30]">
              ⏱️
            </div>
            <div>
              <h1 className="text-[31px] font-extrabold tracking-tight">
                Pomodoro <span className="text-[#75a8ff]">Timer</span>
              </h1>
              <p className="mt-1 text-[13px] text-[#92a6c8]">
                Stay focused with the Pomodoro technique
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-2xl">
            {/* Mode Tabs */}
            <div className="mb-6 flex gap-3">
              <button
                onClick={switchToFocus}
                className={`flex-1 rounded-xl py-4 text-sm font-bold transition ${
                  mode === 'focus'
                    ? 'bg-gradient-to-r from-[#347cff] to-[#9655ff] text-white shadow-[0_0_25px_#346bff80,0_0_50px_#346bff40]'
                    : 'border border-[#2b4268] bg-[#0d1730] text-[#a9bbdb] hover:border-[#5788ed] hover:text-white hover:shadow-[0_0_20px_#346bff40]'
                }`}
              >
                🎯 Focus ({focusTime} min)
              </button>
              <button
                onClick={switchToBreak}
                className={`flex-1 rounded-xl py-4 text-sm font-bold transition ${
                  mode === 'break'
                    ? 'bg-gradient-to-r from-[#39e6ae] to-[#0fcba1] text-[#06271e] shadow-[0_0_25px_#39e6ae80,0_0_50px_#39e6ae40]'
                    : 'border border-[#2b4268] bg-[#0d1730] text-[#a9bbdb] hover:border-[#5788ed] hover:text-white hover:shadow-[0_0_20px_#39e6ae40]'
                }`}
              >
                ☕ Break ({breakTime} min)
              </button>
            </div>

            {/* Timer Card */}
            <div className="relative overflow-hidden rounded-[19px] border border-[#243b62] bg-gradient-to-br from-[#0d1830] to-[#0b1428] p-8 shadow-[0_0_40px_#347cff20,0_9px_30px_#00000013]">
              {/* Decorative side art */}
              <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 rotate-[-10deg] text-center text-[13px] italic text-[#5b6b9a] md:block">
                Better Focus<br />Bigger Goals
              </div>
              <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 text-[60px] opacity-30 md:block">
                ☕📚
              </div>

              <div className="relative mx-auto mb-8 h-64 w-64">
                <svg className="h-64 w-64 -rotate-90 transform">
                  <circle cx="128" cy="128" r="112" stroke="#1a2c4e" strokeWidth="16" fill="none" />
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke={mode === 'focus' ? 'url(#focusGradient)' : 'url(#breakGradient)'}
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(progressPercent / 100) * 703.72} 703.72`}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dasharray 0.5s',
                      filter: mode === 'focus'
                        ? 'drop-shadow(0 0 8px #347cff) drop-shadow(0 0 16px #347cff80)'
                        : 'drop-shadow(0 0 8px #39e6ae) drop-shadow(0 0 16px #39e6ae80)'
                    }}
                  />
                  <defs>
                    <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#347cff" />
                      <stop offset="100%" stopColor="#9655ff" />
                    </linearGradient>
                    <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#39e6ae" />
                      <stop offset="100%" stopColor="#0fcba1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-6xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(52,124,255,0.6)]">
                    {formatTime(seconds)}
                  </p>
                  <p className="mt-2 text-sm text-[#92a6c8]">
                    {mode === 'focus' ? 'Focus Time' : 'Break Time'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-3">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    className="rounded-xl bg-gradient-to-r from-[#347cff] to-[#9655ff] px-8 py-3 font-semibold text-white shadow-[0_0_25px_#346bff80,0_0_50px_#346bff40] transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_35px_#346bff,0_0_70px_#346bff60]"
                  >
                    ▶ Start
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="rounded-xl bg-gradient-to-r from-[#ffc857] to-[#ff9f43] px-8 py-3 font-semibold text-[#2a1a00] shadow-[0_0_25px_#ffc85780,0_0_50px_#ffc85740] transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_35px_#ffc857,0_0_70px_#ffc85760]"
                  >
                    ⏸ Pause
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-[#2b4268] bg-[#0d1730] px-8 py-3 font-semibold text-[#a9bbdb] transition hover:border-[#5788ed] hover:text-white hover:shadow-[0_0_20px_#347cff60]"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Session Counter */}
            <div className="mt-6 flex items-center gap-4 rounded-[19px] border border-[#243b62] bg-gradient-to-br from-[#0d1830] to-[#0b1428] p-6 shadow-[0_0_30px_#0fcba115,0_9px_30px_#00000013]">
              <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[12px] bg-gradient-to-br from-[#0fcba1] to-[#0d9a83] text-xl shadow-[0_0_20px_#0fcba180,0_0_40px_#0fcba140]">
                ✓
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Completed Focus Sessions</p>
                <p className="mt-1 text-[11px] text-[#92a6c8]">
                  Track your progress and stay motivated
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#2b4268] bg-[#0d1730] px-4 py-2 text-xs font-semibold text-[#a9bbdb] shadow-[0_0_15px_#347cff20]">
                📊 {sessions} sessions
              </div>
            </div>

            {/* Settings */}
            <div className="mt-6 rounded-[19px] border border-[#243b62] bg-gradient-to-br from-[#0d1830] to-[#0b1428] p-6 shadow-[0_0_30px_#347cff15,0_9px_30px_#00000013]">
              <h2 className="mb-4 text-base font-bold text-white">⚙️ Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#c5d6f3]">
                    Focus (min)
                  </label>
                  <input
                    type="number"
                    value={focusTime}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 1
                      setFocusTime(v)
                      if (mode === 'focus') setSeconds(v * 60)
                    }}
                    className="h-[49px] w-full rounded-xl border border-[#2b4268] bg-[#080f22] px-4 text-sm text-white outline-none transition focus:border-[#4388ff] focus:shadow-[0_0_0_3px_#347cff40,0_0_20px_#347cff30]"
                    min="1"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#c5d6f3]">
                    Break (min)
                  </label>
                  <input
                    type="number"
                    value={breakTime}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 1
                      setBreakTime(v)
                      if (mode === 'break') setSeconds(v * 60)
                    }}
                    className="h-[49px] w-full rounded-xl border border-[#2b4268] bg-[#080f22] px-4 text-sm text-white outline-none transition focus:border-[#4388ff] focus:shadow-[0_0_0_3px_#347cff40,0_0_20px_#347cff30]"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Pomodoro