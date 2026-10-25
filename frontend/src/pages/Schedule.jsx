import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Schedule() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', subject: '' })
  const [toast, setToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [lightMode, setLightMode] = useState(false)
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  // ═══ Fetch tasks ═══
  const fetchTasks = () => {
    if (!userId) return navigate('/')
    setLoading(true)
    API.get(`/api/tasks?user_id=${userId}`)
      .then(res => {
        const formatted = (res.data.tasks || []).map(t => ({
          id: t.id,
          title: t.target || t.title || 'Untitled',
          subject: t.subject || 'Study task',
          done: t.completed || false,
        }))
        setTasks(formatted)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // ═══ Add task ═══
  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      await API.post('/api/tasks', {
        user_id: userId,
        subject: newTask.subject.trim() || 'General',
        target: newTask.title.trim(),
        difficulty: 'medium',
      })
      setNewTask({ title: '', subject: '' })
      setShowModal(false)
      fetchTasks()
      showToast('Task added to your schedule ✨')
    } catch (err) {
      showToast('Failed to add task')
    }
  }

  // ═══ Toggle complete ═══
  const handleToggle = async (task) => {
    try {
      await API.put(`/api/tasks/${task.id}`, {
        user_id: userId,
        completed: !task.done,
      })
      fetchTasks()
      showToast(!task.done ? 'Task completed. Great work! 🎉' : 'Task moved to pending.')
    } catch (err) {
      showToast('Failed to update task')
    }
  }

  // ═══ Delete task ═══
  const handleDelete = async (taskId) => {
    try {
      await API.delete(`/api/tasks/${taskId}?user_id=${userId}`)
      fetchTasks()
      showToast('Task removed.')
    } catch (err) {
      showToast('Failed to delete task')
    }
  }

  // ═══ Filter by search ═══
  const filtered = tasks.filter(t =>
    !searchQuery ||
    (t.title + ' ' + t.subject).toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pending = filtered.filter(t => !t.done)
  const completed = filtered.filter(t => t.done)

  // ═══ Theme colors ═══
  const theme = lightMode ? {
    bg: 'bg-gradient-to-br from-[#eef3ff] via-[#f7f5ff] to-[#f3f1ff]',
    text: 'text-[#172c57]',
    panelBg: 'bg-white/80',
    panelBorder: 'border-white',
    statBg: 'bg-white/80',
    sidebarBg: 'bg-gradient-to-b from-[#102052] to-[#0c1a46]',
  } : {
    bg: 'bg-[#0a0428]',
    text: 'text-white',
    panelBg: 'bg-[#0d0524]/80',
    panelBorder: 'border-purple-500/30',
    statBg: 'bg-[#0d0524]/80',
    sidebarBg: 'bg-gradient-to-b from-[#0f0c3c] to-[#0a0428]',
  }

  return (
    <div className={`min-h-screen w-full ${lightMode ? 'bg-gradient-to-br from-[#eef3ff] via-[#f7f5ff] to-[#f3f1ff]' : 'bg-[#0a0428]'} transition-colors duration-500`}>

      {/* ═══ Background Glow ═══ */}
      {!lightMode && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-700/40 blur-[130px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-800/40 blur-[130px]" />
        </>
      )}

      <div className="relative flex min-h-screen">

        {/* ═══ SIDEBAR ═══ */}
        <aside className={`hidden w-[260px] shrink-0 flex-col p-6 lg:flex ${lightMode ? 'bg-gradient-to-b from-[#102052] to-[#0c1a46]' : 'bg-gradient-to-b from-[#0f0c3c] to-[#0a0428]'} border-r ${lightMode ? 'border-white/10' : 'border-purple-500/20'}`}>
          {/* Brand */}
          <div className={`mb-7 flex items-center gap-3 border-b pb-5 ${lightMode ? 'border-white/10' : 'border-purple-500/20'}`}>
            <div className="text-3xl">🎓</div>
            <div>
              <h1 className={`text-xl font-extrabold ${lightMode ? 'text-white' : 'text-white'}`}>
                Study<span className="text-blue-300">Flow</span>
              </h1>
              <p className={`text-[10px] ${lightMode ? 'text-blue-200' : 'text-slate-400'}`}>
                Learn · Plan · Grow
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-2">
            {[
              { icon: '⌂', label: 'Dashboard', path: '/dashboard' },
              { icon: '⌕', label: 'Search', path: '/search' },
              { icon: '▦', label: 'Schedule', path: '/schedule', active: true },
              { icon: '☑', label: 'Tasks', path: '/tasks' },
              { icon: '⏱', label: 'Pomodoro', path: '/pomodoro' },
              { icon: '▥', label: 'Progress', path: '/progress' },
              { icon: '📚', label: 'Subjects', path: '/subjects' },
              { icon: '🎓', label: 'Chapters', path: '/chapters' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-600/40'
                    : lightMode
                    ? 'text-blue-100 hover:bg-white/10'
                    : 'text-slate-300 hover:bg-purple-500/20'
                }`}
              >
                <span className="w-6 text-center text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Note */}
          <div className={`mt-6 rounded-2xl border p-4 ${lightMode ? 'border-white/20 bg-white/5' : 'border-purple-500/20 bg-purple-500/5'}`}>
            <div className="mb-2 text-2xl">🌿</div>
            <p className={`text-xs leading-relaxed ${lightMode ? 'text-blue-100' : 'text-slate-400'}`}>
              Small steps
              <br />
              <strong className="text-white">make big progress.</strong>
            </p>
          </div>
        </aside>

        {/* ═══ MAIN ═══ */}
        <main className="min-w-0 flex-1 p-6 lg:p-8">

          {/* Topbar */}
          <header className="mb-5 flex h-16 items-center justify-between gap-4">
            <div className={`flex h-14 flex-1 items-center gap-3 rounded-2xl border px-4 ${lightMode ? 'border-white bg-white/60' : 'border-purple-500/30 bg-[#0d0524]/80'}`}>
              <span className="text-lg text-blue-400">⌕</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything..."
                className={`flex-1 bg-transparent text-sm outline-none ${lightMode ? 'text-[#172c57]' : 'text-white placeholder:text-slate-500'}`}
              />
              <span className={`hidden rounded-lg px-2 py-1 text-xs font-bold sm:block ${lightMode ? 'bg-blue-100 text-blue-700' : 'bg-purple-500/20 text-purple-300'}`}>
                Ctrl + K
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast(tasks.some(t => !t.done) ? 'You have tasks waiting! 💪' : 'You are all caught up! 🎉')}
                className={`relative flex h-14 w-14 items-center justify-center rounded-full border text-xl transition hover:scale-110 ${lightMode ? 'border-white bg-white/60' : 'border-purple-500/30 bg-[#0d0524]/80'}`}
              >
                🔔
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-pink-400" />
              </button>

              <button
                onClick={() => { setLightMode(!lightMode); showToast(!lightMode ? 'Light mode ☀️' : 'Dark mode 🌙') }}
                className={`flex h-14 w-14 items-center justify-center rounded-full border text-xl transition hover:scale-110 ${lightMode ? 'border-white bg-white/60' : 'border-purple-500/30 bg-[#0d0524]/80'}`}
              >
                {lightMode ? '☀️' : '🌙'}
              </button>

              <button
                onClick={() => showToast('Welcome back! 👋')}
                className={`flex h-14 items-center gap-2 rounded-full border px-4 ${lightMode ? 'border-white bg-white/60' : 'border-purple-500/30 bg-[#0d0524]/80'}`}
              >
                <span className="text-xl">👤</span>
                <span className={`hidden text-sm font-bold sm:inline ${lightMode ? 'text-[#172c57]' : 'text-white'}`}>
                  {localStorage.getItem('user_name') || 'Student'}
                </span>
              </button>
            </div>
          </header>

          {/* Heading */}
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-3xl text-white shadow-lg shadow-purple-500/40">
                ▦
              </div>
              <div>
                <h2 className={`text-3xl font-extrabold ${lightMode ? 'text-[#142a57]' : 'text-white'}`}>
                  Schedule
                </h2>
                <p className={`mt-1 text-sm ${lightMode ? 'text-[#6579a3]' : 'text-slate-400'}`}>
                  Stay organized. Achieve your goals. 🚀
                </p>
              </div>
            </div>
            <div className="hidden text-right lg:block">
              <p className="hand text-xl italic text-blue-400" style={{ transform: 'rotate(-4deg)' }}>
                Good Things<br />Take Time
              </p>
            </div>
          </div>

          {/* ═══ STATS ═══ */}
          <section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Total */}
            <div className={`flex min-h-[130px] items-center gap-4 rounded-2xl border p-5 shadow-lg ${lightMode ? 'border-blue-100 bg-gradient-to-br from-white to-blue-50' : 'border-blue-500/30 bg-gradient-to-br from-blue-900/50 to-blue-800/30'}`}>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-2xl text-white shadow-lg">
                ▣
              </div>
              <div className="flex-1">
                <p className={`text-2xl font-extrabold ${lightMode ? 'text-[#172c57]' : 'text-white'}`}>
                  {tasks.length}
                </p>
                <p className={`text-xs ${lightMode ? 'text-[#50658e]' : 'text-slate-400'}`}>Total Tasks</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${lightMode ? 'bg-white/60 text-blue-600' : 'bg-blue-500/20 text-blue-300'}`}>
                ↑ 0%
              </span>
            </div>

            {/* Pending */}
            <div className={`flex min-h-[130px] items-center gap-4 rounded-2xl border p-5 shadow-lg ${lightMode ? 'border-orange-100 bg-gradient-to-br from-white to-orange-50' : 'border-orange-500/30 bg-gradient-to-br from-orange-900/50 to-orange-800/30'}`}>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-2xl text-white shadow-lg">
                ◷
              </div>
              <div className="flex-1">
                <p className={`text-2xl font-extrabold ${lightMode ? 'text-[#172c57]' : 'text-white'}`}>
                  {pending.length}
                </p>
                <p className={`text-xs ${lightMode ? 'text-[#50658e]' : 'text-slate-400'}`}>Pending</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${lightMode ? 'bg-white/60 text-orange-600' : 'bg-orange-500/20 text-orange-300'}`}>
                ↑ 0%
              </span>
            </div>

            {/* Completed */}
            <div className={`flex min-h-[130px] items-center gap-4 rounded-2xl border p-5 shadow-lg ${lightMode ? 'border-green-100 bg-gradient-to-br from-white to-green-50' : 'border-green-500/30 bg-gradient-to-br from-green-900/50 to-green-800/30'}`}>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-2xl text-white shadow-lg">
                ✓
              </div>
              <div className="flex-1">
                <p className={`text-2xl font-extrabold ${lightMode ? 'text-[#172c57]' : 'text-white'}`}>
                  {completed.length}
                </p>
                <p className={`text-xs ${lightMode ? 'text-[#50658e]' : 'text-slate-400'}`}>Completed</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${lightMode ? 'bg-white/60 text-green-600' : 'bg-green-500/20 text-green-300'}`}>
                ↑ 0%
              </span>
            </div>
          </section>

          {/* ═══ PENDING PANEL ═══ */}
          <section className={`mb-4 rounded-2xl border p-6 shadow-lg ${lightMode ? 'border-purple-200 bg-white/80' : 'border-purple-500/30 bg-[#0d0524]/80'}`}>
            <div className="mb-4 flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${lightMode ? 'bg-white shadow' : 'bg-purple-500/20 text-purple-300'}`}>
                ▤
              </div>
              <h3 className={`text-lg font-bold ${lightMode ? 'text-[#142a57]' : 'text-white'}`}>
                Pending Tasks ({pending.length})
              </h3>
              <button
                onClick={() => setShowModal(true)}
                className={`ml-auto rounded-full border px-4 py-2 text-sm font-bold transition hover:scale-105 ${lightMode ? 'border-blue-200 bg-white text-blue-600' : 'border-purple-500/40 bg-purple-500/10 text-purple-300'}`}
              >
                ＋ Add Task
              </button>
            </div>

            {pending.length === 0 ? (
              <div className="py-4">
                <p className={`text-sm ${lightMode ? 'text-[#536a96]' : 'text-slate-400'}`}>
                  {searchQuery ? 'No matching pending tasks.' : 'No pending tasks. Great job! 🎉'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    lightMode={lightMode}
                    onToggle={() => handleToggle(task)}
                    onDelete={() => handleDelete(task.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ═══ COMPLETED PANEL ═══ */}
          <section className={`rounded-2xl border p-6 shadow-lg ${lightMode ? 'border-green-200 bg-gradient-to-br from-white to-green-50' : 'border-green-500/30 bg-gradient-to-br from-green-900/30 to-[#0d0524]/80'}`}>
            <div className="mb-4 flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${lightMode ? 'bg-white shadow' : 'bg-green-500/20 text-green-300'}`}>
                ✓
              </div>
              <h3 className={`text-lg font-bold ${lightMode ? 'text-[#142a57]' : 'text-white'}`}>
                Completed ({completed.length})
              </h3>
            </div>

            {completed.length === 0 ? (
              <p className={`text-sm ${lightMode ? 'text-[#536a96]' : 'text-slate-400'}`}>
                {searchQuery ? 'No matching completed tasks.' : 'No completed tasks yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {completed.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    lightMode={lightMode}
                    onToggle={() => handleToggle(task)}
                    onDelete={() => handleDelete(task.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ═══ MODAL — Add Task ═══ */}
      {showModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        >
          <form
            onSubmit={handleAddTask}
            className={`w-full max-w-md rounded-2xl border p-7 ${lightMode ? 'border-purple-200 bg-white' : 'border-purple-500/40 bg-[#0d0524]'}`}
          >
            <h3 className={`mb-5 text-xl font-bold ${lightMode ? 'text-[#142a57]' : 'text-white'}`}>
              ✨ Add a new task
            </h3>
            <input
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Task name (e.g. Practice Python)"
              maxLength={100}
              required
              autoFocus
              className={`mb-3 w-full rounded-xl border px-4 py-3 text-sm outline-none ${lightMode ? 'border-gray-200 bg-gray-50 text-[#172c57] focus:border-blue-400' : 'border-purple-500/30 bg-[#101e49] text-white focus:border-purple-400'}`}
            />
            <input
              value={newTask.subject}
              onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
              placeholder="Subject or chapter (optional)"
              maxLength={80}
              className={`mb-5 w-full rounded-xl border px-4 py-3 text-sm outline-none ${lightMode ? 'border-gray-200 bg-gray-50 text-[#172c57] focus:border-blue-400' : 'border-purple-500/30 bg-[#101e49] text-white focus:border-purple-400'}`}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold ${lightMode ? 'bg-gray-100 text-gray-600' : 'bg-purple-500/20 text-purple-300'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/40"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═══ TOAST ═══ */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-2xl border px-5 py-3 text-sm font-medium shadow-2xl ${lightMode ? 'border-blue-300 bg-white text-[#172c57]' : 'border-purple-400/50 bg-[#101d48] text-white'}`}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ═══ Task Row Component ═══
function TaskRow({ task, lightMode, onToggle, onDelete }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-4 ${lightMode ? 'border-gray-200 bg-white' : 'border-purple-500/20 bg-purple-500/5'}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={onToggle}
        className="h-5 w-5 cursor-pointer accent-green-500"
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${task.done && lightMode ? 'text-gray-400 line-through' : task.done ? 'text-slate-400 line-through' : lightMode ? 'text-[#172c57]' : 'text-white'}`}>
          {task.title}
        </p>
        <p className={`truncate text-xs ${lightMode ? 'text-gray-500' : 'text-slate-400'}`}>
          {task.subject}
        </p>
      </div>
      <button
        onClick={onDelete}
        className={`rounded-lg px-3 py-1.5 text-sm transition hover:scale-110 ${lightMode ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'}`}
      >
        ✕
      </button>
    </div>
  )
}

export default Schedule