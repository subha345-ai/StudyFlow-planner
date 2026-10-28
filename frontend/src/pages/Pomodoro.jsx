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

  const progressPercent = mode === 'focus'
    ? ((focusTime * 60 - seconds) / (focusTime * 60)) * 100
    : ((breakTime * 60 - seconds) / (breakTime * 60)) * 100

  return (
    <div className="dashboard-shell water-flow-enabled relative isolate min-h-screen bg-transparent font-inter text-[#f0f5ff]">
      {/* ===== Background Gradients ===== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-orb aurora-one" />
        <div className="aurora-orb aurora-two" />
      </div>

      <main className="relative z-10 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Page Heading */}
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-[55px] w-[55px] place-items-center rounded-[17px] border border-[#3858a1] bg-gradient-to-br from-[#163d78] to-[#25205b] text-[27px] shadow-[0_0_25px_#315aff60,0_0_50px_#315aff30]">
              ⏱️
            </div>
            <div>
              <h1 className="text-[31px] font-extrabold tracking-tight">
                Pomodoro <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">Timer</span>
              </h1>
              <p className="mt-1 text-[13px] text-[#92a6c8]">
                Stay focused with the Pomodoro technique
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-2xl">
            {/* Mode Tabs */}
            <div className="dashboard-reveal mb-6 flex gap-3">
              <button
                onClick={switchToFocus}
                className={`shine-button relative flex-1 rounded-xl py-4 text-sm font-bold transition hover:scale-[1.02] ${
                  mode === 'focus'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_25px_#346bff80,0_0_50px_#346bff40]'
                    : 'border border-[#2b4268] bg-[#0d1730] text-[#a9bbdb] hover:border-[#5788ed] hover:text-white hover:shadow-[0_0_20px_#346bff40]'
                }`}
              >
                🎯 Focus ({focusTime} min)
              </button>
              <button
                onClick={switchToBreak}
                className={`shine-button relative flex-1 rounded-xl py-4 text-sm font-bold transition hover:scale-[1.02] ${
                  mode === 'break'
                    ? 'bg-gradient-to-r from-[#39e6ae] to-[#0fcba1] text-[#06271e] shadow-[0_0_25px_#39e6ae80,0_0_50px_#39e6ae40]'
                    : 'border border-[#2b4268] bg-[#0d1730] text-[#a9bbdb] hover:border-[#5788ed] hover:text-white hover:shadow-[0_0_20px_#39e6ae40]'
                }`}
              >
                ☕ Break ({breakTime} min)
              </button>
            </div>

            {/* Timer Card */}
            <div className="interactive-card relative overflow-hidden rounded-[19px] border border-[#243b62] bg-gradient-to-br from-[#0d1830]/90 to-[#0b1428]/90 p-8 shadow-[0_0_40px_#347cff20,0_9px_30px_#00000013] backdrop-blur-xl">
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
                    className="shine-button relative rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 font-semibold text-white shadow-[0_0_25px_#346bff80,0_0_50px_#346bff40] transition hover:-translate-y-0.5 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_35px_#346bff,0_0_70px_#346bff60]"
                  >
                    ▶ Start
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="shine-button relative rounded-xl bg-gradient-to-r from-[#ffc857] to-[#ff9f43] px-8 py-3 font-semibold text-[#2a1a00] shadow-[0_0_25px_#ffc85780,0_0_50px_#ffc85740] transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_35px_#ffc857,0_0_70px_#ffc85760]"
                  >
                    ⏸ Pause
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="shine-button relative rounded-xl border border-[#2b4268] bg-[#0d1730] px-8 py-3 font-semibold text-[#a9bbdb] transition hover:border-[#5788ed] hover:text-white hover:shadow-[0_0_20px_#347cff60]"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Session Counter */}
            <div className="interactive-card mt-6 flex items-center gap-4 rounded-[19px] border border-[#243b62] bg-gradient-to-br from-[#0d1830]/90 to-[#0b1428]/90 p-6 shadow-[0_0_30px_#0fcba115,0_9px_30px_#00000013] backdrop-blur-xl">
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
            <div className="interactive-card mt-6 rounded-[19px] border border-[#243b62] bg-gradient-to-br from-[#0d1830]/90 to-[#0b1428]/90 p-6 shadow-[0_0_30px_#347cff15,0_9px_30px_#00000013] backdrop-blur-xl">
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
  )
}

export default Pomodoro