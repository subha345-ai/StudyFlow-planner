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

  return (
    <div className="dashboard-shell water-flow-enabled relative isolate min-h-screen bg-transparent font-inter text-[#f0f5ff]">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-orb aurora-one" />
        <div className="aurora-orb aurora-two" />
      </div>

      <main className="relative z-10 min-w-0 p-4 sm:p-6 lg:p-8">
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
              <div className="interactive-card mb-6 rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-6 shadow-[0_0_30px_#347cff10] backdrop-blur-xl">
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
                <div className="interactive-card rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-10 shadow-[0_0_30px_#347cff10] backdrop-blur-xl">
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
                      className="shine-button relative mt-6 flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_#00d2ff60,0_0_50px_#00d2ff30] transition hover:-translate-y-0.5 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_35px_#00d2ff,0_0_70px_#00d2ff50]"
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
                      className="interactive-card group relative overflow-hidden rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-5 shadow-[0_0_30px_#347cff10] backdrop-blur-xl"
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
  )
}

export default Subjects