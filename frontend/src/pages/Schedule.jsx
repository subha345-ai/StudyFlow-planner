import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import API from '../services/api'

function Schedule() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', subject: '' })
  const [toast, setToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { lightMode } = useOutletContext()
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

  return (
    <div className={`dashboard-shell relative isolate min-h-screen w-full ${lightMode ? 'bg-gradient-to-br from-[#eef3ff] via-[#f7f5ff] to-[#f3f1ff]' : 'water-flow-enabled bg-transparent'} transition-colors duration-500`}>

      {/* ═══ Background Glow ═══ */}
      {!lightMode && (
        <>
          <div className="aurora-orb aurora-one" />
          <div className="aurora-orb aurora-two" />
        </>
      )}

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className={`mb-5 flex h-12 items-center gap-3 rounded-2xl border px-4 ${lightMode ? 'border-white bg-white/60' : 'border-purple-500/30 bg-[#0d0524]/80'}`}>
            <span className="text-lg text-blue-400">⌕</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schedule..."
              className={`flex-1 bg-transparent text-sm outline-none ${lightMode ? 'text-[#172c57]' : 'text-white placeholder:text-slate-500'}`}
            />
          </div>
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
            <div className={`interactive-card flex min-h-[130px] items-center gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-xl ${lightMode ? 'border-blue-100 bg-gradient-to-br from-white/90 to-blue-50/90' : 'border-blue-500/30 bg-gradient-to-br from-blue-900/50 to-blue-800/30'}`}>
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
            <div className={`interactive-card flex min-h-[130px] items-center gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-xl ${lightMode ? 'border-orange-100 bg-gradient-to-br from-white/90 to-orange-50/90' : 'border-orange-500/30 bg-gradient-to-br from-orange-900/50 to-orange-800/30'}`}>
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
            <div className={`interactive-card flex min-h-[130px] items-center gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-xl ${lightMode ? 'border-green-100 bg-gradient-to-br from-white/90 to-green-50/90' : 'border-green-500/30 bg-gradient-to-br from-green-900/50 to-green-800/30'}`}>
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
          <section className={`interactive-card mb-4 rounded-2xl border p-6 shadow-lg backdrop-blur-xl ${lightMode ? 'border-purple-200 bg-white/80' : 'border-purple-500/30 bg-[#0d0524]/80'}`}>
            <div className="mb-4 flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${lightMode ? 'bg-white shadow' : 'bg-purple-500/20 text-purple-300'}`}>
                ▤
              </div>
              <h3 className={`text-lg font-bold ${lightMode ? 'text-[#142a57]' : 'text-white'}`}>
                Pending Tasks ({pending.length})
              </h3>
              <button
                onClick={() => setShowModal(true)}
                className={`shine-button relative ml-auto rounded-full border px-4 py-2 text-sm font-bold transition hover:scale-105 ${lightMode ? 'border-blue-200 bg-white text-blue-600' : 'border-transparent bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'}`}
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
          <section className={`interactive-card rounded-2xl border p-6 shadow-lg backdrop-blur-xl ${lightMode ? 'border-green-200 bg-gradient-to-br from-white/90 to-green-50/90' : 'border-green-500/30 bg-gradient-to-br from-green-900/30 to-[#0d0524]/80'}`}>
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

      {/* ═══ MODAL — Add Task ═══ */}
      {showModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        >
          <form
            onSubmit={handleAddTask}
            className={`interactive-card w-full max-w-md rounded-2xl border p-7 backdrop-blur-xl ${lightMode ? 'border-purple-200 bg-white/95' : 'border-purple-500/40 bg-[#0d0524]/95'}`}
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
                className={`shine-button relative rounded-xl px-4 py-2.5 text-sm font-bold ${lightMode ? 'bg-gray-100 text-gray-600' : 'bg-purple-500/20 text-purple-300'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="shine-button relative rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/40 transition hover:scale-105 hover:shadow-purple-500/60"
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
    <div className={`interactive-card flex items-center gap-3 rounded-xl border p-4 backdrop-blur-xl ${lightMode ? 'border-gray-200 bg-white/90' : 'border-purple-500/20 bg-purple-500/5'}`}>
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
        className={`shine-button relative rounded-lg px-3 py-1.5 text-sm transition hover:scale-110 ${lightMode ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'}`}
      >
        ✕
      </button>
    </div>
  )
}

export default Schedule