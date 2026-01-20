'use client';
import './globals.css';
import './index.css'; // Đảm bảo file này nằm dưới cùng

import { useState, useEffect } from 'react' // <--- Thêm useEffect
import Sidebar from './components/sidebar'
import Dashboard from './components/dashboard'
import Statistics from './components/statistics'
import Settings from './components/settings'
import Schedule from './components/schedule'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // --- 1. THÊM LOGIC DARK MODE VÀO ĐÂY ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Lấy giá trị đã lưu, nếu không có thì mặc định là false (Sáng)
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Hàm để chuyển đổi qua lại
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  // ----------------------------------------

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard />
      case 'schedule':
        return <Schedule />
      case 'statistics':
        return <Statistics />
      case 'settings':
        // --- 2. TRUYỀN PROPS XUỐNG COMPONENT SETTINGS ---
        // Chúng ta truyền trạng thái (isDarkMode) và hàm đổi màu (toggleTheme)
        return <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      default:
        return <Dashboard />
    }
  }

  return (
    // Thêm text-foreground để chữ tự đổi màu
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  )
}