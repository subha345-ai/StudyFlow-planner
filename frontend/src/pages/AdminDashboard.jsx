import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_courses: 0,
    total_chapters: 0,
    total_topics: 0,
    total_questions: 0,
  })
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [chapters, setChapters] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [showAddChapter, setShowAddChapter] = useState(false)
  const [newCourse, setNewCourse] = useState({ course_name: '', level: '', stream: '', school: '', subjects: '' })
  const [newChapter, setNewChapter] = useState({ subject: '', level: '', chapter: '', difficulty: 'medium' })
  const navigate = useNavigate()

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // ═══ Auth Check ═══
  useEffect(() => {
    const admin = localStorage.getItem('admin_logged_in')
    const isAdmin = localStorage.getItem('is_admin')
    if (!admin || !isAdmin) {
      navigate('/admin/login')
      return
    }
    fetchAll()
  }, [navigate])

  const fetchAll = () => {
    setLoading(true)

    Promise.all([
      API.get('/api/admin/stats'),
      API.get('/api/admin/users'),
      API.get('/api/admin/courses'),
      API.get('/api/admin/chapters'),
    ])
      .then(([s, u, c, ch]) => {
        setStats(s.data.stats || {})
        setRecentUsers(s.data.recent_users || [])
        setUsers(u.data.users || [])
        setCourses(c.data.courses || [])
        setChapters(ch.data.chapters || [])
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  // ═══ Logout ═══
  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    localStorage.removeItem('admin_name')
    localStorage.removeItem('admin_email')
    localStorage.removeItem('is_admin')
    navigate('/admin/login')
  }

  // ═══ Add Course ═══
  const handleAddCourse = async (e) => {
    e.preventDefault()
    try {
      const subjects = newCourse.subjects.split(',').map(s => s.trim()).filter(Boolean)
      await API.post('/api/admin/courses', {
        ...newCourse,
        subjects
      })
      showToast('✅ Course added successfully!')
      setNewCourse({ course_name: '', level: '', stream: '', school: '', subjects: '' })
      setShowAddCourse(false)
      fetchAll()
    } catch (err) {
      showToast('❌ Failed to add course')
    }
  }

  // ═══ Delete Course ═══
  const handleDeleteCourse = async (id) => {
    if (!confirm('Delete this course?')) return
    try {
      await API.delete(`/api/admin/courses/${id}`)
      showToast('🗑 Course deleted')
      fetchAll()
    } catch (err) {
      showToast('❌ Failed to delete')
    }
  }

  // ═══ Add Chapter ═══
  const handleAddChapter = async (e) => {
    e.preventDefault()
    try {
      await API.post('/api/admin/chapters', {
        ...newChapter,
        topics: []
      })
      showToast('✅ Chapter added successfully!')
      setNewChapter({ subject: '', level: '', chapter: '', difficulty: 'medium' })
      setShowAddChapter(false)
      fetchAll()
    } catch (err) {
      showToast('❌ Failed to add chapter')
    }
  }

  // ═══ Delete Chapter ═══
  const handleDeleteChapter = async (id) => {
    if (!confirm('Delete this chapter?')) return
    try {
      await API.delete(`/api/admin/chapters/${id}`)
      showToast('🗑 Chapter deleted')
      fetchAll()
    } catch (err) {
      showToast('❌ Failed to delete')
    }
  }

  // ═══ Tabs ═══
  const tabs = [
    { key: 'overview', icon: '📊', label: 'Overview' },
    { key: 'users', icon: '👥', label: 'Users' },
    { key: 'courses', icon: '📚', label: 'Courses' },
    { key: 'chapters', icon: '📖', label: 'Chapters' },
  ]

  return (
    <div className="min-h-screen bg-[#050520] text-white relative overflow-hidden">
      {/* ═══ BACKGROUND ═══ */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0428] via-[#1a0b4e] to-[#2d1b69]" />
      <div className="absolute -left-40 -top-20 h-[600px] w-[600px] rounded-full bg-purple-600/40 blur-[150px] animate-pulse" />
      <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/30 blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full bg-pink-600/25 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        {/* ═══ TOPBAR ═══ */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-purple-500/20 bg-[#0a0428]/80 px-6 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 opacity-70 blur-lg" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl shadow-lg">
                👑
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Admin <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Panel</span>
              </h1>
              <p className="text-[10px] text-purple-300/70">StudyFlow Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-purple-400/30 bg-white/5 px-4 py-2 text-sm backdrop-blur-xl sm:flex">
              <span className="text-lg">👤</span>
              <span className="font-semibold">{localStorage.getItem('admin_name') || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-red-500/40 transition-all duration-300 hover:scale-105 hover:shadow-red-500/60"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">🚪 Logout</span>
            </button>
          </div>
        </header>

        {/* ═══ MAIN ═══ */}
        <main className="mx-auto max-w-7xl px-6 py-8">

          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
              <p className="mt-4 text-sm text-purple-300">Loading admin data...</p>
            </div>
          ) : (
            <>
              {/* ═══ STATS CARDS ═══ */}
              <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { icon: '👥', label: 'Total Users', value: stats.total_users, gradient: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/50' },
                  { icon: '📚', label: 'Courses', value: stats.total_courses, gradient: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/50' },
                  { icon: '📖', label: 'Chapters', value: stats.total_chapters, gradient: 'from-emerald-500 to-green-500', glow: 'shadow-emerald-500/50' },
                  { icon: '📝', label: 'Topics', value: stats.total_topics, gradient: 'from-orange-500 to-yellow-500', glow: 'shadow-orange-500/50' },
                  { icon: '❓', label: 'Questions', value: stats.total_questions, gradient: 'from-pink-500 to-red-500', glow: 'shadow-pink-500/50' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-white/5 p-5 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-purple-400/60 hover:shadow-2xl hover:${s.glow}`}
                  >
                    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.gradient} opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40`} />
                    <div className="relative">
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-xl shadow-lg ${s.glow}`}>
                        {s.icon}
                      </div>
                      <p className="text-3xl font-extrabold">{s.value}</p>
                      <p className="text-xs text-purple-300/70">{s.label}</p>
                    </div>
                  </div>
                ))}
              </section>

              {/* ═══ TABS ═══ */}
              <section className="mb-6 flex flex-wrap gap-3">
                {tabs.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`group relative flex items-center gap-2 overflow-hidden rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                      activeTab === t.key
                        ? 'border-transparent bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50 scale-105'
                        : 'border-purple-500/30 bg-white/5 text-purple-200 hover:border-purple-400/60 hover:bg-white/10 hover:scale-105'
                    }`}
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative text-lg">{t.icon}</span>
                    <span className="relative">{t.label}</span>
                  </button>
                ))}
              </section>

              {/* ═══ TAB CONTENT ═══ */}

              {/* ─── OVERVIEW ─── */}
              {activeTab === 'overview' && (
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-purple-500/30 bg-white/5 p-6 backdrop-blur-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 text-lg font-bold">
                        <span className="text-xl">🆕</span> Recent Users
                      </h2>
                      <button
                        onClick={() => setActiveTab('users')}
                        className="text-xs text-purple-300 hover:text-purple-200"
                      >
                        View All →
                      </button>
                    </div>
                    {recentUsers.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-4xl">👥</p>
                        <p className="mt-2 text-xs text-purple-300/70">No users yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recentUsers.map(u => (
                          <div key={u.id} className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-950/40 p-3 transition hover:border-purple-400/50">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold">
                              {u.name?.charAt(0) || '?'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">{u.name}</p>
                              <p className="truncate text-xs text-purple-300/70">{u.email}</p>
                            </div>
                            <span className="text-[10px] text-purple-400">{u.tasks} tasks</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-purple-500/30 bg-white/5 p-6 backdrop-blur-xl">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                      <span className="text-xl">⚡</span> Quick Info
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-950/40 p-4">
                        <span className="text-sm text-purple-200">Active Users</span>
                        <span className="text-lg font-bold text-green-400">{stats.total_users}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-950/40 p-4">
                        <span className="text-sm text-purple-200">Total Courses</span>
                        <span className="text-lg font-bold text-purple-400">{stats.total_courses}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-950/40 p-4">
                        <span className="text-sm text-purple-200">Total Questions</span>
                        <span className="text-lg font-bold text-pink-400">{stats.total_questions}</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ─── USERS ─── */}
              {activeTab === 'users' && (
                <section className="rounded-2xl border border-purple-500/30 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                      <span className="text-xl">👥</span> All Users ({users.length})
                    </h2>
                  </div>

                  {users.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-5xl">👥</p>
                      <p className="mt-3 text-sm text-purple-300/70">No users registered yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-purple-500/30">
                          <tr className="text-xs text-purple-300">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Level</th>
                            <th className="p-3">Stream</th>
                            <th className="p-3">School</th>
                            <th className="p-3">Tasks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u.id} className="border-b border-purple-500/10 transition hover:bg-purple-950/40">
                              <td className="p-3 font-semibold">{u.name}</td>
                              <td className="p-3 text-purple-300">{u.email}</td>
                              <td className="p-3">{u.level || '—'}</td>
                              <td className="p-3">{u.stream || '—'}</td>
                              <td className="p-3">{u.college || '—'}</td>
                              <td className="p-3 text-cyan-400">{u.tasks_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}

              {/* ─── COURSES ─── */}
              {activeTab === 'courses' && (
                <section className="rounded-2xl border border-purple-500/30 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                      <span className="text-xl">📚</span> Courses ({courses.length})
                    </h2>
                    <button
                      onClick={() => setShowAddCourse(true)}
                      className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/40 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/60"
                    >
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative">➕ Add Course</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map(c => (
                      <div key={c.id} className="group relative overflow-hidden rounded-xl border border-purple-500/30 bg-purple-950/40 p-4 transition-all duration-300 hover:scale-105 hover:border-purple-400/60">
                        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-2xl group-hover:opacity-40" />
                        <div className="relative">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="rounded-full bg-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-200">
                              {c.level}
                            </span>
                            <button
                              onClick={() => handleDeleteCourse(c.id)}
                              className="rounded-lg p-1.5 text-red-400 opacity-0 transition hover:bg-red-500/20 group-hover:opacity-100"
                            >
                              🗑
                            </button>
                          </div>
                          <h3 className="font-bold">{c.course_name}</h3>
                          <p className="mt-1 text-xs text-purple-300/70">{c.school}</p>
                          <p className="mt-2 text-[10px] text-purple-400">
                            {c.subjects?.length || 0} subjects
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ─── CHAPTERS ─── */}
              {activeTab === 'chapters' && (
                <section className="rounded-2xl border border-purple-500/30 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                      <span className="text-xl">📖</span> Chapters ({chapters.length})
                    </h2>
                    <button
                      onClick={() => setShowAddChapter(true)}
                      className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/40 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/60"
                    >
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative">➕ Add Chapter</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {chapters.map(c => (
                      <div key={c.id} className="group relative overflow-hidden rounded-xl border border-purple-500/30 bg-purple-950/40 p-4 transition-all duration-300 hover:scale-105 hover:border-purple-400/60">
                        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-20 blur-2xl group-hover:opacity-40" />
                        <div className="relative">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="rounded-full bg-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-200">
                              {c.level}
                            </span>
                            <button
                              onClick={() => handleDeleteChapter(c.id)}
                              className="rounded-lg p-1.5 text-red-400 opacity-0 transition hover:bg-red-500/20 group-hover:opacity-100"
                            >
                              🗑
                            </button>
                          </div>
                          <h3 className="font-bold">{c.chapter}</h3>
                          <p className="mt-1 text-xs text-purple-300/70">{c.subject}</p>
                          <p className="mt-2 text-[10px] text-purple-400">
                            {c.topics_count} topics • {c.difficulty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {/* ═══ TOAST ═══ */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-purple-400/50 bg-[#101d48] px-6 py-4 text-sm font-medium shadow-2xl shadow-purple-500/40 backdrop-blur-xl animate-pulse">
          {toast}
        </div>
      )}

      {/* ═══ ADD COURSE MODAL ═══ */}
      {showAddCourse && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowAddCourse(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
        >
          <div className="w-full max-w-md rounded-2xl border border-purple-400/40 bg-gradient-to-br from-[#1a1259] to-[#0d0524] p-6 shadow-2xl shadow-purple-500/40">
            <h2 className="mb-5 text-xl font-bold">
              📚 Add New Course
            </h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <input
                type="text"
                placeholder="Course name"
                value={newCourse.course_name}
                onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
                required
                className="w-full rounded-xl border border-purple-500/40 bg-purple-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
              <input
                type="text"
                placeholder="Level (e.g., Class 12)"
                value={newCourse.level}
                onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                required
                className="w-full rounded-xl border border-purple-500/40 bg-purple-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
              <input
                type="text"
                placeholder="Stream (e.g., Science)"
                value={newCourse.stream}
                onChange={(e) => setNewCourse({ ...newCourse, stream: e.target.value })}
                className="w-full rounded-xl border border-purple-500/40 bg-purple-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
              <input
                type="text"
                placeholder="School name"
                value={newCourse.school}
                onChange={(e) => setNewCourse({ ...newCourse, school: e.target.value })}
                className="w-full rounded-xl border border-purple-500/40 bg-purple-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
              <input
                type="text"
                placeholder="Subjects (comma separated)"
                value={newCourse.subjects}
                onChange={(e) => setNewCourse({ ...newCourse, subjects: e.target.value })}
                className="w-full rounded-xl border border-purple-500/40 bg-purple-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="flex-1 rounded-xl border border-purple-500/40 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-semibold shadow-lg shadow-emerald-500/40 transition hover:scale-105"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative">✅ Add Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ ADD CHAPTER MODAL ═══ */}
      {showAddChapter && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowAddChapter(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
        >
          <div className="w-full max-w-md rounded-2xl border border-purple-400/40 bg-gradient-to-br from-[#1a1259] to-[#0d0524] p-6 shadow-2xl shadow-purple-500/40">
            <h2 className="mb-5 text-xl font-bold">
              📖 Add New Chapter
            </h2>
            <form onSubmit={handleAddChapter} className="space-y-4">
              <input
                type="text"
                placeholder="Subject (e.g., Mathematics)"
                value={newChapter.subject}
                onChange={(e) => setNewChapter({ ...newChapter, subject: e.target.value })}
                required
                className="w-full rounded-xl border border-purple-500/40 bg-purple-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
              <input
                type="text"
                placeholder="Level (e.g., Class 12)"
                value={newChapter.level}
                onChange={(e) => setNewChapter({ ...newChapter, level: e.target.value })}
                required
                className="w-full rounded-xl border border-purple-500/40 bg-purple-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
              <input
                type="text"
                placeholder="Chapter name"
                value={newChapter.chapter}
                onChange={(e) => setNewChapter({ ...newChapter, chapter: e.target.value })}
                required
                className="w-full rounded-xl border border-purple-500/40 bg-purple-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
              <select
                value={newChapter.difficulty}
                onChange={(e) => setNewChapter({ ...newChapter, difficulty: e.target.value })}
                className="w-full cursor-pointer rounded-xl border border-purple-500/40 bg-purple-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400"
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="flex-1 rounded-xl border border-purple-500/40 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-semibold shadow-lg shadow-emerald-500/40 transition hover:scale-105"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative">✅ Add Chapter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard