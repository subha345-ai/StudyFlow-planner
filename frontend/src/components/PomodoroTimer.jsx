import { useState, useEffect } from 'react'

function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval = null
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1)
      }, 1000)
    } else if (seconds === 0) {
      setIsRunning(false)
      alert('⏰ Time is up! Take a break.')
    }
    return () => clearInterval(interval)
  }, [isRunning, seconds])

  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60)
    const sec = totalSeconds % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setSeconds(25 * 60)
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pomodoro</h2>
      <div className="text-center">
        <p className="text-5xl font-bold text-blue-600 mb-4">
          {formatTime(seconds)}
        </p>
        <div className="flex gap-2 justify-center">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ▶ Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              ⏸ Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default PomodoroTimer