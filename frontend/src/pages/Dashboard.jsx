import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

// ═══ Pomodoro Helpers ═══
const POMODORO_KEY = 'pomodoro_state'

const loadPomodoro = () => {
  try {
    const raw = localStorage.getItem(POMODORO_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const savePomodoro = (state) => {
  try {
    localStorage.setItem(POMODORO_KEY, JSON.stringify(state))
  } catch {}
}

function Dashboard() {
  const [userName, setUserName] = useState('Student')
  const [tasks, setTasks] = useState([])
  const [progress, setProgress] = useState(0)
  const [lightMode, setLightMode] = useState(false)
  const [timer, setTimer] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showNotifModal, setShowNotifModal] = useState(false)
  const [showTimerSettings, setShowTimerSettings] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskSubject, setNewTaskSubject] = useState('Programming')
  const [editName, setEditName] = useState('')
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState('')

  const navigate = useNavigate()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good Morning'
    if (hour >= 12 && hour < 17) return 'Good Afternoon'
    if (hour >= 17 && hour < 21) return 'Good Evening'
    return 'Good Night'
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // ═══ Load user + tasks ═══
  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    const name = localStorage.getItem('user_name')

    if (!userId) {
      navigate('/')
      return
    }

    if (name) {
      setUserName(name)
      setEditName(name)
    }

    API.get(`/api/tasks?user_id=${userId}`)
      .then(res => setTasks(res.data.tasks || []))
      .catch(err => console.error(err))

    API.get(`/api/progress?user_id=${userId}`)
      .then(res => setProgress(res.data.progress_percent || 0))
      .catch(err => console.error(err))
  }, [navigate])

  // ═══ Load Pomodoro state from localStorage ═══
  useEffect(() => {
    const saved = loadPomodoro()
    if (saved) {
      setTimer(saved.timer ?? 25 * 60)
      setIsRunning(saved.isRunning ?? false)
      setTimerMinutes(saved.timerMinutes ?? 25)
      setTotalSeconds(saved.totalSeconds ?? 0)

      // ═══ If was running, calculate elapsed time since save ═══
      if (saved.isRunning && saved.savedAt) {
        const elapsed = Math.floor((Date.now() - saved.savedAt) / 1000)
        const newTimer = Math.max(0, (saved.timer ?? 25 * 60) - elapsed)
        setTimer(newTimer)
        if (newTimer <= 0) setIsRunning(false)
      }
    }
  }, [])

  // ═══ Timer tick + save to localStorage ═══
  useEffect(() => {
    let interval = null

    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => {
          const next = t - 1
          // Save state every tick
          savePomodoro({
            timer: next,
            isRunning: true,
            timerMinutes,
            totalSeconds: totalSeconds + 1,
            savedAt: Date.now(),
          })
          return next
        })
        setTotalSeconds(s => s + 1)
      }, 1000)
    } else if (timer === 0 && isRunning) {
      setIsRunning(false)
      showToast('🎉 Pomodoro completed! Take a break.')
      const next = 5 * 60
      setTimer(next)
      savePomodoro({
        timer: next,
        isRunning: false,
        timerMinutes: 5,
        totalSeconds,
        savedAt: Date.now(),
      })
    } else {
      // Not running — save current state
      savePomodoro({
        timer,
        isRunning: false,
        timerMinutes,
        totalSeconds,
        savedAt: Date.now(),
      })
    }

    return () => clearInterval(interval)
  }, [isRunning, timer, timerMinutes, totalSeconds])

  const handleStartTimer = () => {
    const next = !isRunning
    setIsRunning(next)
    savePomodoro({
      timer,
      isRunning: next,
      timerMinutes,
      totalSeconds,
      savedAt: Date.now(),
    })
  }

  const handleResetTimer = () => {
    setIsRunning(false)
    const next = timerMinutes * 60
    setTimer(next)
    savePomodoro({
      timer: next,
      isRunning: false,
      timerMinutes,
      totalSeconds,
      savedAt: Date.now(),
    })
    showToast('Timer reset.')
  }

  const handleSaveTimerSettings = () => {
    const val = parseInt(timerMinutes) || 25
    if (val < 1 || val > 120) {
      showToast('Enter a value between 1 and 120.')
      return
    }
    setTimer(val * 60)
    setIsRunning(false)
    setShowTimerSettings(false)
    savePomodoro({
      timer: val * 60,
      isRunning: false,
      timerMinutes: val,
      totalSeconds,
      savedAt: Date.now(),
    })
    showToast('Timer duration updated.')
  }

  const formatTimer = (total) => {
    const min = Math.floor(total / 60)
    const sec = total % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handleAddTask = async () => {
    if (!newTaskName.trim()) return
    const userId = localStorage.getItem('user_id')

    try {
      await API.post('/api/tasks', {
        user_id: userId,
        subject: newTaskSubject,
        target: newTaskName.trim(),
        difficulty: 'medium',
      })
      setNewTaskName('')
      setShowTaskModal(false)
      showToast('Task added successfully!')

      API.get(`/api/tasks?user_id=${userId}`)
        .then(res => setTasks(res.data.tasks || []))
      API.get(`/api/progress?user_id=${userId}`)
        .then(res => setProgress(res.data.progress_percent || 0))
    } catch (err) {
      showToast('Failed to add task.')
    }
  }

  const handleSaveProfile = () => {
    if (!editName.trim()) return
    setUserName(editName.trim())
    localStorage.setItem('user_name', editName.trim())
    setShowProfileModal(false)
    showToast('Profile updated.')
  }

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_name')
    // Keep pomodoro running after logout
    navigate('/')
  }

  const completedCount = tasks.filter(t => t.completed).length
  const studyHours = (3.5 + totalSeconds / 3600).toFixed(1)

  const filteredTasks = searchQuery
    ? tasks.filter(t =>
        t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.target?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks

  const uniqueSubjects = [...new Set(tasks.map(t => t.subject))].slice(0, 3)
  const subjectColors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500']

  return (
    <div className={`relative min-h-screen w-full font-inter ${lightMode ? 'bg-[#e9efff]' : 'bg-[#03091f]'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .anim-float { animation: float 5s ease-in-out infinite; }
        .timer-running {
          animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {!lightMode && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-700/40 blur-[130px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-800/40 blur-[130px]" />
        </>
      )}

      {/* ⭐ FLOATING TIMER — top right corner (visible everywhere on dashboard) */}
      {isRunning && (
        <div className="fixed right-6 top-24 z-50 animate-pulse">
          <div className={`flex items-center gap-3 rounded-2xl border-2 border-blue-500 px-5 py-3 shadow-2xl backdrop-blur-xl ${
            lightMode ? 'bg-white/95' : 'bg-[#0a1538]/95'
          }`}>
            <span className="text-2xl">⏱️</span>
            <div>
              <p className={`font-mono text-xl font-bold ${lightMode ? 'text-blue-600' : 'text-blue-400'}`}>
                {formatTimer(timer)}
              </p>
              <p className={`text-[10px] ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                Focus Session
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-[1500px] p-4">
        <div className={`flex min-h-[calc(100vh-2rem)] overflow-hidden rounded-3xl border border-purple-500/20 shadow-2xl ${lightMode ? 'bg-white' : 'bg-[#030a20]/95'}`}>
          <div className="flex w-full flex-col lg:flex-row">

            {/* SIDEBAR */}
            <aside className={`relative hidden w-60 shrink-0 flex-col overflow-hidden border-r border-purple-500/20 p-6 lg:flex ${lightMode ? 'bg-gradient-to-b from-[#e4eaff] to-[#f5f0ff]' : 'bg-gradient-to-b from-[#07132f] via-[#020a22] to-[#251078]'}`}>
              <div className="relative z-10 mb-8 flex items-center gap-3 px-2">
                <div className="text-3xl drop-shadow-[0_0_10px_rgba(37,123,255,0.8)]">🎓</div>
                <div>
                  <h2 className={`text-xl font-bold tracking-tight ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>
                    Study<span className="text-purple-400">flow</span>
                  </h2>
                  <p className={`text-[10px] ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>Learn · Plan · Grow</p>
                </div>
              </div>

              <nav className="relative z-10 flex-1 space-y-2">
                {[
                  { icon: '⌂', label: 'Dashboard', path: '/dashboard', active: true },
                  { icon: '▦', label: 'Schedule', path: '/schedule' },
                  { icon: '◴', label: 'Pomodoro', path: '/pomodoro' },
                  { icon: '☑', label: 'Tasks', path: '/tasks' },
                  { icon: '♧', label: 'Subjects', path: '/subjects' },
                  { icon: '🎓', label: 'Chapters', path: '/chapters' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(item.path)}
                    className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                      item.active
                        ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400/40'
                        : lightMode
                          ? 'text-[#263a6b] hover:bg-purple-500/20'
                          : 'text-[#d5e0ff] hover:bg-purple-500/20'
                    }`}
                  >
                    <span className="w-6 text-center text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="relative z-10 mt-6 px-4">
                <div className="mb-3 text-2xl text-cyan-300">🌱</div>
                <p className={`text-xs leading-relaxed ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                  Small steps
                  <br />
                  make big progress.
                </p>
                <p className="mt-3 text-xs tracking-widest text-purple-400">〰〰〰</p>
              </div>
            </aside>

            {/* MAIN */}
            <main className="flex min-w-0 flex-1 flex-col">
              <header className={`flex h-20 shrink-0 items-center gap-4 border-b border-purple-500/20 px-4 sm:px-6 ${lightMode ? 'bg-[#f8faff]' : 'bg-[#050d2b]/80 backdrop-blur-xl'}`}>
                <div className="relative mr-auto w-full max-w-md">
                  <span className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>⌕</span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className={`h-11 w-full rounded-2xl border border-purple-500/30 pl-11 pr-4 text-sm outline-none transition focus:border-purple-400 ${lightMode ? 'bg-[#e4eaff] text-[#17264b]' : 'bg-[#101d43] text-white placeholder:text-[#b7c7ef]'}`}
                  />
                </div>

                <button
                  onClick={() => setShowNotifModal(true)}
                  className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-purple-500/30 text-lg transition hover:border-purple-400 hover:scale-110 ${lightMode ? 'bg-white' : 'bg-[#101b41]'}`}
                >
                  🔔
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-pink-400 shadow-md shadow-pink-400/60" />
                </button>

                <button
                  onClick={() => { setLightMode(!lightMode); showToast(!lightMode ? 'Light theme enabled' : 'Dark theme enabled') }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-purple-500/30 text-lg transition hover:border-purple-400 hover:scale-110 ${lightMode ? 'bg-white' : 'bg-[#101b41]'}`}
                >
                  {lightMode ? '☀️' : '🌙'}
                </button>

                <button
                  onClick={() => { setEditName(userName); setShowProfileModal(true) }}
                  className={`flex h-11 items-center gap-2 rounded-full border-2 border-blue-400/60 px-3 text-sm font-semibold shadow-lg shadow-blue-500/30 transition hover:scale-105 ${lightMode ? 'bg-white text-[#17264b]' : 'bg-[#101b41] text-white'}`}
                >
                  <span className="text-lg">👤</span>
                  <span className="hidden sm:inline">{userName}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-lg transition hover:scale-110 hover:bg-red-500/20"
                >
                  🚪
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {/* Welcome */}
                <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>
                      {getGreeting()},{' '}
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {userName}
                      </span>{' '}
                      👋
                    </h1>
                    <p className={`mt-2 text-sm ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                      Keep going! Your goals are closer than you think.
                    </p>
                  </div>
                  <div className={`hidden text-right text-sm italic leading-loose lg:block ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                    "Discipline today,<br />freedom tomorrow."
                  </div>
                </section>

                {/* Stats */}
                <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <article
                    onClick={() => navigate('/tasks')}
                    className="relative cursor-pointer overflow-hidden rounded-2xl border border-purple-500/50 bg-gradient-to-br from-purple-800 via-blue-800 to-blue-900 p-4 shadow-lg transition hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-blue-300 bg-blue-500/30 text-2xl shadow-lg shadow-blue-500/50">
                        ⏱️
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{studyHours}h</h2>
                        <p className="text-xs text-blue-200">Study Time</p>
                      </div>
                      <div className="ml-auto text-xs text-cyan-300">↑ 12%</div>
                    </div>
                  </article>

                  <article
                    onClick={() => navigate('/tasks')}
                    className="relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-900 to-emerald-700 p-4 shadow-lg transition hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-emerald-300 bg-emerald-500/30 text-2xl shadow-lg shadow-emerald-500/50">
                        ✓
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{completedCount}/{tasks.length}</h2>
                        <p className="text-xs text-emerald-200">Tasks Done</p>
                      </div>
                      <div className="ml-auto text-xs text-emerald-300">↑ {progress}%</div>
                    </div>
                  </article>

                  <article className="relative overflow-hidden rounded-2xl border border-pink-500/50 bg-gradient-to-br from-pink-900 to-pink-700 p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-pink-300 bg-pink-500/30 text-2xl shadow-lg shadow-pink-500/50">
                        🔥
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{completedCount > 0 ? completedCount : 12}</h2>
                        <p className="text-xs text-pink-200">Day Streak</p>
                      </div>
                      <div className="ml-auto text-xs text-pink-300">↑ {completedCount > 0 ? completedCount * 5 : 0}%</div>
                    </div>
                  </article>
                </section>

                {/* 3-column */}
                <section className={`mb-6 grid grid-cols-1 overflow-hidden rounded-2xl border lg:grid-cols-3 ${lightMode ? 'border-purple-300/50 bg-[#edf2ff]' : 'border-purple-500/30 bg-[#091535]'}`}>
                  {/* Latest Tasks */}
                  <div className={`border-b p-5 lg:border-b-0 lg:border-r ${lightMode ? 'border-purple-300/50' : 'border-purple-500/20'}`}>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl text-purple-400">♙</span>
                        <h3 className={`text-sm font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>
                          Latest Tasks
                        </h3>
                      </div>
                      <button
                        onClick={() => navigate('/tasks')}
                        className="text-xs text-purple-400 hover:text-purple-300"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="space-y-2">
                      {filteredTasks.length === 0 ? (
                        <div className="py-6 text-center">
                          <p className="text-3xl">📝</p>
                          <p className={`mt-2 text-xs ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                            {searchQuery ? 'No matching tasks' : 'No tasks yet. Add your first task!'}
                          </p>
                          <button
                            onClick={() => navigate('/tasks')}
                            className="mt-3 rounded-lg bg-blue-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
                          >
                            + Add Task
                          </button>
                        </div>
                      ) : (
                        filteredTasks.slice(0, 5).map((task, i) => (
                          <div
                            key={task.id || i}
                            onClick={() => navigate(`/task/${task.id}`)}
                            className={`group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition hover:scale-[1.02] ${
                              lightMode ? 'bg-[#dce6ff] hover:bg-[#cdd9ff]' : 'bg-[#12224e] hover:bg-[#1a2d5c]'
                            }`}
                          >
                            <span className={`h-8 w-2 rounded-full ${
                              task.completed ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className={`truncate text-sm font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>
                                {task.subject}
                              </p>
                              <p className={`truncate text-xs ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                                {task.target}
                              </p>
                            </div>
                            <span className={`text-lg ${task.completed ? 'text-green-500' : 'text-yellow-500'}`}>
                              {task.completed ? '✅' : '⏳'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className={`border-b p-5 lg:border-b-0 lg:border-r ${lightMode ? 'border-purple-300/50' : 'border-purple-500/20'}`}>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📚</span>
                        <h3 className={`text-sm font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>
                          Subjects
                        </h3>
                      </div>
                      <button
                        onClick={() => navigate('/subjects')}
                        className="text-xs text-purple-400 hover:text-purple-300"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="space-y-2">
                      {uniqueSubjects.length === 0 ? (
                        <div className="py-6 text-center">
                          <p className="text-3xl">📚</p>
                          <p className={`mt-2 text-xs ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                            Add tasks to see subjects
                          </p>
                        </div>
                      ) : (
                        uniqueSubjects.map((subject, i) => {
                          const subjectTasks = tasks.filter(t => t.subject === subject)
                          const done = subjectTasks.filter(t => t.completed).length
                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-3 rounded-xl p-3 ${lightMode ? 'bg-[#dce6ff]' : 'bg-[#12224e]'}`}
                            >
                              <span className={`h-3 w-3 rounded-full ${subjectColors[i % subjectColors.length]} shadow`} />
                              <span className={`flex-1 truncate text-sm ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>
                                {subject}
                              </span>
                              <span className={`text-xs ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                                {done}/{subjectTasks.length}
                              </span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-xl text-purple-400">▥</span>
                      <h3 className={`text-sm font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>Quick Stats</h3>
                    </div>
                    <div className="space-y-2">
                      <div className={`flex items-center gap-3 rounded-xl p-3 ${lightMode ? 'bg-[#dce6ff]' : 'bg-[#12224e]'}`}>
                        <span className="text-xl">⏱️</span>
                        <div>
                          <p className={`text-sm font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>{formatTimer(totalSeconds)}</p>
                          <p className={`text-[10px] ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>Total Study Time</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 rounded-xl p-3 ${lightMode ? 'bg-[#dce6ff]' : 'bg-[#12224e]'}`}>
                        <span className="text-xl">📋</span>
                        <div className="min-w-0">
                          <p className={`truncate text-sm font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>
                            {tasks.length > 0 ? tasks[0].target : 'No task added'}
                          </p>
                          <p className={`text-[10px] ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>Current Task</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Bottom — Progress + Pomodoro */}
                <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className={`rounded-2xl border p-6 ${lightMode ? 'border-purple-300/50 bg-[#edf2ff]' : 'border-purple-500/40 bg-[#071a42]'}`}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-2xl text-blue-400">◎</span>
                      <h3 className={`text-base font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>Progress</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`h-5 flex-1 overflow-hidden rounded-full border ${lightMode ? 'border-purple-300/50 bg-[#dce6ff]' : 'border-purple-500/40 bg-[#1b3373]'}`}>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-md shadow-purple-500/50 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-cyan-400">{progress}%</span>
                    </div>
                    <p className={`mt-4 text-xs italic ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                      🚀 "Better days are coming. Keep studying!"
                    </p>
                  </div>

                  <div className={`rounded-2xl border p-6 ${lightMode ? 'border-purple-300/50 bg-[#edf2ff]' : 'border-purple-500/40 bg-[#080f30]'}`}>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl text-pink-400">◴</span>
                        <h3 className={`text-base font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>Pomodoro</h3>
                        {isRunning && (
                          <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                        )}
                      </div>
                      <button
                        onClick={() => { setTimerMinutes(Math.round(timer / 60)); setShowTimerSettings(true) }}
                        className={`text-xl transition hover:scale-110 ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}
                      >
                        •••
                      </button>
                    </div>

                    <div className={`mx-auto my-3 flex h-28 w-28 items-center justify-center rounded-full border-4 bg-[#080f2d] text-2xl font-bold text-white shadow-lg ${
                      isRunning
                        ? 'border-blue-500 shadow-blue-500/70 timer-running'
                        : 'border-blue-500 shadow-blue-500/50'
                    }`}>
                      {formatTimer(timer)}
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={handleStartTimer}
                        className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105 ${
                          isRunning
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-orange-500/50'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-purple-500/50'
                        }`}
                      >
                        {isRunning ? '⏸ Pause' : '▶ Start'}
                      </button>
                      <button
                        onClick={handleResetTimer}
                        className={`rounded-full border border-purple-500/40 px-6 py-2.5 text-sm font-semibold transition hover:bg-purple-500/10 ${lightMode ? 'text-[#17264b]' : 'text-white'}`}
                      >
                        ⟳ Reset
                      </button>
                    </div>

                    {isRunning && (
                      <p className={`mt-3 text-center text-[10px] ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                        ✅ Timer running in background
                      </p>
                    )}
                  </div>
                </section>

                <footer className={`flex flex-col items-center gap-2 text-center text-xs italic ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
                  <span className="text-xl text-purple-400">✦</span>
                  <p>
                    "Small daily progress creates remarkable results.<br />
                    Stay focused, keep learning, and trust your journey."
                  </p>
                  <span className="text-xl text-purple-400">✦</span>
                </footer>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-purple-400/50 bg-[#101d48] px-5 py-3 text-sm text-white shadow-2xl shadow-purple-500/30 anim-float">
          {toast}
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className={`w-full max-w-md rounded-2xl border border-purple-500/40 p-6 ${lightMode ? 'bg-white' : 'bg-[#0b1738]'}`}>
            <h2 className={`mb-4 text-xl font-bold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>Edit profile</h2>
            <label className={`mb-1 block text-xs ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>Display name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={35}
              className={`mb-5 w-full rounded-xl border border-purple-500/30 px-4 py-3 text-sm outline-none ${lightMode ? 'bg-[#f0f4ff] text-[#17264b]' : 'bg-[#101e49] text-white'}`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className={`flex-1 rounded-xl border border-purple-500/40 py-3 text-sm font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notif Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className={`w-full max-w-md rounded-2xl border border-purple-500/40 p-6 ${lightMode ? 'bg-white' : 'bg-[#0b1738]'}`}>
            <h2 className={`mb-4 text-xl font-bold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>Notifications</h2>
            <p className={`mb-5 text-sm ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>
              You're all caught up! 🎯
            </p>
            <button
              onClick={() => setShowNotifModal(false)}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Timer Modal */}
      {showTimerSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className={`w-full max-w-md rounded-2xl border border-purple-500/40 p-6 ${lightMode ? 'bg-white' : 'bg-[#0b1738]'}`}>
            <h2 className={`mb-4 text-xl font-bold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}>Pomodoro settings</h2>
            <label className={`mb-1 block text-xs ${lightMode ? 'text-[#52648c]' : 'text-[#b8c8f4]'}`}>Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(e.target.value)}
              className={`mb-5 w-full rounded-xl border border-purple-500/30 px-4 py-3 text-sm outline-none ${lightMode ? 'bg-[#f0f4ff] text-[#17264b]' : 'bg-[#101e49] text-white'}`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowTimerSettings(false)}
                className={`flex-1 rounded-xl border border-purple-500/40 py-3 text-sm font-semibold ${lightMode ? 'text-[#17264b]' : 'text-white'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTimerSettings}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard