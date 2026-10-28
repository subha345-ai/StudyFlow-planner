import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Search() {
  const [searchBy, setSearchBy] = useState('subject')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [activeCard, setActiveCard] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [userTasks, setUserTasks] = useState([])
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id')

  // ═══ Fetch data ═══
  useEffect(() => {
    if (!userId) return

    API.get(`/api/tasks?user_id=${userId}`)
      .then(res => setUserTasks(res.data.tasks || []))
      .catch(err => console.error(err))

    API.get('/api/courses')
      .then(res => {
        const allSubjects = new Set()
        ;(res.data.courses || []).forEach(c => {
          c.subjects.forEach(s => allSubjects.add(s))
        })
        setSubjects(Array.from(allSubjects))
      })
      .catch(err => console.error(err))
  }, [userId])

  // ═══ Search handler ═══
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)
    setError('')
    setResults([])

    try {
      let url = ''
      const q = encodeURIComponent(query.trim())

      if (searchBy === 'student') url = `/api/search/student?name=${q}`
      else if (searchBy === 'subject') url = `/api/search/subject?name=${q}`
      else if (searchBy === 'class') url = `/api/search/class?level=${q}`
      else if (searchBy === 'college') url = `/api/search/college?name=${q}`

      const res = await API.get(url)
      setResults(res.data.results || [])
    } catch (err) {
      console.error(err)
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ═══ Quick searches ═══
  const quickSearches = [
    { label: 'Mathematics', icon: '📐', color: 'text-blue-300 border-blue-500/40 bg-blue-500/10' },
    { label: 'Physics', icon: '⚛️', color: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
    { label: 'Chemistry', icon: '🧪', color: 'text-purple-300 border-purple-500/40 bg-purple-500/10' },
    { label: 'English', icon: '📖', color: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
  ]

  // ═══ Explore Cards ═══
  const exploreCards = [
    {
      id: 'subjects',
      icon: '📖',
      title: 'Popular subjects',
      desc: 'Explore trending school subjects and top learning resources.',
      accent: 'blue',
      footer: [
        { icon: '👥', text: `${subjects.length}+ subjects` },
        { icon: '📚', text: '500+ resources' },
      ],
    },
    {
      id: 'groups',
      icon: '👥',
      title: 'Study strategies',
      desc: 'Best strategies for each subject to improve your grades.',
      accent: 'purple',
      footer: [
        { icon: '📚', text: '5 strategies' },
        { icon: '🎯', text: 'Subject-wise' },
      ],
    },
    {
      id: 'recommend',
      icon: '✨',
      title: 'Smart recommendations',
      desc: 'Personalized suggestions based on your progress and tasks.',
      accent: 'cyan',
      footer: [
        { icon: '🧠', text: 'Smart' },
        { icon: '📊', text: 'Real-time' },
      ],
    },
  ]

  // ═══ Stats ═══
  const completedCount = userTasks.filter(t => t.completed).length
  const pendingCount = userTasks.length - completedCount
  const progressPercent = userTasks.length > 0
    ? Math.round((completedCount / userTasks.length) * 100)
    : 0

  const subjectStats = {}
  userTasks.forEach(t => {
    if (!subjectStats[t.subject]) subjectStats[t.subject] = { total: 0, done: 0 }
    subjectStats[t.subject].total++
    if (t.completed) subjectStats[t.subject].done++
  })

  const weakSubjects = Object.entries(subjectStats)
    .filter(([_, s]) => s.done / s.total < 0.5)
    .map(([name, s]) => ({ name, ...s }))

  // ═══ Accent color map ═══
  const accentMap = {
    blue: {
      card: 'border-blue-500/40 hover:border-blue-400',
      bg: 'from-blue-900/30 to-cyan-900/20',
      icon: 'from-blue-500 to-cyan-500',
      text: 'text-blue-300',
    },
    purple: {
      card: 'border-purple-500/40 hover:border-purple-400',
      bg: 'from-purple-900/30 to-pink-900/20',
      icon: 'from-purple-500 to-pink-500',
      text: 'text-purple-300',
    },
    cyan: {
      card: 'border-cyan-500/40 hover:border-cyan-400',
      bg: 'from-cyan-900/30 to-blue-900/20',
      icon: 'from-cyan-500 to-blue-500',
      text: 'text-cyan-300',
    },
  }

  return (
    <div className="dashboard-shell water-flow-enabled relative isolate min-h-screen bg-transparent font-inter text-[#eef5ff]">

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">

          {/* ═══ HERO ═══ */}
          <section className="interactive-card dashboard-reveal mb-5 flex items-center gap-5 rounded-3xl border border-[#1b3b6c] bg-gradient-to-r from-[#071934]/90 via-[#08152f]/90 to-[#111747]/90 p-5 shadow-xl shadow-blue-950/20 backdrop-blur-xl sm:p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#04b9ff] to-[#4b31ff] text-2xl shadow-[0_0_35px_#087cff55] sm:h-16 sm:w-16 sm:text-3xl">
              🔍
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                Discover &amp; <span className="text-[#4c9dff]">Search</span>
              </h1>
              <p className="mt-1 text-xs text-[#b8d0f4] sm:text-sm">
                Find subjects, classmates, study resources, and learning paths.
              </p>
            </div>
            <div className="hidden items-center gap-4 lg:flex">
              <p
                className="text-lg italic text-[#a99aff]"
                style={{ transform: 'rotate(-7deg)', fontFamily: 'Caveat, cursive', lineHeight: 1.4 }}
              >
                Explore<br />Learn<br />Grow
              </p>
              <span className="text-5xl drop-shadow-[0_0_15px_#12d9ff40]">🪴</span>
            </div>
          </section>

          {/* ═══ SEARCH FORM ═══ */}
          <form
            onSubmit={handleSearch}
            className="interactive-card mb-6 rounded-3xl border border-[#304e92] bg-gradient-to-br from-[#081a37]/90 via-[#07152f]/90 to-[#0b1737]/90 p-5 shadow-[0_0_25px_#3a31ff12] backdrop-blur-xl sm:p-6"
          >
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Category */}
              <div className="lg:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-[#e0ebff]">
                  Search category
                </label>
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#204777] bg-[#07152d] px-4 py-3 text-sm text-[#eaf3ff] outline-none transition focus:border-[#367cff] focus:ring-2 focus:ring-[#227cff20]"
                >
                  <option value="subject">📖 Subject</option>
                  <option value="student">👤 Student Name</option>
                  <option value="class">🎓 Class / Level</option>
                  <option value="college">🏫 School</option>
                </select>
              </div>

              {/* Query */}
              <div className="lg:col-span-5">
                <label className="mb-2 block text-sm font-semibold text-[#e0ebff]">
                  Search query
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#8fb7ff]">
                    ⌕
                  </span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Math, Physics, Chemistry..."
                    className="w-full rounded-xl border border-[#204777] bg-[#07152d] py-3 pl-12 pr-4 text-sm text-[#eaf3ff] outline-none transition placeholder:text-[#829cc4] focus:border-[#367cff] focus:ring-2 focus:ring-[#227cff20]"
                  />
                </div>
              </div>

              {/* Button */}
              <div className="flex items-end lg:col-span-3">
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="shine-button relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-sm font-bold text-white shadow-[0_0_20px_#346bff40] transition hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_28px_#346bff80] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Searching...
                    </>
                  ) : (
                    <>🔍 Search ➜</>
                  )}
                </button>
              </div>
            </div>

            {/* Quick searches */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#1b3b6c] pt-4 sm:gap-3">
              <span className="text-xs font-semibold text-[#d9e6ff] sm:text-sm">
                Quick search:
              </span>
              {quickSearches.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setQuery(q.label); setSearchBy('subject') }}
                  className={`shine-button relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 sm:gap-2 sm:px-4 ${q.color}`}
                >
                  <span className="text-sm sm:text-base">{q.icon}</span>
                  {q.label}
                </button>
              ))}
            </div>
          </form>

          {/* ═══ RESULTS ═══ */}
          {searched && (
            <div className="interactive-card mb-8 rounded-3xl border border-[#214679] bg-[#071831]/90 p-5 shadow-xl shadow-blue-950/20 backdrop-blur-xl sm:p-6">
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold sm:text-xl">
                📊 Results
                <span className="rounded-full bg-[#168bff]/20 px-3 py-1 text-sm text-[#79baff]">
                  {results.length}
                </span>
              </h2>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                  ⚠️ {error}
                </div>
              )}

              {loading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#168bff] border-t-transparent" />
                  <p className="mt-3 text-sm text-[#9db6dc]">Searching...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-4xl">🔍</p>
                  <p className="mt-3 font-medium text-[#b8d0f4]">
                    No results found for "{query}"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="interactive-card rounded-2xl border border-[#1b3b6c] bg-[#081a37]/90 p-4 backdrop-blur-xl sm:p-5"
                    >
                      {searchBy === 'student' && (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#168bff] to-[#713cff] text-lg font-bold text-white">
                              {item.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-[#79baff]">{item.name}</h3>
                              <p className="text-xs text-[#9db6dc]">
                                🎓 {item.level || 'N/A'} • {item.stream || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-[#a9c5eb]">🏫 {item.college || 'N/A'}</p>
                        </>
                      )}

                      {searchBy === 'subject' && (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#713cff] to-[#d946ef] text-2xl">
                              📖
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-[#c28cff]">{item.subject}</h3>
                              <p className="text-xs text-[#9db6dc]">📚 {item.course_name}</p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-[#a9c5eb]">🏫 {item.college}</p>
                        </>
                      )}

                      {(searchBy === 'class' || searchBy === 'college') && (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#168bff] to-[#713cff] text-2xl text-white">
                              🎓
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-[#79baff]">{item.course_name}</h3>
                              <p className="text-xs text-[#9db6dc]">
                                🎓 {item.level} • {item.stream}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-[#a9c5eb]">🏫 {item.college}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ EXPLORE HEADING ═══ */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl text-[#8c7aff]">✦</span>
            <div>
              <h2 className="text-lg font-bold text-[#d9f6ff] sm:text-xl">Explore learning</h2>
              <p className="text-xs text-[#91b1d9] sm:text-sm">
                Discover resources and find the right path for you.
              </p>
            </div>
          </div>

          {/* ═══ EXPLORE CARDS ═══ */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {exploreCards.map((card, i) => {
              const acc = accentMap[card.accent]
              return (
                <div
                  key={i}
                  onClick={() => setActiveCard(activeCard === card.id ? null : card.id)}
                  className={`interactive-card group relative cursor-pointer overflow-hidden rounded-2xl border bg-gradient-to-br p-5 ${acc.card} ${acc.bg} ${
                    activeCard === card.id ? 'ring-2 ring-[#248dff]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${acc.icon}`}>
                      <span className="text-2xl">{card.icon}</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#204d88] bg-[#081a37] text-sm text-[#dceaff]">
                      {activeCard === card.id ? '↓' : '→'}
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#eef5ff]">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#a9c5eb]">{card.desc}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">
                    {card.footer.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-1 text-xs text-[#b4cff4]">
                        <span>{f.icon}</span>
                        <span>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ═══ CARD DETAILS ═══ */}

          {/* 📖 Popular Subjects */}
          {activeCard === 'subjects' && (
            <div className="interactive-card mt-6 rounded-2xl border border-[#0869a4] bg-[#071a38]/90 p-5 shadow-lg backdrop-blur-xl sm:p-6">
              <h3 className="mb-4 text-lg font-bold text-[#d9f6ff]">📖 Popular Subjects</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {subjects.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchBy('subject')
                      setQuery(sub)
                      handleSearch({ preventDefault: () => {} })
                    }}
                    className="shine-button relative rounded-xl border border-[#1b3b6c] bg-[#081a37] p-3 text-left transition hover:border-[#248dff] hover:bg-[#0c2042] sm:p-4"
                  >
                    <div className="mb-2 text-xl sm:text-2xl">📘</div>
                    <p className="text-xs font-semibold text-[#eef5ff] sm:text-sm">{sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 👥 Study Strategies */}
          {activeCard === 'groups' && (
            <div className="interactive-card mt-6 rounded-2xl border border-[#5635a8] bg-[#0d1738]/90 p-5 shadow-lg backdrop-blur-xl sm:p-6">
              <h3 className="mb-4 text-lg font-bold text-[#eef5ff]">👥 Study Strategies</h3>
              <div className="space-y-3">
                {[
                  { topic: 'Mathematics', strategy: 'Practice 10 problems daily', priority: 'High' },
                  { topic: 'Physics', strategy: 'Focus on numericals + concepts', priority: 'High' },
                  { topic: 'Chemistry', strategy: 'Memorize reactions + periodic table', priority: 'Medium' },
                  { topic: 'English', strategy: 'Read 20 min daily + write essays', priority: 'Medium' },
                ].map((g, i) => (
                  <div key={i} className="interactive-card flex flex-wrap items-center gap-3 rounded-xl border border-[#1b3b6c] bg-[#081a37] p-3 sm:p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#9b42ff] to-[#d946ef] text-sm font-bold text-white sm:h-10 sm:w-10">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#eef5ff]">{g.topic}</p>
                      <p className="text-xs text-[#a9c5eb]">{g.strategy}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold sm:px-3 sm:py-1 sm:text-xs ${
                      g.priority === 'High'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {g.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✨ Smart Recommendations */}
          {activeCard === 'recommend' && (
            <div className="interactive-card mt-6 rounded-2xl border border-[#087d91] bg-[#061d37]/90 p-5 shadow-lg backdrop-blur-xl sm:p-6">
              <h3 className="mb-4 text-lg font-bold text-[#eef5ff]">✨ Smart Recommendations</h3>

              {/* Progress */}
              <div className="mb-5 rounded-xl border border-[#1b3b6c] bg-gradient-to-r from-[#0a2146] to-[#14164c] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#d9f6ff]">Your Progress</span>
                  <span className="text-2xl font-bold text-[#70eaff]">{progressPercent}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#030b1e]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#168bff] to-[#713cff] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-[#9db6dc]">
                  {completedCount} of {userTasks.length} tasks completed
                </p>
              </div>

              {weakSubjects.length > 0 && (
                <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
                  <p className="mb-2 text-sm font-bold text-red-300">⚠️ Focus More On:</p>
                  <div className="flex flex-wrap gap-2">
                    {weakSubjects.map((s, i) => (
                      <span key={i} className="rounded-full bg-[#081a37] px-3 py-1 text-xs font-semibold text-red-300">
                        {s.name} ({s.done}/{s.total})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pendingCount > 0 && (
                <div className="mb-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4">
                  <p className="text-sm font-bold text-yellow-300">
                    📝 You have <strong>{pendingCount}</strong> pending tasks!
                  </p>
                </div>
              )}

              {progressPercent >= 80 && progressPercent < 100 && (
                <div className="mb-3 rounded-xl border border-green-500/40 bg-green-500/10 p-4">
                  <p className="text-sm font-bold text-green-300">
                    🎉 Great job! Take the final exam to reach 100%!
                  </p>
                </div>
              )}

              {progressPercent === 100 && (
                <div className="mb-3 rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
                  <p className="text-sm font-bold text-blue-300">
                    🏆 All tasks completed! Try a new chapter!
                  </p>
                </div>
              )}

              {userTasks.length === 0 && (
                <div className="rounded-xl border border-[#1b3b6c] bg-[#081a37] p-4">
                  <p className="text-sm font-bold text-[#b8d0f4]">
                    🚀 Start by adding your first task in the Tasks section!
                  </p>
                </div>
              )}
            </div>
          )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
        .hand { font-family: 'Caveat', cursive; }
      `}</style>
    </div>
  )
}

export default Search