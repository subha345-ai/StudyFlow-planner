import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await API.post('/api/login', { email, password })
      localStorage.setItem('user_id', res.data.user_id)
      localStorage.setItem('user_name', res.data.name)
      if (remember) localStorage.setItem('remember', 'true')

      if (!res.data.level) {
        navigate('/profile')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#0a0428]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        .hand { font-family: 'Caveat', cursive; }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.7); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .anim-blob { animation: blob 15s ease-in-out infinite; }
        .anim-float { animation: float 5s ease-in-out infinite; }
        .anim-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .anim-sparkle { animation: sparkle 3s ease-in-out infinite; }
        .anim-border-glow { animation: border-glow 3s ease-in-out infinite; }

        .book-shadow {
          box-shadow:
            inset -10px 0 15px rgba(0,0,0,.35),
            inset 10px 0 15px rgba(255,255,255,.12),
            0 25px 45px rgba(0,0,0,.5),
            0 12px 25px rgba(0,0,0,.35);
        }

        .shine-btn::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-100%) skewX(-15deg);
        }
        .shine-btn:hover::after { animation: shine 1.2s ease-in-out; }

        .gradient-text {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0428] via-[#1a0b4e] to-[#2d1b69]" />
      <div className="anim-blob absolute -left-40 -top-20 h-[600px] w-[600px] rounded-full bg-purple-600/40 blur-[150px]" />
      <div className="anim-blob absolute -right-40 top-1/3 h-[550px] w-[550px] rounded-full bg-blue-600/35 blur-[140px]" style={{ animationDelay: '3s' }} />
      <div className="anim-blob absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full bg-pink-600/30 blur-[150px]" style={{ animationDelay: '6s' }} />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139,92,246,0.8) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="anim-sparkle absolute left-[10%] top-[15%] text-2xl text-purple-300">✦</div>
        <div className="anim-sparkle absolute right-[15%] top-[20%] text-lg text-pink-300" style={{ animationDelay: '0.7s' }}>✦</div>
        <div className="anim-sparkle absolute left-[20%] bottom-[20%] text-xl text-blue-300" style={{ animationDelay: '1.4s' }}>✦</div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 grid w-full grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center">
          <div className="relative w-full max-w-2xl px-10 py-10 text-white xl:px-14">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 opacity-70 blur-lg" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-lg shadow-lg">🎓</div>
              </div>
              <h1 className="text-xl font-bold">Study<span className="text-purple-300">Planner</span></h1>
            </div>

            {/* Heading */}
            <div className="mb-3">
              <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight xl:text-5xl">
                Plan Today
                <br />
                <span className="gradient-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Achieve Tomorrow
                </span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
                Your study. Your goals. Our planner.
                <br />
                Stay organized and build a better future.
              </p>
            </div>

            {/* ⭐ MOTIVATION QUOTE — Position UP */}
            <div className="mb-5 mt-4">
              <p className="hand text-2xl text-purple-300" style={{ transform: 'rotate(-3deg)', textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>
                "Better Students Build a Brighter Future" ✨
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                { icon: '📅', title: 'Smart Study Plans', desc: 'Set your goals & schedule', stat: '2x faster' },
                { icon: '📊', title: 'Track Progress', desc: 'See your growth', stat: '+40% retention' },
                { icon: '🎯', title: 'Achieve Goals', desc: 'Be the best version of you', stat: '95% success' },
              ].map((f, i) => (
                <div key={i} className="group flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-base ring-1 ring-purple-400/40 backdrop-blur-md transition-all group-hover:scale-110">
                    {f.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                      <span className="text-xs font-medium text-purple-300">{f.stat}</span>
                    </div>
                    <p className="text-xs text-slate-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ⭐ BOOK STACK (LEARN/PRACTICE/GROW) — Position DOWN */}
            <div className="relative mt-16 h-[220px] w-full max-w-lg">
              {/* Glow */}
              <div className="anim-float absolute bottom-0 left-1/2 h-24 w-72 -translate-x-1/2 rounded-full bg-purple-600/40 blur-[60px]" />
              {/* Ground shadow */}
              <div className="absolute bottom-0 left-1/2 h-3 w-80 -translate-x-1/2 rounded-full bg-black/70 blur-2xl" />

              {/* GROW */}
              <div className="anim-float-slow absolute bottom-0 left-1/2 w-80 -translate-x-1/2 rotate-[-4deg]">
                <div className="book-shadow overflow-hidden rounded-xl">
                  <div className="flex h-[54px] items-center justify-between bg-gradient-to-b from-[#f472b6] via-[#ec4899] to-[#be185d] px-6">
                    <span className="text-xl font-black tracking-[0.15em] text-white drop-shadow-lg">GROW</span>
                    <span className="text-base">📗</span>
                  </div>
                  <div className="h-[3px] bg-gradient-to-b from-white via-gray-100 to-gray-300" />
                  <div className="h-[6px] bg-gradient-to-b from-pink-300 to-pink-500" />
                </div>
              </div>

              {/* PRACTICE */}
              <div className="anim-float-slow absolute bottom-[60px] left-1/2 w-[300px] -translate-x-1/2 rotate-[3deg]" style={{ animationDelay: '0.5s' }}>
                <div className="book-shadow overflow-hidden rounded-xl">
                  <div className="flex h-[54px] items-center justify-between bg-gradient-to-b from-[#a855f7] via-[#8b5cf6] to-[#5b21b6] px-6">
                    <span className="text-xl font-black tracking-[0.1em] text-white drop-shadow-lg">PRACTICE</span>
                    <span className="text-base">📕</span>
                  </div>
                  <div className="h-[3px] bg-gradient-to-b from-white via-gray-100 to-gray-300" />
                  <div className="h-[6px] bg-gradient-to-b from-purple-300 to-purple-500" />
                </div>
              </div>

              {/* LEARN */}
              <div className="anim-float-slow absolute bottom-[120px] left-1/2 w-[290px] -translate-x-1/2 rotate-[-3deg]" style={{ animationDelay: '1s' }}>
                <div className="book-shadow overflow-hidden rounded-xl">
                  <div className="flex h-[54px] items-center justify-between bg-gradient-to-b from-[#3b82f6] via-[#2563eb] to-[#1e3a8a] px-6">
                    <span className="text-xl font-black tracking-[0.15em] text-white drop-shadow-lg">LEARN</span>
                    <span className="text-base">📘</span>
                  </div>
                  <div className="h-[3px] bg-gradient-to-b from-white via-gray-100 to-gray-300" />
                  <div className="h-[6px] bg-gradient-to-b from-blue-300 to-blue-500" />
                </div>
              </div>
            </div>

            {/* MOTIVATION QUOTE 2 */}
            <div className="mt-4">
              <p className="hand text-2xl text-indigo-300" style={{ transform: 'rotate(-2deg)', textShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}>
                You Got This 💪
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — Login Card */}
        <div className="relative flex items-center justify-center px-6 py-8 sm:px-10">
          <div className="relative w-full max-w-md">
            <div className="anim-border-glow absolute -inset-1 rounded-[32px] bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 blur-xl" />

            <div className="relative rounded-[28px] border border-purple-400/30 bg-[#0d0524]/80 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8">
              <div className="absolute -top-px left-1/2 h-[2px] w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

              <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 opacity-80 blur-xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 text-3xl shadow-2xl">
                  🎓
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Welcome <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Back</span>
                </h2>
                <p className="mt-1 text-xs text-slate-400">Login to continue to your Study Planner</p>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-500/15 p-2.5 text-xs text-red-200">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <span>✉️</span> Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-3 pl-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-purple-500/20"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">✉</span>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <span>🔒</span> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-3 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-purple-500/20"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">🔒</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer items-center gap-1.5 text-slate-300">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-3.5 w-3.5 cursor-pointer accent-purple-500"
                    />
                    Remember me
                  </label>
                  <button type="button" className="font-medium text-purple-400 hover:text-purple-300">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="shine-btn group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:scale-[1.015] disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <span className="text-base transition group-hover:translate-x-1">→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">or</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <p className="text-center text-xs text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
                  Register →
                </Link>
              </p>

              {/* Clean Progress Dots */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <span className="h-px w-6 bg-slate-600" />
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                <span className="h-px w-6 bg-slate-600" />
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                <span className="h-px w-6 bg-slate-600" />
                <span className="h-2 w-2 rounded-full bg-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login