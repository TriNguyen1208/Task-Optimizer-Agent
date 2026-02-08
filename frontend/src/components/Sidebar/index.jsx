import { Home, Calendar, BarChart3, Settings, Zap, UserPen } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import icon from '@/assets/icon.png'

export default function Sidebar() {
  const location = useLocation();
  const navItems = [
    { id: 'profile', label: "Profile", icon: UserPen, path: '/profile'},
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/schedule' },
    { id: 'statistics', label: 'Statistics', icon: BarChart3, path: '/statistics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ]

  return (
    <aside className="w-60 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border flex items-center gap-4">
        <div className="w-8 h-8 bg-primary flex items-center justify-center rounded">
          <img
            src={icon}
            alt="Task Optimizer logo"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-bold text-lg text-foreground">Task Optimizer</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors rounded-lg ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}