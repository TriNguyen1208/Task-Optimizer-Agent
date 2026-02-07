import React, { useEffect } from "react"
import { useState } from 'react'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAI from "@/hooks/useAI";
import {useMode} from '@/context/setting.context'

//Logic cơ bản AI
//Điều kiện: 
// Name không được trống, khi nhập name thì keyUP sẽ bắt đầu call API để predict working_time
// Tương tự với description như có thể trống, khi nhập description thì keyUP sẽ bắt đầu call API
// Có phân biệt giữa người nhập và người dùng tab. Nếu như người dùng thật sự nhập thì để có luôn
// Có giao diện chữ predict mờ mờ gợi ý, người dùng tab thì mới fill in.
export default function TaskDetailModal({ onClose, onSave, isNew = false, task = null }) {
  const {isAutoSchedule} = useMode()
  const {mutate: predictWorkingTime} = useAI.postWorkingTime()

  const [formData, setFormData] = useState(task || {
    name: '',
    description: '',
    working_time: 0, 
    deadline: new Date()
  });
  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]); 

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'working_time' ? (parseInt(value) || 0) : value
    }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
    onClose()
  }
  const [deadline, setDeadline] = useState(task?.deadline ? new Date(task.deadline) : new Date());

  useEffect(() => {
      if(!task) return;
      setDeadline(task.deadline)
  }, [task])
  const handleDeadlineChange = (date) => {
    setDeadline(date);
    setFormData(prev => ({ ...prev, deadline: date }));
  };
  if (!task) return null

  return (
    <div className={`fixed inset-0 ${task ? 'bg-black/50' : 'hidden'} flex items-center justify-center z-50 p-4`}>
      <Card className="w-full max-w-2xl p-6 bg-card border border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-foreground">{isNew ? 'Add New Task' : 'Task Details'}</h2>
            <p className="text-sm text-muted-foreground">Waiting at least 5 second to predict working time after entering task name</p>
          </div>
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
                type="number"
                name="working_time"
                required
                value={formData.working_time}
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
                selected={deadline}
                onChange={handleDeadlineChange}
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