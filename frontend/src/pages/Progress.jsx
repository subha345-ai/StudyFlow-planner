import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Progress() {
  const [tasks, setTasks] = useState([])
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    if (!userId) return navigate('/')

    Promise.all([
      API.get(`/api/tasks?user_id=${userId}`),
      API.get(`/api/progress?user_id=${userId}`),
    ])
      .then(([tasksRes, progRes]) => {
        setTasks(tasksRes.data.tasks || [])
        setProgress(progRes.data.progress_percent || 0)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [navigate, userId])

  // Subject-wise stats
  const subjectStats = {}
  tasks.forEach(t => {
    if (!subjectStats[t.subject]) subjectStats[t.subject] = { total: 0, done: 0 }
    subjectStats[t.subject].total++
    if (t.completed) subjectStats[t.subject].done++
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = totalTasks - completedTasks

  // Progress bar width calculation (for stat cards)
  const totalPercent = totalTasks > 0 ? 100 : 0
  const pendingPercent = totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0
  const completedPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

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
              Progress
            </h1>
            <p className="mt-1 text-[14px] text-[#8fa5c9]">
              Track your study flow
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#347cff] border-t-transparent shadow-[0_0_20px_#347cff60]" />
              <p className="mt-3 text-sm text-[#8fa5c9]">Loading...</p>
            </div>
          ) : (
            <>
              {/* ===== Stats Cards ===== */}
              <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Total Tasks */}
                <div className="interactive-card relative overflow-hidden rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-5 shadow-[0_0_30px_#347cff10] backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-[42px] w-[42px] place-items-center rounded-[12px] bg-[#132a54] text-xl text-[#64a2ff]">
                      📋
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#8fa5c9]">Total Tasks</p>
                      <p className="text-3xl font-extrabold text-white">{totalTasks}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-[#8fa5c9]">All tasks</p>
                  <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-[#132a54]">
                    <div className="h-full rounded-full bg-[#347cff] shadow-[0_0_10px_#347cff]" style={{ width: `${totalPercent}%` }}></div>
                  </div>
                </div>

                {/* Pending */}
                <div className="interactive-card relative overflow-hidden rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-5 shadow-[0_0_30px_#9655ff10] backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-[42px] w-[42px] place-items-center rounded-[12px] bg-[#1e1740] text-xl text-[#a57dff]">
                      🕒
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#8fa5c9]">Pending</p>
                      <p className="text-3xl font-extrabold text-white">{pendingTasks}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-[#8fa5c9]">Awaiting completion</p>
                  <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-[#1e1740]">
                    <div className="h-full rounded-full bg-[#9655ff] shadow-[0_0_10px_#9655ff]" style={{ width: `${pendingPercent}%` }}></div>
                  </div>
                </div>

                {/* Completed */}
                <div className="interactive-card relative overflow-hidden rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-5 shadow-[0_0_30px_#39e6ae10] backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-[42px] w-[42px] place-items-center rounded-[12px] bg-[#0d2e2a] text-xl text-[#39e6ae]">
                      ✅
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#8fa5c9]">Completed</p>
                      <p className="text-3xl font-extrabold text-white">{completedTasks}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-[#8fa5c9]">Tasks completed</p>
                  <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-[#0d2e2a]">
                    <div className="h-full rounded-full bg-[#39e6ae] shadow-[0_0_10px_#39e6ae]" style={{ width: `${completedPercent}%` }}></div>
                  </div>
                </div>
              </div>

              {/* ===== Overall Progress ===== */}
              <div className="interactive-card mb-6 rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-6 shadow-[0_0_40px_#347cff10] backdrop-blur-xl">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                  <div className="w-full md:w-1/2">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xl text-[#347cff]">📈</span>
                      <h2 className="text-lg font-bold text-white">Overall Progress</h2>
                    </div>
                    <p className="text-[13px] text-[#8fa5c9]">Your study journey overview</p>
                    
                    <div className="mt-5 flex items-center gap-3 rounded-[10px] border border-[#1e355e] bg-[#0a142a] px-4 py-3">
                      <span className="text-[#347cff]">📈</span>
                      <p className="text-[12px] text-[#c5d6f3]">Keep going! Every task brings you closer.</p>
                    </div>
                  </div>

                  {/* Circular Progress Ring */}
                  <div className="relative h-[150px] w-[150px] shrink-0">
                    <svg className="h-[150px] w-[150px] -rotate-90 transform">
                      <circle cx="75" cy="75" r="65" stroke="#132a54" strokeWidth="10" fill="none" />
                      <circle
                        cx="75"
                        cy="75"
                        r="65"
                        stroke="url(#progressGradient)"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${(progress / 100) * 408.4} 408.4`}
                        strokeLinecap="round"
                        style={{
                          transition: 'stroke-dasharray 0.5s',
                          filter: 'drop-shadow(0 0 6px #00d2ff) drop-shadow(0 0 12px #00d2ff80)'
                        }}
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00d2ff" />
                          <stop offset="100%" stopColor="#3a7bd5" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(0,210,255,0.6)]">
                        {progress}%
                      </span>
                      <span className="mt-1 text-[11px] font-medium text-[#8fa5c9]">
                        {completedTasks}/{totalTasks} Tasks Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Subject-wise Progress ===== */}
              <div className="interactive-card rounded-[16px] border border-[#1e355e] bg-[#0c1730]/85 p-6 shadow-[0_0_30px_#347cff10] backdrop-blur-xl">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl text-[#347cff]">📖</span>
                  <h2 className="text-lg font-bold text-white">Subject-wise Progress</h2>
                </div>
                <p className="mb-6 text-[13px] text-[#8fa5c9]">Track progress across all your subjects.</p>

                {Object.keys(subjectStats).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="mb-4 grid h-[70px] w-[70px] place-items-center rounded-[16px] border border-[#1e355e] bg-[#0a142a] text-4xl shadow-[0_0_20px_#347cff20]">
                      📊
                    </div>
                    <p className="text-sm text-[#8fa5c9]">
                      No tasks yet. Add tasks to see your study flow!
                    </p>
                    <button
                      onClick={() => navigate('/tasks')}
                      className="shine-button relative mt-6 flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_#00d2ff60,0_0_50px_#00d2ff30] transition hover:-translate-y-0.5 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_35px_#00d2ff,0_0_70px_#00d2ff50]"
                    >
                      + Add Task
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {Object.entries(subjectStats).map(([subject, stats]) => {
                      const percent = Math.round((stats.done / stats.total) * 100)
                      return (
                        <div key={subject}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{subject}</span>
                            <span className="text-xs text-[#8fa5c9]">
                              {stats.done}/{stats.total} ({percent}%)
                            </span>
                          </div>
                          <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#132a54]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                percent >= 80
                                  ? 'bg-gradient-to-r from-[#39e6ae] to-[#0fcba1] shadow-[0_0_15px_#39e6ae80]'
                                  : percent >= 50
                                  ? 'bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] shadow-[0_0_15px_#00d2ff80]'
                                  : 'bg-gradient-to-r from-[#ffc857] to-[#ff9f43] shadow-[0_0_15px_#ffc85780]'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
    </div>
  )
}

export default Progress