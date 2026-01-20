'use client';

import React from "react"
import { useState } from 'react'
import { X } from 'lucide-react'
import { Card } from './ui/card'

interface Task {
  id: number
  name: string
  description: string
  workingHours: number
  startDate: string
  endDate: string
  path?: string
  status?: 'In Progress' | 'Pending' | 'Not Started'
  deadline?: string
}

interface TaskDetailModalProps {
  task: Task | null
  onClose: () => void
  onSave?: (task: Task) => void
  isNew?: boolean
}

export default function TaskDetailModal({ task, onClose, onSave, isNew }: TaskDetailModalProps) {
  const [formData, setFormData] = useState<Task>(task || {
    id: 0,
    name: '',
    description: '',
    workingHours: 0,
    startDate: '',
    endDate: '',
    path: '',
    status: 'Not Started',
    deadline: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'workingHours' ? parseFloat(value) : value
    }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
    onClose()
  }

  if (!task) return null

  return (
    <div className={`fixed inset-0 ${task ? 'bg-black/50' : 'hidden'} flex items-center justify-center z-50 p-4`}>
      <Card className="w-full max-w-2xl p-6 bg-card border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{isNew ? 'Add New Task' : 'Task Details'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Task Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Path / URL</label>
            <input
              type="text"
              name="path"
              value={formData.path || ''}
              onChange={handleChange}
              placeholder="https://example.com or /path/to/file"
              className="w-full px-4 py-2 border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Working Hours</label>
              <input
                type="number"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                step="0.5"
                className="w-full px-4 py-2 border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <input
                type="text"
                value="Active"
                disabled
                className="w-full px-4 py-2 border border-border bg-input text-foreground opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border text-foreground hover:bg-secondary transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
          >
            {isNew ? 'Create Task' : 'Save Changes'}
          </button>
        </div>
      </Card>
    </div>
  )
}
