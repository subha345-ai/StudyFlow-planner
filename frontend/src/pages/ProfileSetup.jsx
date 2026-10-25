import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

const streams = [
  { name: 'Science', icon: '🔬' },
  { name: 'Commerce', icon: '💼' },
  { name: 'Arts', icon: '🎨' },
]

const features = [
  {
    icon: '🎓',
    title: 'Personalized Learning',
    desc: 'Get content based on your class and stream.',
    color: 'linear-gradient(135deg, #a855f7, #6d28d9)',
  },
  {
    icon: '🚀',
    title: 'Track Your Progress',
    desc: 'Stay consistent and reach your goals.',
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  },
  {
    icon: '📖',
    title: 'Smart Resources',
    desc: 'Notes, practice & more — all in one place.',
    color: 'linear-gradient(135deg, #10b981, #047857)',
  },
  {
    icon: '⭐',
    title: 'Build Your Future',
    desc: 'Learn today, achieve tomorrow.',
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
  },
]

function ProfileSetup() {
  const [level, setLevel] = useState('Class 12')
  const [stream, setStream] = useState('Science')
  const [college, setCollege] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      setTime(`${hh}:${mm}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const userId = localStorage.getItem('user_id')
    if (!userId) {
      setError('Please login first')
      setLoading(false)
      return
    }

    try {
      await API.post('/api/profile', {
        user_id: userId,
        level,
        stream,
        college,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ background: '#050520' }}
    >
      {/* ═══ MAIN CONTAINER ═══ */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: '1400px',
          height: 'min(800px, 90vh)',
          borderRadius: '28px',
          background:
            'linear-gradient(120deg, #0b1040 0%, #1a1259 45%, #2a1470 75%, #3b1a8a 100%)',
          boxShadow:
            '0 0 100px rgba(139, 92, 246, 0.5), 0 0 150px rgba(217, 70, 239, 0.3), 0 0 200px rgba(59, 130, 246, 0.2)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
        }}
      >
        {/* Glow Blobs */}
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full" style={{ background: 'rgba(99, 102, 241, 0.5)', filter: 'blur(90px)' }} />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full" style={{ background: 'rgba(217, 70, 239, 0.45)', filter: 'blur(100px)' }} />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.25)', filter: 'blur(120px)' }} />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Top-right check */}
        <div className="absolute right-5 top-4 z-30 text-lg text-indigo-300">✓</div>

        {/* Grid */}
        <div className="relative grid h-full grid-cols-12 items-center gap-6 p-6 lg:p-8">
          {/* LEFT COLUMN */}
          <div className="col-span-4 flex h-full flex-col items-center justify-center gap-6">
            <div
              className="text-center text-3xl leading-tight text-white"
              style={{
                fontFamily: 'Caveat, cursive',
                transform: 'rotate(-6deg)',
                textShadow: '0 0 20px rgba(168, 85, 247, 0.6)',
              }}
            >
              <span className="mb-1 block text-base text-yellow-300">♛</span>
              Better
              <br />
              Learning
              <br />
              Brighter
              <br />
              Future
            </div>

            <div
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{
                width: '260px',
                height: '340px',
                boxShadow: '0 20px 50px rgba(139, 92, 246, 0.6)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=90"
                alt="library"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 40%, rgba(139, 92, 246, 0.5) 100%)' }} />
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="col-span-4 flex h-full items-center justify-center">
            <div className="relative w-full max-w-[400px]">
              <div className="absolute -inset-4 rounded-[36px]" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.6), rgba(217,70,239,0.5))', filter: 'blur(35px)', animation: 'pulse 3s ease-in-out infinite' }} />

              <div className="relative rounded-[28px] p-6" style={{ background: 'linear-gradient(160deg, rgba(30,27,100,0.92) 0%, rgba(15,12,60,0.96) 100%)', border: '1.5px solid rgba(139, 92, 246, 0.7)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 0 40px rgba(139,92,246,0.3)' }}>
                {/* Header */}
                <div className="mb-4 text-center">
                  <div className="mb-2 inline-flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #3b82f6, #a855f7, #ec4899)', boxShadow: '0 0 25px rgba(168,85,247,0.8), 0 6px 25px rgba(139,92,246,0.6)' }}>
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h1 className="text-[24px] font-bold tracking-tight text-white">
                    Setup{' '}
                    <span style={{ background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Your Profile
                    </span>
                  </h1>
                  <p className="mt-1 text-xs text-indigo-200/70">Tell us about your studies 📖</p>
                </div>

                {error && (
                  <div className="mb-3 rounded-lg border border-red-400/40 bg-red-500/20 p-2 text-xs text-red-200">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-3.5">
                  {/* Class */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-indigo-100">
                      <span>📚</span> Class / Level
                    </label>
                    <div className="relative">
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                        style={{ background: 'rgba(15, 12, 60, 0.75)', border: '1.5px solid #6366f1', boxShadow: '0 0 12px rgba(99, 102, 241, 0.3)' }}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={`Class ${i + 1}`} className="bg-slate-900">
                            Class {i + 1}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-indigo-300">▼</span>
                    </div>
                  </div>

                  {/* Stream */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-indigo-100">
                      <span>🎯</span> Stream
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {streams.map((s) => {
                        const active = stream === s.name
                        return (
                          <button
                            key={s.name}
                            type="button"
                            onClick={() => setStream(s.name)}
                            className="relative flex flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] font-medium transition-all duration-300"
                            style={
                              active
                                ? { background: 'linear-gradient(135deg, rgba(16,185,129,0.6), rgba(5,150,105,0.5))', border: '1.5px solid #34d399', boxShadow: '0 0 22px rgba(52,211,153,0.7)', color: 'white' }
                                : { background: 'rgba(15, 12, 60, 0.75)', border: '1.5px solid rgba(99,102,241,0.4)', color: '#c7d2fe' }
                            }
                          >
                            {active && (
                              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-bold text-emerald-950">✓</span>
                            )}
                            <span className="text-base">{s.icon}</span>
                            <span>{s.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* School */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-indigo-100">
                      <span>🏫</span> School
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-indigo-300">🔍</span>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-indigo-300/50"
                        style={{ background: 'rgba(15, 12, 60, 0.75)', border: '1.5px solid rgba(99,102,241,0.5)', boxShadow: '0 0 12px rgba(99, 102, 241, 0.2)' }}
                        placeholder="e.g., Dhaka High School"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 disabled:opacity-50"
                    style={{ background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)', boxShadow: '0 10px 28px rgba(139,92,246,0.6), 0 0 40px rgba(217,70,239,0.3)' }}
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>Save & Continue →</>
                    )}
                  </button>
                </form>

                <p className="mt-3 text-center text-[10px] text-indigo-300/70">
                  🛡️ Your data is safe with us
                </p>

                {/* ⭐ Progress Dots — Step 3 Active */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  {/* Step 1: Login ✓ */}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] text-white shadow-lg shadow-green-500/50">
                    ✓
                  </span>
                  <span className="h-px w-6 bg-green-500" />

                  {/* Step 2: Password ✓ */}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] text-white shadow-lg shadow-green-500/50">
                    ✓
                  </span>
                  <span className="h-px w-6 bg-green-500" />

                  {/* Step 3: Profile Setup — ACTIVE */}
                  <span className="flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-[10px] font-bold text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-300/50">
                    3
                  </span>
                  <span className="h-px w-6 bg-indigo-400/40" />

                  {/* Step 4: Complete — PENDING */}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-indigo-400/40 text-[10px] text-indigo-300">
                    4
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-4 flex h-full flex-col justify-center gap-3 pl-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 hover:translate-x-1"
                style={{ background: 'rgba(30, 27, 100, 0.6)', border: '1px solid rgba(139, 92, 246, 0.4)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)' }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: f.color, boxShadow: '0 4px 15px rgba(0,0,0,0.35), 0 0 20px rgba(139, 92, 246, 0.3)' }}>
                  <span className="text-lg">{f.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                  <p className="text-[11px] leading-snug text-indigo-200/70">{f.desc}</p>
                </div>
              </div>
            ))}

            {/* Bottom quote + time */}
            <div className="mt-2 pr-4 text-right">
              <p className="text-3xl text-indigo-200" style={{ fontFamily: 'Caveat, cursive', transform: 'rotate(-6deg)', textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>
                You Got This ✨
              </p>
              <p className="mt-1 text-3xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}>
                {time}
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        `}</style>
      </div>
    </div>
  )
}

export default ProfileSetup