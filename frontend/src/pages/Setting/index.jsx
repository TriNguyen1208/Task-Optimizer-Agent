import { useState } from 'react'
import { Shield, RotateCw, Bell, Moon, Sun } from 'lucide-react' 
import { useTheme } from "@/context/theme.context";

export default function Setting() {
  const {isDarkMode, toggleTheme} = useTheme()

  const [settings, setSettings] = useState({
    activate: true,
    autoSchedule: false,
    notification: true,
  })

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const ToggleSwitch = ({ value, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
        value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          value ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  )

  const Card = ({ className, children }) => (
    <div className={`bg-card text-card-foreground rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  )

  return (
    <div className="p-8 h-full bg-background text-foreground transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and notifications.</p>
      </div>

      <div className="max-w-2xl space-y-4">
        <Card className="p-6 border-l-4 border-l-yellow-500 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                {isDarkMode ? (
                  <Moon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-foreground">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <ToggleSwitch
              value={isDarkMode}
              onChange={toggleTheme}
            />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-md">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Activate</h3>
                <p className="text-sm text-muted-foreground">Enable TaskFlow features</p>
              </div>
            </div>
            <ToggleSwitch
              value={settings.activate}
              onChange={() => toggleSetting('activate')}
            />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-md">
                <RotateCw className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Auto-Schedule</h3>
                <p className="text-sm text-muted-foreground">Automatically organize your tasks</p>
              </div>
            </div>
            <ToggleSwitch
              value={settings.autoSchedule}
              onChange={() => toggleSetting('autoSchedule')}
            />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-md">
                <Bell className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive task reminders and updates</p>
              </div>
            </div>
            <ToggleSwitch
              value={settings.notification}
              onChange={() => toggleSetting('notification')}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}