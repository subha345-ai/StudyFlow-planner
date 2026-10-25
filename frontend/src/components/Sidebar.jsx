import { Link, useLocation, useNavigate } from 'react-router-dom'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '🔍', label: 'Search', path: '/search' },
    { icon: '📅', label: 'Schedule', path: '/schedule' },
    { icon: '✅', label: 'Tasks', path: '/tasks' },
    { icon: '⏱️', label: 'Pomodoro', path: '/pomodoro' },
    { icon: '📊', label: 'Progress', path: '/progress' },
    { icon: '📚', label: 'Subjects', path: '/subjects' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_name')
    navigate('/')
  }

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4 flex flex-col">
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition mt-4"
      >
        <span className="text-xl">🚪</span>
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  )
}

export default Sidebar