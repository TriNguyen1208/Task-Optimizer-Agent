'use client';

import { useState } from 'react'
import { Card } from './ui/card'
import { Bell, RotateCw, Shield } from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState({
    activate: true,
    autoSchedule: false,
    notification: true,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-8 w-14 items-center transition-colors ${
        value ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform bg-white transition-transform ${
          value ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and notifications.</p>
      </div>

      <div className="max-w-2xl">
        {/* Activation Setting */}
        <Card className="p-6 mb-4 border-l-4 border-l-primary border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-900">
                <Shield className="w-6 h-6 text-blue-300" />
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

        {/* Auto-Schedule Setting */}
        <Card className="p-6 mb-4 border-l-4 border-l-purple-500 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-900">
                <RotateCw className="w-6 h-6 text-purple-300" />
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

        {/* Notification Setting */}
        <Card className="p-6 border-l-4 border-l-green-500 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-900">
                <Bell className="w-6 h-6 text-green-300" />
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
