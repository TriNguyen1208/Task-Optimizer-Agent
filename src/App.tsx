'use client';
import './globals.css';

import { useState } from 'react'
import Sidebar from './components/sidebar'
import Dashboard from './components/dashboard'
import Statistics from './components/statistics'
import Settings from './components/settings'
import Schedule from './components/schedule'
import './index.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard />
      case 'schedule':
        return <Schedule />
      case 'statistics':
        return <Statistics />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  )
}
