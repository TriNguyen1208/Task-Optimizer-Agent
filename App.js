import React, { useEffect, useState } from 'react';

function App() {
  // 1. Khởi tạo state từ localStorage để ghi nhớ lựa chọn của người dùng
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // 2. Thêm hoặc xóa class "dark" vào thẻ <html>
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 3. Lưu lựa chọn vào máy để lần sau mở app vẫn giữ nguyên
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Nút bấm chuyển đổi */}
      <button 
        onClick={toggleTheme}
        className="p-2 border rounded-md m-4"
      >
        Chuyển sang {theme === 'light' ? '🌙 Tối' : '☀️ Sáng'}
      </button>
      
      {/* Nội dung App của bạn */}
      <main>
         <h1 className="text-2xl font-bold">TaskFlow Settings</h1>
      </main>
    </div>
  );
}