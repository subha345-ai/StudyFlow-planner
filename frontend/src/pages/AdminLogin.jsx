import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import './AdminLogin.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await API.post('/api/admin/login', { email, password })

      // ✅ FIX: Dashboard er sathe key name match kora hoyeche
      localStorage.setItem('admin_logged_in', 'true')
      localStorage.setItem('admin_name', res.data.admin.name)
      localStorage.setItem('admin_email', res.data.admin.email)
      localStorage.setItem('is_admin', 'true')

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login">
      <section className="admin-showcase" aria-label="StudyFlow admin overview">
        <a className="admin-brand" href="/" aria-label="StudyFlow home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>studyflow<span className="brand-period">.</span></span>
        </a>

        <div className="showcase-copy">
          <span className="eyebrow"><span className="status-dot" /> STUDYFLOW CONTROL ROOM</span>
          <h1>Make room<br />for <em>better</em><br />learning.</h1>
          <p>One clear view of every learner, lesson, and little win.</p>
        </div>

        <div className="study-board" aria-label="Weekly study overview">
          <div className="board-heading">
            <div>
              <span className="board-kicker">YOUR OVERVIEW</span>
              <h2>This week</h2>
            </div>
            <span className="board-date">OCT 20 — 26</span>
          </div>
          <div className="board-stat-row">
            <div className="board-stat"><strong>84<span>%</span></strong><small>weekly focus</small></div>
            <div className="stat-divider" />
            <div className="board-stat"><strong>2.4<span>k</span></strong><small>active learners</small></div>
            <div className="board-trend">↗ 12%</div>
          </div>
          <div className="week-chart" aria-hidden="true">
            {[42, 66, 51, 84, 59, 74, 38].map((height, index) => (
              <div className="chart-day" key={index}>
                <span className={`chart-bar${index === 3 ? ' chart-bar-active' : ''}`} style={{ '--bar-height': `${height}%`, '--bar-delay': `${index * 80}ms` }} />
                <small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small>
              </div>
            ))}
          </div>
          <div className="board-footer"><span className="footer-check">✓</span> All systems are looking good</div>
        </div>

        <div className="showcase-foot"><span>BUILT FOR BETTER STUDY HABITS</span><span>01 / 01</span></div>
      </section>

      <section className="admin-form-side">
        <div className="admin-form-wrap">
          <div className="form-topline">
            <span className="secure-label"><span className="secure-dot" /> ADMIN PORTAL</span>
            <span className="form-topline-note">SECURE ACCESS</span>
          </div>

          <div className="form-heading">
            <div className="form-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5 19 6v5.7c0 4.2-2.8 7.3-7 9.3-4.2-2-7-5.1-7-9.3V6l7-2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p className="form-eyebrow">GOOD TO SEE YOU</p>
            <h2>Admin <span>sign in</span></h2>
            <p className="form-description">Sign in to manage your study community.</p>
          </div>

          {error && (
            <div className="admin-error" role="alert">
              <span aria-hidden="true">!</span>{error}
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-form">
            <div className="field-group">
              <label htmlFor="admin-email">Email address</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="admin@studyflow.com"
              />
            </div>

            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="admin-password">Password</label>
                <span className="password-hint">Keep it private</span>
              </div>
              <div className="password-field">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="password-toggle"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="admin-submit">
              {loading ? (
                <><span className="submit-spinner" /> Checking access...</>
              ) : (
                <>Enter admin workspace <span aria-hidden="true">↗</span></>
              )}
            </button>
          </form>

          <div className="form-bottom">
            <p><span className="lock-icon" aria-hidden="true">⌑</span> Restricted to authorized administrators</p>
            <button onClick={() => navigate('/')} className="back-link">
              <span aria-hidden="true">←</span> Back to student login
            </button>
          </div>
        </div>
        <div className="side-footer"><span>STUDYFLOW ADMIN</span><span>MADE FOR FOCUS</span></div>
      </section>
    </main>
  )
}

export default AdminLogin