import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [subject, setSubject] = useState('')
  const [target, setTarget] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [toast, setToast] = useState('')
  const [showDetails, setShowDetails] = useState(null)
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  const fetchTasks = () => {
    if (!userId) return navigate('/')
    setFetching(true)
    API.get(`/api/tasks?user_id=${userId}`)
      .then(res => {
        const formatted = (res.data.tasks || []).map(t => ({
          id: t.id,
          subject: t.subject || 'Untitled',
          target: t.target || '',
          priority: t.difficulty
            ? (t.difficulty.charAt(0).toUpperCase() + t.difficulty.slice(1))
            : 'Medium',
          completed: t.completed || false,
          progress: t.progress || 0,
          practice_score: t.practice_score || 0,
          final_score: t.final_score || 0,
          createdAt: t.created_at ? new Date(t.created_at).getTime() : Date.now(),
        }))
        setTasks(formatted)
      })
      .catch(err => console.error(err))
      .finally(() => setFetching(false))
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!subject.trim() || !target.trim()) {
      showToast('Please enter both subject and target.')
      return
    }

    setLoading(true)
    try {
      await API.post('/api/tasks', {
        user_id: userId,
        subject: subject.trim(),
        target: target.trim(),
        difficulty: priority.toLowerCase(),
      })
      setSubject('')
      setTarget('')
      setPriority('Medium')
      fetchTasks()
      showToast('✨ Task added successfully!')
    } catch (err) {
      showToast('Failed to add task')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (e, task) => {
    e.stopPropagation()
    try {
      await API.put(`/api/tasks/${task.id}`, {
        user_id: userId,
        completed: !task.completed,
      })
      fetchTasks()
      showToast(!task.completed ? '🎉 Great job! Task completed.' : 'Task moved back to pending.')
    } catch (err) {
      showToast('Failed to update task')
    }
  }

  const handleDelete = async (e, task) => {
    e.stopPropagation()
    if (!confirm(`Delete "${task.subject}"?`)) return
    try {
      await API.delete(`/api/tasks/${task.id}?user_id=${userId}`)
      fetchTasks()
      showToast('Task deleted.')
    } catch (err) {
      showToast('Failed to delete task')
    }
  }

  // ⭐ NEW: Task click → TaskDetail page
  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`)
  }

  const total = tasks.length
  const completedCount = tasks.filter(t => t.completed).length
  const pendingCount = total - completedCount

  const visible = (() => {
    let list = [...tasks]
    if (filter === 'pending') list = list.filter(t => !t.completed)
    else if (filter === 'completed') list = list.filter(t => t.completed)
    if (searchText) {
      const q = searchText.toLowerCase()
      list = list.filter(t =>
        (t.subject + ' ' + t.target + ' ' + t.priority).toLowerCase().includes(q)
      )
    }
    if (sortBy === 'newest') list.sort((a, b) => b.createdAt - a.createdAt)
    else if (sortBy === 'oldest') list.sort((a, b) => a.createdAt - b.createdAt)
    else if (sortBy === 'priority') {
      const rank = { High: 0, Medium: 1, Low: 2 }
      list.sort((a, b) => rank[a.priority] - rank[b.priority] || b.createdAt - a.createdAt)
    }
    return list
  })()

  const priorityColor = (p) => {
    if (p === 'High') return 'bg-[#3b1b32] text-[#ff9eae] border-[#69304d]'
    if (p === 'Low') return 'bg-[#11342f] text-[#65e8bd] border-[#23594a]'
    return 'bg-[#342a21] text-[#ffd57e] border-[#5b482e]'
  }

  return (
    <div className="dashboard-shell water-flow-enabled relative isolate min-h-screen bg-transparent font-inter text-[#f0f5ff]">

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <section className="mb-6 flex items-center gap-4">
            <div className="grid h-[55px] w-[55px] place-items-center rounded-[17px] border border-[#3858a1] bg-gradient-to-br from-[#163d78] to-[#25205b] text-[27px]">☑️</div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">My <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">Tasks</span></h1>
              <p className="mt-1 text-[13px] text-[#92a6c8]">✨ Click a task to open Practice Test + AI Questions</p>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-6 grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            <article className="interactive-card relative min-h-[106px] overflow-hidden rounded-[17px] border border-[#285aa1] bg-gradient-to-br from-[#102a54]/90 to-[#0d1b37]/90 p-5 text-[#64a2ff] backdrop-blur-xl">
              <span className="block text-3xl font-extrabold">{total}</span>
              <div className="text-xs text-[#d0def5]">Total Tasks</div>
              <div className="mt-1 text-[10px] text-[#92a6c8]">Your learning checklist</div>
            </article>
            <article className="interactive-card relative min-h-[106px] overflow-hidden rounded-[17px] border border-[#64502d] bg-gradient-to-br from-[#292443]/90 to-[#19192e]/90 p-5 text-[#ffc857] backdrop-blur-xl">
              <span className="block text-3xl font-extrabold">{pendingCount}</span>
              <div className="text-xs text-[#d0def5]">Pending</div>
              <div className="mt-1 text-[10px] text-[#92a6c8]">Ready for your focus</div>
            </article>
            <article className="interactive-card relative min-h-[106px] overflow-hidden rounded-[17px] border border-[#17604f] bg-gradient-to-br from-[#0d3438]/90 to-[#0c222f]/90 p-5 text-[#39e6ae] backdrop-blur-xl">
              <span className="block text-3xl font-extrabold">{completedCount}</span>
              <div className="text-xs text-[#d0def5]">Completed</div>
              <div className="mt-1 text-[10px] text-[#92a6c8]">Progress you have made</div>
            </article>
          </section>

          {/* Add Task Panel */}
          <section className="interactive-card mb-6 rounded-[19px] border border-[#243b62] bg-gradient-to-br from-[#0d1830]/90 to-[#0b1428]/90 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-2xl">✚</span>
              <div>
                <h2 className="text-lg font-bold">Add New Task</h2>
                <p className="mt-0.5 text-xs text-[#92a6c8]">One task at a time. Keep moving forward.</p>
              </div>
            </div>

            <form onSubmit={handleAddTask} className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#c5d6f3]">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Mathematics" maxLength={100} required
                  className="h-[49px] w-full rounded-xl border border-[#2b4268] bg-[#080f22] px-4 text-sm text-white outline-none placeholder:text-[#7589ab] focus:border-[#4388ff]" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#c5d6f3]">Target / Chapter</label>
                <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g., Chapter 5" maxLength={150} required
                  className="h-[49px] w-full rounded-xl border border-[#2b4268] bg-[#080f22] px-4 text-sm text-white outline-none placeholder:text-[#7589ab] focus:border-[#4388ff]" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#c5d6f3]">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  className="h-[49px] w-full cursor-pointer rounded-xl border border-[#2b4268] bg-[#080f22] px-4 text-sm text-white outline-none focus:border-[#4388ff]">
                  <option value="Medium" className="bg-[#0b1730]">🟡 Medium</option>
                  <option value="High" className="bg-[#0b1730]">🔴 High</option>
                  <option value="Low" className="bg-[#0b1730]">🟢 Low</option>
                </select>
              </div>
              <button type="submit" disabled={loading}
                className="shine-button relative min-h-[49px] rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-purple-500/50 disabled:opacity-50">
                {loading ? '⏳ Adding...' : '+ Add Task'}
              </button>
            </form>
          </section>

          {/* Filter + Sort */}
          <section className="mb-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'all', label: 'All', count: total },
                { key: 'pending', label: 'Pending', count: pendingCount },
                { key: 'completed', label: 'Completed', count: completedCount },
              ].map(tab => (
                <button key={tab.key} onClick={() => setFilter(tab.key)}
                  className={`shine-button relative min-h-[40px] rounded-3xl border px-4 text-xs font-semibold transition ${
                    filter === tab.key
                      ? 'border-[#4b84ff] bg-gradient-to-r from-[#287fff] to-[#4938e9] text-white'
                      : 'border-[#2a3e60] bg-[#0c1730] text-[#b5c7e5] hover:border-[#5788ed] hover:text-white'
                  }`}>
                  {tab.label} <span className="opacity-80">({tab.count})</span>
                </button>
              ))}

              <div className="ml-auto flex gap-2">
                <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="⌕ Filter tasks..."
                  className="h-[39px] w-44 rounded-xl border border-[#2b4268] bg-[#080f22] px-3 text-xs text-white outline-none placeholder:text-[#7589ab] focus:border-[#4388ff]" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="h-[39px] cursor-pointer rounded-xl border border-[#2b4268] bg-[#080f22] px-3 text-xs text-white outline-none focus:border-[#4388ff]">
                  <option value="newest" className="bg-[#0b1730]">Newest first</option>
                  <option value="oldest" className="bg-[#0b1730]">Oldest first</option>
                  <option value="priority" className="bg-[#0b1730]">Priority first</option>
                </select>
              </div>
            </div>
          </section>

          {/* Task List */}
          <section className="interactive-card rounded-[19px] border border-[#243b62] bg-gradient-to-br from-[#0d1830]/90 to-[#0b1428]/90 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between px-1">
              <h2 className="text-base font-bold">
                {filter === 'all' ? '📋 All Tasks' : filter === 'pending' ? '🕒 Pending Tasks' : '✅ Completed Tasks'}
              </h2>
              <span className="text-xs text-[#92a6c8]">{visible.length} {visible.length === 1 ? 'task' : 'tasks'} shown</span>
            </div>

            {fetching ? (
              <div className="py-16 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#287fff] border-t-transparent" />
                <p className="mt-3 text-sm text-[#92a6c8]">Loading tasks...</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="flex min-h-[230px] flex-col items-center justify-center px-4 py-8 text-center">
                <div className="mb-4 grid h-[76px] w-[76px] place-items-center rounded-3xl border border-[#2b4a7c] bg-gradient-to-br from-[#142a51] to-[#171941] text-4xl">
                  {searchText ? '🔎' : filter === 'pending' ? '🎉' : filter === 'completed' ? '🌱' : '📝'}
                </div>
                <h3 className="mb-2 text-base font-bold">
                  {searchText ? 'No matching tasks' : filter === 'pending' && tasks.length > 0 ? 'All caught up!' : filter === 'completed' && tasks.length > 0 ? 'Your next win starts here' : 'No tasks yet'}
                </h3>
                <p className="max-w-md text-xs leading-relaxed text-[#92a6c8]">
                  {searchText ? 'Try another search term.' : filter === 'pending' ? 'You have no pending tasks.' : filter === 'completed' ? 'Complete a task and it will appear here.' : 'Add your first task above and start building your streak.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {visible.map(task => (
                  <article
                    key={task.id}
                    onClick={() => handleTaskClick(task.id)}
                    className="interactive-card group flex cursor-pointer items-center gap-3 rounded-[14px] border border-[#233c63] bg-gradient-to-r from-[#101f3b]/90 to-[#0c1830]/90 p-4 backdrop-blur-xl"
                  >
                    {/* Checkbox — stops navigation */}
                    <button
                      onClick={(e) => handleToggle(e, task)}
                      className={`shine-button relative grid h-[25px] w-[25px] shrink-0 place-items-center rounded-lg border text-sm transition ${
                        task.completed
                          ? 'border-[#31e6bb] bg-gradient-to-br from-[#0fcba1] to-[#0d9a83] text-[#06271e]'
                          : 'border-[#46658f] bg-[#09152a] text-white hover:border-[#39e6ae]'
                      }`}
                    >
                      {task.completed ? '✓' : ''}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-bold ${task.completed ? 'text-[#7f96b5] line-through' : 'text-white'}`}>
                        {task.subject}
                      </div>
                      <div className={`mt-1 text-xs ${task.completed ? 'text-[#7f96b5] line-through' : 'text-[#8da5c9]'}`}>
                        {task.target}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${priorityColor(task.priority)}`}>
                          {task.priority} priority
                        </span>
                        <span className="rounded-full border border-[#2b4771] bg-[#142748] px-2.5 py-1 text-[10px] font-semibold text-[#a9caff]">
                          {task.completed ? '✓ Completed' : '◷ In progress'}
                        </span>
                        {/* ⭐ Progress badge */}
                        {task.progress > 0 && (
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                            task.progress >= 100
                              ? 'border-[#31e6bb] bg-[#11342f] text-[#65e8bd]'
                              : 'border-[#64502d] bg-[#342a21] text-[#ffd57e]'
                          }`}>
                            📊 {task.progress}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* ⭐ Start button — hover e dekhay */}
                      <span className="hidden rounded-lg bg-gradient-to-r from-[#287fff] to-[#4938e9] px-3 py-1.5 text-[10px] font-bold text-white group-hover:inline-block">
                        🎯 Start →
                      </span>

                      <button
                        onClick={(e) => { e.stopPropagation(); setShowDetails(task) }}
                        className="shine-button relative grid h-[35px] w-[35px] place-items-center rounded-[10px] border border-[#2a4066] bg-[#0b1730] text-[15px] text-[#a9c6ee] transition hover:border-[#629bff] hover:text-white"
                        title="Task details"
                      >ⓘ</button>

                      <button
                        onClick={(e) => handleDelete(e, task)}
                        className="shine-button relative grid h-[35px] w-[35px] place-items-center rounded-[10px] border border-[#2a4066] bg-[#0b1730] text-[15px] text-[#a9c6ee] transition hover:border-[#a33e65] hover:bg-[#3b1930] hover:text-[#ff9db5]"
                        title="Delete task"
                      >⌫</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="mt-4 py-4 text-center text-[10px] text-[#647da3]">
            STUDYFLOW · Stay focused, learn consistently, and celebrate every win ✨
          </div>
      </main>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-[13px] border border-[#315b98] bg-[#102343] px-5 py-3.5 text-sm text-[#edf5ff] shadow-[0_12px_35px_#0008]">
          {toast}
        </div>
      )}

      {/* DETAILS MODAL */}
      {showDetails && (
        <div onClick={(e) => e.target === e.currentTarget && setShowDetails(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="interactive-card w-full max-w-md rounded-2xl border border-[#2a4066] bg-[#0d1730]/95 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-xl font-bold text-white">📋 Task Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-[#92a6c8]">SUBJECT</p>
                <p className="font-semibold text-white">{showDetails.subject}</p>
              </div>
              <div>
                <p className="text-xs text-[#92a6c8]">TARGET</p>
                <p className="font-semibold text-white">{showDetails.target}</p>
              </div>
              <div>
                <p className="text-xs text-[#92a6c8]">PRIORITY</p>
                <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${priorityColor(showDetails.priority)}`}>
                  {showDetails.priority}
                </span>
              </div>
              <div>
                <p className="text-xs text-[#92a6c8]">PROGRESS</p>
                <p className={`font-semibold ${showDetails.progress >= 100 ? 'text-[#39e6ae]' : 'text-[#ffc857]'}`}>
                  {showDetails.progress || 0}% (Practice: {showDetails.practice_score || 0}% • Final: {showDetails.final_score || 0}%)
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => { setShowDetails(null); handleTaskClick(showDetails.id) }}
                className="shine-button relative rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition hover:scale-[1.02] hover:shadow-purple-500/50"
              >
                🎯 Open Task
              </button>
              <button
                onClick={() => setShowDetails(null)}
                className="shine-button relative rounded-xl border border-[#2a4066] bg-[#0b1730] py-3 text-sm font-bold text-[#a9c6ee]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks