import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Subjects() {
  const [myLevel, setMyLevel] = useState('')
  const [myStream, setMyStream] = useState('')
  const [myCollege, setMyCollege] = useState('')
  const [mySubjects, setMySubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id')
  const userName = localStorage.getItem('user_name') || 'Student'

  useEffect(() => {
    if (!userId) {
      navigate('/')
      return
    }

    // ⭐ Fetch user profile
    API.get('/api/me')
      .then(res => {
        console.log('🔍 ME RESPONSE:', res.data)
        const level = res.data.level || ''
        const stream = res.data.stream || ''
        const college = res.data.college || ''

        setMyLevel(level)
        setMyStream(stream)
        setMyCollege(college)

        // ⭐ Fetch courses
        return API.get('/api/courses')
      })
      .then(res => {
        const courses = res.data.courses || []
        console.log('🔍 COURSES:', courses)

        // Filter by user's level
        const matched = courses.filter(c =>
          myLevel && c.level.toLowerCase().includes(myLevel.toLowerCase())
        )

        const subjectsSet = new Set()
        matched.forEach(c => {
          c.subjects.forEach(s => subjectsSet.add(s))
        })

        setMySubjects(Array.from(subjectsSet))
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ ERROR:', err)
        setLoading(false)
      })
  }, [userId, navigate])

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_name')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#070d1f] text-[#f0f5ff] font-inter relative overflow-hidden">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#263c75]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#502080]/15 blur-3xl" />
      </div>

      {/* ===== TOP BAR ===== */}
      <header className="relative z-10 flex h-[78px] items-center justify-between border-b border-[#16284a] bg-[#070d1f]/95 px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="grid h-[42px] w-[42px] place-items-center rounded-[13px] bg-gradient-to-br from-[#167fff] to-[#783fff] text-2xl shadow-[0_0_30px_#367aff80,0_0_60px_#367aff40]">
            📚
          </div>
          <h1 className="text-[25px] font-extrabold tracking-tight text-white">
            Study<span className="text-[#65a1ff]">Flow</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-[#1e355e] bg-[#0c1730] py-[6px] pl-[6px] pr-[14px] transition hover:border-[#347cff] hover:shadow-[0_0_20px_#347cff40]">
            <div className="grid h-[32px] w-[32px] place-items-center rounded-full bg-[#132a54] text-sm text-[#65a1ff] shadow-[0_0_15px_#347cff40]">
              👤
            </div>
            <span className="text-sm font-medium text-white">{userName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-[10px] border border-[#5b1f3a] bg-transparent px-4 py-2 text-sm font-medium text-[#ff6685] transition hover:border-[#a33e65] hover:bg-[#2a0f22] hover:shadow-[0_0_20px_#ff668540]"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-78px)]">
        {/* ===== SIDEBAR ===== */}
        <aside className="hidden w-[258px] flex-col border-r border-[#16284a] bg-[#070d1f] p-6 lg:flex">
          <nav className="grid gap-2">
            {[
              { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
              { icon: '🔍', label: 'Search', path: '/search' },
              { icon: '🗓️', label: 'Schedule', path: '/schedule' },
              { icon: '✅', label: 'Tasks', path: '/tasks' },
              { icon: '⏱️', label: 'Pomodoro', path: '/pomodoro' },
              { icon: '📊', label: 'Progress', path: '/progress' },
              { icon: '📖', label: 'Subjects', path: '/subjects', active: true },
              { icon: '🎓', label: 'Chapters', path: '/chapters' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`flex min-h-[50px] items-center gap-4 rounded-[12px] border px-[17px] text-sm font-medium transition ${
                  item.active
                    ? 'border-[#1a3a6e] bg-[#0f2040] font-bold text-[#65a1ff] shadow-[inset_0_0_20px_#347cff20]'
                    : 'border-transparent text-[#8fa5c9] hover:bg-[#0c1730] hover:text-white'
                }`}
              >
                <span className="w-[25px] text-center text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="min-w-0 flex-1 p-8">
          {/* Page Heading */}
          <div className="mb-6">
            <h1 className="text-[32px] font-extrabold tracking-tight text-white">
              My Subjects
            </h1>
            <p className="mt-1 text-[14px] text-[#8fa5c9]">
              Subjects based on your level
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#347cff] border-t-transparent shadow-[0_0_20px_#347cff60]" />
              <p className="mt-3 text-sm text-[#8fa5c9]">Loading subjects...</p>
            </div>
          ) : (
            <>
              {/* ===== User Info Card ===== */}
              <div className="mb-6 rounded-[16px] border border-[#1e355e] bg-[#0c1730] p-6 shadow-[0_0_30px_#347cff10]">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Class / Level */}
                  <div className="flex items-center gap-4">
                    <div className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[12px] bg-[#132a54] text-2xl text-[#65a1ff] shadow-[0_0_15px_#347cff30]">
                      🎓
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#8fa5c9]">Class/Level</p>
                      <p className={`text-[15px] font-bold ${myLevel ? 'text-[#00d2ff]' : 'text-[#8fa5c9]'}`}>
                        {myLevel || 'Not set'}
                      </p>
                      <div className="mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#00d2ff] to-transparent opacity-50"></div>
                    </div>
                  </div>

                  {/* Stream */}
                  <div className="flex items-center gap-4 md:border-l md:border-[#1e355e] md:pl-6">
                    <div className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[12px] bg-[#132a54] text-2xl text-[#65a1ff] shadow-[0_0_15px_#347cff30]">
                      🧭
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#8fa5c9]">Stream</p>
                      <p className={`text-[15px] font-bold ${myStream ? 'text-[#00d2ff]' : 'text-[#8fa5c9]'}`}>
                        {myStream || 'Not set'}
                      </p>
                      <div className="mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#00d2ff] to-transparent opacity-50"></div>
                    </div>
                  </div>

                  {/* School */}
                  <div className="flex items-center gap-4 md:border-l md:border-[#1e355e] md:pl-6">
                    <div className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[12px] bg-[#132a54] text-2xl text-[#65a1ff] shadow-[0_0_15px_#347cff30]">
                      🏫
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#8fa5c9]">School</p>
                      <p className={`text-[15px] font-bold ${myCollege ? 'text-[#00d2ff]' : 'text-[#8fa5c9]'}`}>
                        {myCollege || 'Not set'}
                      </p>
                      <div className="mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#00d2ff] to-transparent opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Subjects ===== */}
              {mySubjects.length === 0 ? (
                <div className="rounded-[16px] border border-[#1e355e] bg-[#0c1730] p-10 shadow-[0_0_30px_#347cff10]">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Warning Icon */}
                    <div className="mb-6 grid h-[70px] w-[70px] place-items-center rounded-full border border-[#2a4a7a] bg-[#0f2040] text-3xl text-[#65a1ff] shadow-[0_0_25px_#347cff40,inset_0_0_20px_#347cff20]">
                      ⚠️
                    </div>

                    <p className="max-w-md text-[15px] leading-relaxed text-[#c5d6f3]">
                      No subjects found for your level –<br />
                      please set your class/level in profile setup
                    </p>

                    <button
                      onClick={() => navigate('/profile')}
                      className="mt-6 flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#1e6bff] to-[#00d2ff] px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_#00d2ff60,0_0_50px_#00d2ff30] transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_35px_#00d2ff,0_0_70px_#00d2ff50]"
                    >
                      Setup Profile <span className="text-lg">→</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mySubjects.map((subject, i) => (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-[16px] border border-[#1e355e] bg-[#0c1730] p-5 shadow-[0_0_30px_#347cff10] transition hover:-translate-y-1 hover:border-[#347cff] hover:shadow-[0_0_40px_#347cff30]"
                    >
                      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#347cff]/20 to-[#9655ff]/20 blur-xl transition group-hover:scale-150" />
                      <div className="relative">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#347cff] to-[#9655ff] text-2xl shadow-[0_0_20px_#347cff60]">
                          📖
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {subject}
                        </h3>
                        <p className="mt-1 text-xs text-[#8fa5c9]">{myLevel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Subjects