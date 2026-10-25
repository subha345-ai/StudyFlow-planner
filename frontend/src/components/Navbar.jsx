import { useNavigate } from 'react-router-dom'

function Navbar() {
  const userName = localStorage.getItem('user_name') || 'Student'
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_name')
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📚</span>
        <h1 className="text-2xl font-bold text-blue-600">StudyFlow</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-2xl hover:scale-110 transition">🔔</button>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
          <span className="text-xl">👤</span>
          <span className="font-semibold text-gray-700">{userName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
          title="Logout"
        >
          🚪
        </button>
      </div>
    </header>
  )
}

export default Navbar