import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../services/api'

function TaskDetail() {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    if (!userId) {
      navigate('/')
      return
    }

    API.get(`/api/tasks?user_id=${userId}`)
      .then(res => {
        const found = (res.data.tasks || []).find(t => t.id === id)
        setTask(found)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id, navigate, userId])

  const handleToggle = async () => {
    if (!task) return
    try {
      await API.put(`/api/tasks/${task.id}`, {
        user_id: userId,
        completed: !task.completed,
      })
      setTask({ ...task, completed: !task.completed })
    } catch (err) {
      console.error(err)
    }
  }

  const handleGenerateQuestions = async () => {
    if (!task) return
    setGenerating(true)
    setError('')
    try {
      const res = await API.post('/api/ai/generate-questions', {
        subject: task.subject,
        level: 'Class 12',
        chapter: task.subject,
        topic: task.target,
        num_questions: 10,
      })
      setQuestions(res.data.questions || [])
    } catch (err) {
      console.error(err)
      setError('Failed to generate questions. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  // ⭐ Start Practice Test (10 questions)
  const handleStartPractice = () => {
    if (!task) return
    navigate(`/exam/task/${task.id}?type=practice&subject=${encodeURIComponent(task.subject)}&topic=${encodeURIComponent(task.target)}`)
  }

  // ⭐ Start Final Exam
  const handleStartFinal = () => {
    if (!task) return
    navigate(`/exam/task/${task.id}?type=final&subject=${encodeURIComponent(task.subject)}&topic=${encodeURIComponent(task.target)}`)
  }

  const getDiffColor = (d) => {
    if (d === 'easy') return 'bg-green-100 text-green-700 border-green-300'
    if (d === 'hard') return 'bg-red-100 text-red-700 border-red-300'
    return 'bg-yellow-100 text-yellow-700 border-yellow-300'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">Loading task...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-4xl">❌</p>
          <p className="mt-3 text-lg font-medium text-gray-700">Task not found</p>
          <button
            onClick={() => navigate('/tasks')}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
    )
  }

  const progress = task.progress || 0
  const practiceScore = task.practice_score || 0
  const finalScore = task.final_score || 0
  const practiceDone = practiceScore >= 90
  const finalDone = finalScore >= 70

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            ← Back to Tasks
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              👤 {localStorage.getItem('user_name') || 'Student'}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        {/* Task Header */}
        <div className={`mb-6 rounded-2xl p-8 text-white shadow-xl ${
          task.completed
            ? 'bg-gradient-to-r from-green-600 to-emerald-600'
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}>
          <div className="mb-3 flex items-center gap-3 flex-wrap">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              📚 {task.subject}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${getDiffColor(task.difficulty)}`}>
              {task.difficulty}
            </span>
            {task.completed && (
              <span className="rounded-full bg-white/30 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                ✅ Completed
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold">{task.target}</h1>
          <p className="mt-2 text-white/80">
            {task.completed ? '🎉 Great job! Task completed!' : 'Complete practice test and final exam to finish this task'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">📊 Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                progress >= 100
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>Practice: {practiceScore}% {practiceDone && '✅'}</span>
            <span>Final: {finalScore}% {finalDone && '✅'}</span>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Step 1: Practice */}
          <div className={`rounded-2xl border-2 p-6 shadow-sm transition ${
            practiceDone ? 'border-green-300 bg-green-50' : 'border-blue-200 bg-white'
          }`}>
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${
                practiceDone ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {practiceDone ? '✓' : '1'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Practice Test</h3>
                <p className="text-xs text-gray-500">10 AI questions • 90% to pass</p>
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {practiceDone
                ? `✅ Completed! Score: ${practiceScore}%`
                : 'Solve 10 AI-generated questions. Get 90% or above to unlock final exam.'}
            </p>
            <button
              onClick={handleStartPractice}
              className={`w-full rounded-xl py-3 font-semibold text-white shadow-md transition hover:shadow-lg ${
                practiceDone
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02]'
              }`}
            >
              {practiceDone ? '🔄 Retake Practice' : '🎯 Start Practice (10 Q)'}
            </button>
          </div>

          {/* Step 2: Final Exam */}
          <div className={`rounded-2xl border-2 p-6 shadow-sm transition ${
            finalDone ? 'border-green-300 bg-green-50' :
            practiceDone ? 'border-purple-300 bg-purple-50' :
            'border-gray-200 bg-gray-50 opacity-60'
          }`}>
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${
                finalDone ? 'bg-green-500 text-white' :
                practiceDone ? 'bg-purple-500 text-white' :
                'bg-gray-400 text-white'
              }`}>
                {finalDone ? '✓' : '2'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Final Exam</h3>
                <p className="text-xs text-gray-500">5 AI questions • 70% to pass</p>
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {finalDone
                ? `🎉 Passed! Score: ${finalScore}%`
                : practiceDone
                ? '🔥 Unlocked! Pass this final exam to complete the task.'
                : '🔒 Locked. Complete practice test (90%) first.'}
            </p>
            <button
              onClick={handleStartFinal}
              disabled={!practiceDone || finalDone}
              className={`w-full rounded-xl py-3 font-semibold text-white shadow-md transition ${
                finalDone
                  ? 'bg-green-600 cursor-default'
                  : practiceDone
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg hover:scale-[1.02]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {finalDone ? '✅ Final Passed' : practiceDone ? '🔥 Take Final Exam' : '🔒 Locked'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            onClick={handleToggle}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 font-semibold shadow-md transition hover:shadow-lg ${
              task.completed
                ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-300'
                : 'bg-green-50 text-green-700 border-2 border-green-300'
            }`}
          >
            {task.completed ? '↩️ Mark Pending' : '✅ Mark Complete'}
          </button>

          <button
            onClick={handleGenerateQuestions}
            disabled={generating}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold text-white shadow-md transition hover:bg-purple-700 disabled:opacity-50"
          >
            {generating ? '⏳ Generating...' : '✨ Preview AI Questions'}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* AI Preview */}
        {questions.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              🤖 AI Preview ({questions.length} questions)
            </h2>
            <div className="space-y-3">
              {questions.slice(0, 3).map((q, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4">
                  <p className="font-medium text-gray-800">
                    {i + 1}. {q.question}
                  </p>
                  <div className="mt-2 space-y-1">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`rounded-lg px-3 py-1.5 text-sm ${
                          oi === q.answer
                            ? 'bg-green-50 font-medium text-green-700'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                        {oi === q.answer && ' ✓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {questions.length > 3 && (
                <p className="text-center text-sm text-gray-500">
                  +{questions.length - 3} more in the actual test...
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default TaskDetail