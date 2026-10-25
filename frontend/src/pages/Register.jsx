import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await API.post('/api/register', { name, email, password })
      localStorage.setItem('user_id', res.data.user_id)
      localStorage.setItem('user_name', res.data.name)
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#0a0428]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .anim-blob { animation: blob 15s ease-in-out infinite; }
        .anim-sparkle { animation: sparkle 3s ease-in-out infinite; }
        .shine-btn::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-100%) skewX(-15deg);
        }
        .shine-btn:hover::after { animation: shine 1.2s ease-in-out; }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0428] via-[#1a0b4e] to-[#2d1b69]" />
      <div className="anim-blob absolute -left-40 -top-20 h-[600px] w-[600px] rounded-full bg-purple-600/40 blur-[150px]" />
      <div className="anim-blob absolute -right-40 top-1/3 h-[550px] w-[550px] rounded-full bg-blue-600/35 blur-[140px]" />
      <div className="anim-blob absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full bg-pink-600/30 blur-[150px]" />

      <div className="pointer-events-none absolute inset-0">
        <div className="anim-sparkle absolute left-[10%] top-[15%] text-2xl text-purple-300">✦</div>
        <div className="anim-sparkle absolute right-[15%] top-[20%] text-lg text-pink-300" style={{ animationDelay: '0.7s' }}>✦</div>
      </div>

      <div className="relative z-10 grid w-full grid-cols-1 lg:grid-cols-2">
        {/* Left Info */}
        <div className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center">
          <div className="relative w-full max-w-2xl px-10 py-10 text-white">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-lg shadow-lg">🎓</div>
              <h1 className="text-xl font-bold">Study<span className="text-purple-300">Planner</span></h1>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight xl:text-5xl">
              Start Your<br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Learning Journey</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              Join thousands of students achieving more with structured study plans.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-xs backdrop-blur-sm">
              <span className="text-base">🎉</span>
              <span className="font-medium text-purple-200">Free forever · No credit card needed</span>
            </div>
          </div>
        </div>

        {/* Right — Register Card */}
        <div className="relative flex items-center justify-center px-6 py-8 sm:px-10">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 blur-xl" />

            <div className="relative rounded-[28px] border border-purple-400/30 bg-[#0d0524]/80 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8">
              <div className="absolute -top-px left-1/2 h-[2px] w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

              <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 opacity-80 blur-xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 text-3xl shadow-2xl">
                  ✨
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Create <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Account</span>
                </h2>
                <p className="mt-1 text-xs text-slate-400">Join StudyFlow in just 30 seconds</p>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-400/40 bg-red-500/15 p-2.5 text-xs text-red-200">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <span>👤</span> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <span>✉️</span> Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-purple-500/20"
                  />
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
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-3 pr-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-purple-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="shine-btn group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:scale-[1.015] disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
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
                Already have an account?{' '}
                <Link to="/" className="font-semibold text-purple-400 hover:text-purple-300">
                  Login →
                </Link>
              </p>

              {/* ⭐ Progress Dots — Step 2 Active */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] text-white shadow-lg shadow-green-500/50">
                  ✓
                </span>
                <span className="h-px w-6 bg-green-500" />
                <span className="flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-[10px] font-bold text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-300/50">
                  2
                </span>
                <span className="h-px w-6 bg-indigo-400/40" />
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-indigo-400/40 text-[10px] text-indigo-300">3</span>
                <span className="h-px w-6 bg-indigo-400/40" />
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-indigo-400/40 text-[10px] text-indigo-300">4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register