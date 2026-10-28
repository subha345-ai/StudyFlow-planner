import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Chapters() {
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [selectedLevel, setSelectedLevel] = useState('Class 12')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    setMounted(true)
    if (!userId) {
      navigate('/')
      return
    }

    // Fetch user's profile for default level
    API.get('/api/me')
      .then(res => {
        if (res.data.level) setSelectedLevel(res.data.level)
      })
      .catch(err => console.error(err))

    // Fetch subjects
    API.get('/api/chapters/subjects')
      .then(res => setSubjects(res.data.subjects || []))
      .catch(err => console.error(err))
  }, [navigate, userId])

  useEffect(() => {
    setLoading(true)
    let url = `/api/chapters?subject=${encodeURIComponent(selectedSubject)}`
    if (selectedLevel) url += `&level=${encodeURIComponent(selectedLevel)}`
    if (selectedDifficulty) url += `&difficulty=${selectedDifficulty}`

    API.get(url)
      .then(res => setChapters(res.data.chapters || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [selectedSubject, selectedLevel, selectedDifficulty])

  const handleStart = (chapter) => {
    navigate(`/chapter/${chapter.id}`)
  }

  const levels = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'BCA', 'BSc CSE', 'BBA']

  return (
    <div className="dashboard-shell water-flow-enabled relative isolate min-h-screen bg-transparent font-inter text-[#f0f5ff]">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-orb aurora-one" />
        <div className="aurora-orb aurora-two" />
      </div>

      <main className="relative z-10 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className={`transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            
            {/* Page Heading */}
            <div className="mb-6 flex items-center gap-4">
              <div className="grid h-[55px] w-[55px] place-items-center rounded-[17px] border border-[#3858a1] bg-gradient-to-br from-[#163d78] to-[#25205b] text-[27px] shadow-[0_0_25px_#315aff60,0_0_50px_#315aff30]">
                🎓
              </div>
              <div>
                <h1 className="text-[32px] font-extrabold tracking-tight text-white">
                  Chapters
                </h1>
                <p className="mt-1 text-[14px] text-[#8fa5c9]">
                  Select subject, level, and difficulty to see chapters.
                </p>
              </div>
            </div>

            {/* ===== Filters ===== */}
            <div className="interactive-card mb-6 grid grid-cols-1 gap-5 rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-6 shadow-[0_0_30px_#347cff10] backdrop-blur-xl md:grid-cols-3">
              {/* Subject */}
              <div>
                <label className="mb-2 block text-[12px] font-medium text-[#8fa5c9]">Subject</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#65a1ff]">
                    Σ
                  </div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-[10px] border border-[#1e355e] bg-[#0a142a] py-3 pl-10 pr-10 text-sm font-medium text-white outline-none transition focus:border-[#347cff] focus:shadow-[0_0_0_3px_#347cff20]"
                  >
                    {subjects.length > 0 ? (
                      subjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))
                    ) : (
                      <option value="Mathematics">Mathematics</option>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#8fa5c9]">
                    ▼
                  </div>
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="mb-2 block text-[12px] font-medium text-[#8fa5c9]">Level</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#65a1ff]">
                    📚
                  </div>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full appearance-none rounded-[10px] border border-[#1e355e] bg-[#0a142a] py-3 pl-10 pr-10 text-sm font-medium text-white outline-none transition focus:border-[#347cff] focus:shadow-[0_0_0_3px_#347cff20]"
                  >
                    {levels.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#8fa5c9]">
                    ▼
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="mb-2 block text-[12px] font-medium text-[#8fa5c9]">Difficulty</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#65a1ff]">
                    🎯
                  </div>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full appearance-none rounded-[10px] border border-[#1e355e] bg-[#0a142a] py-3 pl-10 pr-10 text-sm font-medium text-white outline-none transition focus:border-[#347cff] focus:shadow-[0_0_0_3px_#347cff20]"
                  >
                    <option value="">All</option>
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#8fa5c9]">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Chapters List ===== */}
            {loading ? (
              <div className="interactive-card rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 py-16 text-center shadow-[0_0_30px_#347cff10] backdrop-blur-xl">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#347cff] border-t-transparent shadow-[0_0_20px_#347cff60]" />
                <p className="mt-3 text-sm text-[#8fa5c9]">Loading chapters...</p>
              </div>
            ) : chapters.length === 0 ? (
              /* ===== Empty State (Image Design) ===== */
              <div className="interactive-card rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-10 shadow-[0_0_30px_#347cff10] backdrop-blur-xl">
                <div className="flex flex-col items-center justify-center text-center">
                  
                  {/* Mailbox Illustration */}
                  <div className="relative mb-6">
                    <div className="text-[100px] leading-none drop-shadow-[0_0_30px_rgba(52,124,255,0.4)]">
                      📫
                    </div>
                  </div>

                  <h2 className="text-[20px] font-bold text-white">
                    No chapters found – try a different subject or level.
                  </h2>

                  <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[#8fa5c9]">
                    We couldn't find any chapters matching your current filters.<br />
                    Try changing the subject, level, or difficulty.
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setSelectedSubject('Mathematics')
                        setSelectedLevel('Class 12')
                        setSelectedDifficulty('')
                      }}
                      className="shine-button relative flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_#00d2ff60,0_0_50px_#00d2ff30] transition hover:-translate-y-0.5 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_35px_#00d2ff,0_0_70px_#00d2ff50]"
                    >
                      🔄 Try a Different Subject
                    </button>
                    <button
                      onClick={() => navigate('/subjects')}
                      className="shine-button relative flex items-center gap-2 rounded-[10px] border border-[#1e355e] bg-[#0a142a] px-6 py-3 text-sm font-bold text-white transition hover:scale-105 hover:border-[#347cff] hover:shadow-[0_0_20px_#347cff60]"
                    >
                      ⭐ View All Subjects
                    </button>
                  </div>

                  {/* Quick Suggestion Chips */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setSelectedSubject('Physics')}
                      className="shine-button relative flex items-center gap-2 rounded-full border border-[#1e355e] bg-[#0a142a] px-4 py-2 text-[12px] font-medium text-[#c5d6f3] transition hover:border-[#347cff] hover:text-white"
                    >
                      <span className="text-[#65a1ff]">↻</span> Popular: Physics
                    </button>
                    <button
                      onClick={() => setSelectedLevel('Class 11')}
                      className="shine-button relative flex items-center gap-2 rounded-full border border-[#1e355e] bg-[#0a142a] px-4 py-2 text-[12px] font-medium text-[#c5d6f3] transition hover:border-[#347cff] hover:text-white"
                    >
                      <span className="text-[#65a1ff]">↻</span> Try: Class 11
                    </button>
                    <button
                      onClick={() => setSelectedDifficulty('')}
                      className="shine-button relative flex items-center gap-2 rounded-full border border-[#1e355e] bg-[#0a142a] px-4 py-2 text-[12px] font-medium text-[#c5d6f3] transition hover:border-[#347cff] hover:text-white"
                    >
                      <span className="text-[#65a1ff]">↻</span> Broaden: Set Difficulty to All
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ===== Chapters Grid ===== */
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="interactive-card group relative overflow-hidden rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-5 shadow-[0_0_30px_#347cff10] backdrop-blur-xl"
                  >
                    {/* Glow */}
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#347cff]/20 to-[#9655ff]/20 blur-2xl transition-all duration-500 group-hover:scale-150" />

                    <div className="relative">
                      {/* Icon */}
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#347cff] to-[#9655ff] text-2xl text-white shadow-[0_0_20px_#347cff60]">
                        📖
                      </div>

                      {/* Chapter name */}
                      <h3 className="text-lg font-bold text-white">
                        {chapter.chapter}
                      </h3>

                      {/* Meta */}
                      <p className="mt-1 text-xs text-[#8fa5c9]">
                        {chapter.subject} • {chapter.level}
                      </p>

                      {/* Tags */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          chapter.difficulty === 'easy' ? 'bg-[#0d2e2a] text-[#39e6ae] shadow-[0_0_10px_#39e6ae40]' :
                          chapter.difficulty === 'hard' ? 'bg-[#2e0d1a] text-[#ff6685] shadow-[0_0_10px_#ff668540]' :
                          'bg-[#2e2a0d] text-[#ffc857] shadow-[0_0_10px_#ffc85740]'
                        }`}>
                          {chapter.difficulty}
                        </span>
                        <span className="rounded-full bg-[#132a54] px-3 py-1 text-xs font-medium text-[#65a1ff] shadow-[0_0_10px_#347cff40]">
                          {chapter.topics_count} topics
                        </span>
                      </div>

                      {/* Topics preview */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {chapter.topics.slice(0, 3).map((t, i) => (
                          <span key={i} className="rounded-full bg-[#0a142a] px-2 py-0.5 text-[10px] text-[#8fa5c9]">
                            {t.name}
                          </span>
                        ))}
                        {chapter.topics.length > 3 && (
                          <span className="rounded-full bg-[#0a142a] px-2 py-0.5 text-[10px] text-[#8fa5c9]">
                            +{chapter.topics.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Start button */}
                      <button
                        onClick={() => handleStart(chapter)}
                        className="shine-button relative mt-4 w-full rounded-[10px] bg-gradient-to-r from-cyan-500 to-purple-600 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_#00d2ff40] transition hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_30px_#00d2ff,0_0_60px_#00d2ff60]"
                      >
                        Start →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
    </div>
  )
}

export default Chapters