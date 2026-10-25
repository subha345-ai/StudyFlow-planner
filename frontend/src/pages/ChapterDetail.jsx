import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../services/api'

function ChapterDetail() {
  const { id } = useParams()
  const [chapter, setChapter] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    if (!userId) {
      navigate('/')
      return
    }

    API.get(`/api/chapters/${id}`)
      .then(res => setChapter(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id, navigate, userId])

  const handleStartTest = (topic) => {
    navigate(`/exam/${id}/${topic.id}?topic=${encodeURIComponent(topic.name)}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">Loading chapter...</p>
        </div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-4xl">❌</p>
          <p className="mt-3 text-lg font-medium text-gray-700">Chapter not found</p>
          <button
            onClick={() => navigate('/chapters')}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            ← Back to Chapters
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => navigate('/chapters')}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              👤 {localStorage.getItem('user_name') || 'Student'}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        {/* Chapter Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
          <div className="mb-3 flex items-center gap-3 flex-wrap">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {chapter.subject}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {chapter.level}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${
              chapter.difficulty === 'easy' ? 'bg-green-500/40' :
              chapter.difficulty === 'hard' ? 'bg-red-500/40' :
              'bg-yellow-500/40'
            }`}>
              {chapter.difficulty}
            </span>
          </div>
          <h1 className="text-3xl font-bold">{chapter.chapter}</h1>
          <p className="mt-2 text-white/80">
            {chapter.topics?.length || 0} topics • Learn each topic and take AI tests
          </p>
        </div>

        {/* Topics List */}
        <h2 className="mb-4 text-xl font-bold text-gray-800">📖 Topics</h2>

        <div className="space-y-4">
          {chapter.topics?.map((topic, index) => (
            <div
              key={topic.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-md">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {topic.name}
                      </h3>
                    </div>

                    {/* Tasks */}
                    <div className="mt-4 ml-13 space-y-1.5">
                      <p className="text-xs font-medium text-gray-500">TASKS:</p>
                      {topic.tasks?.map((task, ti) => (
                        <div key={ti} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-blue-500">☐</span>
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Count */}
                  <div className="shrink-0">
                    <div className="rounded-xl bg-blue-50 px-4 py-3 text-center">
                      <p className="text-xs text-blue-600">Questions</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {topic.test?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Button */}
                <button
                  onClick={() => handleStartTest(topic)}
                  disabled={!topic.test || topic.test.length === 0}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 font-semibold text-white shadow-md transition hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  🎯 Take AI Test
                </button>
              </div>
            </div>
          ))}
        </div>

        {(!chapter.topics || chapter.topics.length === 0) && (
          <div className="rounded-2xl bg-yellow-50 p-8 text-center">
            <p className="text-4xl">📭</p>
            <p className="mt-3 text-lg font-medium text-yellow-700">No topics yet</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default ChapterDetail