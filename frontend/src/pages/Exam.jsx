
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import API from '../services/api'

const POMODORO_KEY = 'pomodoro_state'

function Exam() {
  const { chapterId, topicId, id: taskId } = useParams()
  const [searchParams] = useSearchParams()
  const examType = searchParams.get('type') || 'practice'
  const topicName = searchParams.get('topic') || 'Topic'
  const subject = searchParams.get('subject') || ''
  const isTask = !!taskId

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(20 * 60) // ⏱️ 20 min
  const [autoSubmitted, setAutoSubmitted] = useState(false)
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id')
  const timerRef = useRef(null)
  const submittedRef = useRef(false)

  const questionCount = examType === 'final' ? 5 : 10
  const passMark = examType === 'final' ? 70 : 90
  const TOTAL_TIME = 20 * 60

  // ═══════════════════════════════════════════
  // FETCH QUESTIONS
  // ═══════════════════════════════════════════
  useEffect(() => {
    if (!userId) {
      navigate('/')
      return
    }

    const fetchQuestions = async () => {
      setLoading(true)
      setError('')

      try {
        const res = await API.post('/api/ai/generate-questions', {
          subject: subject || 'General',
          level: 'Class 12',
          chapter: subject,
          topic: topicName,
          num_questions: questionCount,
        })
        setQuestions(res.data.questions || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load questions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [chapterId, topicId, subject, topicName, navigate, userId, questionCount])

  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(new Array(questions.length).fill(-1))
    }
  }, [questions])

  // ═══════════════════════════════════════════
  // ⭐ AUTO POMODORO START — when exam loads
  // ═══════════════════════════════════════════
  useEffect(() => {
    if (loading || questions.length === 0 || results) return

    // Save to localStorage → Dashboard e live dekhbe
    try {
      localStorage.setItem(POMODORO_KEY, JSON.stringify({
        timer: TOTAL_TIME,
        isRunning: true,
        timerMinutes: 20,
        totalSeconds: 0,
        savedAt: Date.now(),
      }))
    } catch (e) {
      console.log('Pomodoro save failed:', e)
    }
  }, [loading, questions.length, results])

  // ═══════════════════════════════════════════
  // ⏱️ TIMER — 20 minutes countdown
  // ═══════════════════════════════════════════
  useEffect(() => {
    if (loading || questions.length === 0 || results) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [loading, questions.length, results])

  // ═══════════════════════════════════════════
  // ⏰ AUTO-SUBMIT when timer hits 0
  // ═══════════════════════════════════════════
  useEffect(() => {
    if (timeLeft === 0 && !results && !submitting && questions.length > 0 && !submittedRef.current) {
      submittedRef.current = true
      setAutoSubmitted(true)
      handleSubmit(true)
    }
  }, [timeLeft])

  // ═══════════════════════════════════════════
  // 🛑 STOP POMODORO when results ready
  // ═══════════════════════════════════════════
  useEffect(() => {
    if (results) {
      try {
        localStorage.setItem(POMODORO_KEY, JSON.stringify({
          timer: 25 * 60,
          isRunning: false,
          timerMinutes: 25,
          totalSeconds: 0,
          savedAt: Date.now(),
        }))
      } catch (e) {
        console.log('Pomodoro stop failed:', e)
      }
    }
  }, [results])

  // ═══════════════════════════════════════════
  // TIMER FORMAT
  // ═══════════════════════════════════════════
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handleSelect = (optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQ] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1)
  }

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1)
  }

  // ═══════════════════════════════════════════
  // SUBMIT — with auto-submit support
  // ═══════════════════════════════════════════
  const handleSubmit = async (isAuto = false) => {
    if (submitting || results) return

    if (!isAuto && answers.includes(-1)) {
      alert('Please answer all questions before submitting!')
      return
    }

    if (timerRef.current) clearInterval(timerRef.current)
    setSubmitting(true)

    try {
      let correct = 0
      const detailedResults = questions.map((q, i) => {
        const isCorrect = answers[i] === q.answer
        if (isCorrect) correct++
        return { ...q, userAnswer: answers[i], isCorrect }
      })

      const score = Math.round((correct / questions.length) * 100)

      if (isTask) {
        try {
          if (examType === 'practice') {
            await API.put(`/api/tasks/${taskId}/progress`, {
              user_id: userId,
              practice_score: score,
            })
          } else if (examType === 'final') {
            await API.put(`/api/tasks/${taskId}/progress`, {
              user_id: userId,
              final_score: score,
            })
          }
        } catch (e) {
          console.log('Backend save skipped:', e)
        }
      }

      setResults({
        score,
        correct,
        total: questions.length,
        detailed: detailedResults,
        passed: score >= passMark,
        examType,
        autoSubmitted: isAuto,
      })
    } catch (err) {
      console.error(err)
      alert('Failed to submit test')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setAnswers(new Array(questions.length).fill(-1))
    setCurrentQ(0)
    setResults(null)
    setTimeLeft(TOTAL_TIME)
    setAutoSubmitted(false)
    submittedRef.current = false
  }

  const handleBack = () => {
    // Stop pomodoro on exit
    try {
      localStorage.setItem(POMODORO_KEY, JSON.stringify({
        timer: 25 * 60,
        isRunning: false,
        timerMinutes: 25,
        totalSeconds: 0,
        savedAt: Date.now(),
      }))
    } catch (e) {}

    if (isTask) {
      navigate(`/task/${taskId}`)
    } else {
      navigate(-1)
    }
  }

  // ═══ Loading ═══
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-gray-700">
            🤖 AI is generating {questionCount} questions...
          </p>
          <p className="mt-1 text-sm text-gray-500">This may take 10-20 seconds</p>
        </div>
      </div>
    )
  }

  // ═══ Error ═══
  if (error || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-5xl">❌</p>
          <p className="mt-4 text-xl font-bold text-gray-800">
            {error || 'No questions available'}
          </p>
          <button
            onClick={handleBack}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  // ═══ Results ═══
  if (results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl px-6">
          {/* Auto-submit notice */}
          {results.autoSubmitted && (
            <div className="mb-4 rounded-xl border border-orange-300 bg-orange-50 p-4 text-center text-sm font-medium text-orange-700">
              ⏰ Time's up! Your test was submitted automatically.
            </div>
          )}

          <div className={`mb-6 rounded-3xl p-8 text-center text-white shadow-xl ${
            results.passed
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-orange-500 to-red-600'
          }`}>
            <p className="text-6xl">{results.passed ? '🎉' : '💪'}</p>
            <h1 className="mt-4 text-3xl font-bold">
              {results.passed ? (examType === 'final' ? 'Task Completed!' : 'Practice Passed!') : 'Keep Practicing!'}
            </h1>
            <p className="mt-2 text-white/80">
              {results.passed
                ? examType === 'final'
                  ? 'Congratulations! Task is now 100% complete!'
                  : '90%+ achieved! Final exam unlocked! 🔥'
                : `You need ${passMark}% to pass. Try again!`}
            </p>

            <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-5xl font-bold">{results.score}%</p>
                <p className="text-xs text-white/80">SCORE</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{results.correct}</p>
                <p className="text-xs text-white/80">Correct</p>
              </div>
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{results.total - results.correct}</p>
                <p className="text-xs text-white/80">Wrong</p>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <button
              onClick={handleRetry}
              className="rounded-xl bg-white py-3 font-semibold text-gray-700 shadow-sm transition hover:shadow-md"
            >
              🔄 Retry Test
            </button>
            <button
              onClick={handleBack}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 font-semibold text-white shadow-sm transition hover:shadow-md"
            >
              {isTask ? '← Back to Task' : '← Back'}
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">📋 Detailed Results</h2>
            <div className="space-y-4">
              {results.detailed.map((r, i) => (
                <div
                  key={i}
                  className={`rounded-xl border-l-4 p-4 ${
                    r.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="flex-1 font-medium text-gray-800">
                      {i + 1}. {r.question}
                    </p>
                    <span className="text-2xl">{r.isCorrect ? '✅' : '❌'}</span>
                  </div>
                  <div className="mt-3 space-y-1">
                    {r.options.map((opt, oi) => {
                      const isUser = r.userAnswer === oi
                      const isCorrectAns = r.answer === oi
                      return (
                        <div
                          key={oi}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            isCorrectAns
                              ? 'bg-green-100 font-medium text-green-800'
                              : isUser
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + oi)}. {opt}
                          {isCorrectAns && ' ✓'}
                          {isUser && !isCorrectAns && ' ✗'}
                        </div>
                      )
                    })}
                  </div>
                  {r.explanation && (
                    <p className="mt-3 rounded-lg bg-white/70 p-3 text-sm italic text-gray-600">
                      💡 {r.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══ Question Page ═══
  const q = questions[currentQ]
  const progress = ((currentQ + 1) / questions.length) * 100
  const answeredCount = answers.filter(a => a !== -1).length
  const timerPercent = (timeLeft / TOTAL_TIME) * 100

  const timerColor =
    timeLeft <= 60 ? 'text-red-500 border-red-500' :
    timeLeft <= 300 ? 'text-orange-500 border-orange-500' :
    'text-blue-500 border-blue-500'

  const timerBg =
    timeLeft <= 60 ? 'bg-red-500' :
    timeLeft <= 300 ? 'bg-orange-500' :
    'bg-blue-500'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <button onClick={handleBack} className="text-sm font-medium text-gray-600 hover:text-blue-600">
            ← Exit
          </button>

          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${
              examType === 'final' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {examType === 'final' ? '🔥 FINAL EXAM' : '📝 PRACTICE'}
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              {answeredCount}/{questions.length}
            </span>
          </div>

          {/* ⏱️ TIMER */}
          <div className={`flex items-center gap-2 rounded-2xl border-2 bg-white px-4 py-2 font-mono text-lg font-bold shadow-sm ${timerColor} ${
            timeLeft <= 60 ? 'animate-pulse' : ''
          }`}>
            <span className="text-xl">⏱️</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="mx-auto mt-3 max-w-4xl">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerBg}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>
      </header>

      <div className="h-1 bg-gray-200">
        <div
          className={`h-full transition-all duration-300 ${
            examType === 'final'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Warning when time < 5 min */}
        {timeLeft <= 300 && timeLeft > 0 && (
          <div className="mb-4 rounded-xl border border-orange-300 bg-orange-50 p-3 text-center text-sm font-medium text-orange-700">
            ⚠️ Only {formatTime(timeLeft)} left! Hurry up!
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            Question {currentQ + 1} of {questions.length}
          </p>
          <p className="text-xs text-gray-400">
            Pass: {passMark}%
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            {q.question}
          </h2>

          <div className="mt-6 space-y-3">
            {q.options.map((opt, oi) => {
              const isSelected = answers[currentQ] === oi
              return (
                <button
                  key={oi}
                  onClick={() => handleSelect(oi)}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + oi)}
                  </div>
                  <span className={`flex-1 ${isSelected ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                    {opt}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentQ === 0}
              className="rounded-xl border-2 border-gray-200 px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Previous
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 font-semibold text-white shadow-md transition hover:shadow-lg"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting || answers.includes(-1)}
                className={`rounded-xl px-8 py-3 font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${
                  examType === 'final'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600'
                }`}
              >
                {submitting ? '⏳ Submitting...' : '✓ Submit'}
              </button>
            )}
          </div>
        </div>

        {answeredCount === questions.length && currentQ < questions.length - 1 && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
            <p className="text-sm font-medium text-green-700">✅ All questions answered!</p>
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="mt-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Submit Now
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Exam