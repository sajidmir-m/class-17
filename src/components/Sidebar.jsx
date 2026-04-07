import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/events', label: 'Events', icon: '🎉' },
  { path: '/admin/clients', label: 'Clients', icon: '🏢' },
  { path: '/admin/jobs', label: 'Careers', icon: '💼' },
  { path: '/admin/applications', label: 'Applications', icon: '📨' },
  { path: '/admin/news', label: 'News', icon: '📰' },
  { path: '/admin/messages', label: 'Messages', icon: '✉️' },
  { path: '/admin/state-works', label: 'State Works', icon: '📍' },
  { path: '/admin/founder', label: 'Founder Profile', icon: '👤' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ onLogout }) {
  const location = useLocation()

  return (
    <div className="w-64 bg-gradient-to-b from-gray-800 via-gray-800 to-gray-900 min-h-screen text-white flex flex-col shadow-2xl border-r border-gray-700">
      <div className="p-6 border-b border-gray-700/50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Class 17 Events
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">Ideas That Speak Louder Than Words</p>
      </div>
      <nav className="mt-6 flex-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 font-medium"
        >
          <span className="mr-2">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

