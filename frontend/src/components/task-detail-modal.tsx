'use client';

import React, { useEffect } from "react"
import { useState } from 'react'
import { X } from 'lucide-react'
import { Card } from './ui/card'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function TaskDetailModal({ task, onClose, onSave, isNew = false }: TaskDetailModalProps) {
  const [formData, setFormData] = useState<Task>(task || {
    id: 0,
    name: '',
    description: '',
    workingHours: 0, // Lưu ý: Nếu muốn nhập "48:00", hãy đổi kiểu dữ liệu thành string
    startDate: '',
    endDate: '',
    path: '',
    status: 'Not Started',
    deadline: '',
  });

  // 2. Sau đó mới dùng useEffect để cập nhật khi props 'task' thay đổi
  useEffect(() => {
    if (task) {
      setFormData(task as Task);
    }
  }, [task]); // Đưa vào mảng [task]

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
  const [startDate, setStartDate] = useState(new Date());

  if (!task) return null

  return (
    <div className={`fixed inset-0 ${task ? 'bg-black/50' : 'hidden'} flex items-center justify-center z-50 p-4`}>
      <Card className="w-full max-w-2xl p-6 bg-card border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{isNew ? 'Add New Task' : 'Task Details'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary transition-colors rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Task Name <span className="text-red-500">*</span>
            </label>
            
            <input
              type="text"
              name="name"
              required
              placeholder="Nhập tên công việc..."
              value={formData.name}
              onChange={handleChange}
              className="peer w-full px-4 py-2 border border-border bg-input text-foreground 
                        focus:outline-none focus:ring-2 focus:ring-primary rounded-xl
                        invalid:border-red-500/50
                        transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none rounded-md"
            />
          </div>


          <div className="grid grid-cols-2 gap-4 items-end"> {/* Thêm items-end để chân 2 input bằng nhau nếu label dài ngắn khác nhau */}
            {/* Cột Working Hours */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-foreground mb-2">
                Working Hours <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="workingHours"
                required
                value={formData.workingHours}
                onChange={handleChange}
                className="h-11 text-center w-full px-4 py-2 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Cột Status (DatePicker) */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-foreground mb-2">
                Deadline <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date as Date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                // Cực kỳ quan trọng: w-full ở wrapper và h-11 để khớp với input bên trái
                wrapperClassName="w-full" 
                className="h-11 text-center w-full px-4 py-2 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border text-foreground hover:bg-secondary transition-colors font-medium rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium rounded-md"
          >
            {isNew ? 'Create Task' : 'Save Changes'}
          </button>
        </div>
      </Card>
    </div>
  )
}
