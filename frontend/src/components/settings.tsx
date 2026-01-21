import { useState } from 'react'
// Import thêm icon Moon và Sun từ lucide-react
import { Shield, RotateCw, Bell, Moon, Sun } from 'lucide-react' 

// Giả sử bạn đang dùng Card từ component thư viện (nếu code cũ bạn có import Card thì giữ nguyên import đó)
// Nếu bạn không dùng thư viện UI nào, mình sẽ thay bằng thẻ <div> ở dưới, nhưng tạm thời mình để Card giống code bạn
// Nếu lỗi "Card is not defined", bạn thêm dòng này:
// import { Card } from "@/components/ui/card" 
// Hoặc định nghĩa tạm: const Card = ({className, children}: any) => <div className={`bg-card rounded-lg shadow-sm ${className}`}>{children}</div>

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Settings({ isDarkMode, toggleTheme }: SettingsProps) {
  // 1. Giữ nguyên State cũ của bạn
  const [settings, setSettings] = useState({
    activate: true,
    autoSchedule: false,
    notification: true,
  })

  // 2. Giữ nguyên hàm toggle cũ
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // 3. Component ToggleSwitch (Mình chỉnh lại chút xíu CSS width cho đẹp hơn với nút DarkMode)
  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
        // --- SỬA LỖI Ở ĐÂY ---
        // 1. Khi BẬT: Dùng 'bg-blue-600' (hoặc màu bạn thích) để luôn hiển thị rõ bất kể sáng/tối
        // 2. Khi TẮT: Dùng 'bg-gray-200' cho sáng và 'dark:bg-gray-700' cho tối để có độ tương phản tốt
        value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        // Thêm shadow-sm để cái núm trông nổi hơn
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          value ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  )

  // Component Card đơn giản (để tránh lỗi nếu bạn chưa import)
  const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
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
        
        {/* --- MỚI: Card Dark Mode (Thêm vào đầu hoặc cuối danh sách) --- */}
        <Card className="p-6 border-l-4 border-l-yellow-500 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                {/* Đổi icon Mặt trăng / Mặt trời tùy chế độ */}
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
            {/* Sử dụng lại ToggleSwitch của bạn nhưng gắn hàm toggleTheme */}
            <ToggleSwitch
              value={isDarkMode}
              onChange={toggleTheme}
            />
          </div>
        </Card>
        {/* ------------------------------------------------------------- */}

        {/* Activation Setting (Code cũ của bạn) */}
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

        {/* Auto-Schedule Setting (Code cũ của bạn) */}
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

        {/* Notification Setting (Code cũ của bạn) */}
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