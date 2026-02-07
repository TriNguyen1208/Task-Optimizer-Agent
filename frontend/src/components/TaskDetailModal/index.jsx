import React, { useEffect, useState } from "react"
import { X, Sparkles, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAI from "@/hooks/useAI";
import { useMode } from '@/context/setting.context'

export default function TaskDetailModal({ onClose, onSave, isNew = false, task = null }) {
  const { isAutoSchedule } = useMode()
  
  // Gọi trực tiếp API ở đây, không cần truyền từ props
  // Nếu hook useAI của bạn không trả về isPending, bạn có thể bỏ dòng ": isPredicting" đi
  const { mutate: predictWorkingTime, isPending: isPredicting } = useAI.postWorkingTime()

  const [formData, setFormData] = useState(task || {
    name: '',
    description: '',
    working_time: 0,
    deadline: new Date()
  });

  // State lưu giá trị gợi ý từ AI
  const [aiSuggestion, setAiSuggestion] = useState(null);

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
    if (!formData.name.trim()) {
        alert("Task name is required!"); // Đã sửa từ toast thành alert
        return;
    }
    if (onSave) {
      onSave(formData)
    }
    onClose()
  }

  const [deadline, setDeadline] = useState(task?.deadline ? new Date(task.deadline) : new Date());

  useEffect(() => {
    if (!task) return;
    setDeadline(task.deadline)
  }, [task])

  const handleDeadlineChange = (date) => {
    setDeadline(date);
    setFormData(prev => ({ ...prev, deadline: date }));
  };

  // --- LOGIC AI PREDICT ---
  const handlePredict = () => {
    if (!formData.name) {
      alert("Please enter a task name first!"); 
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description || ""
    };

    predictWorkingTime(payload, {
      onSuccess: (data) => {
        // Tùy vào API của bạn trả về { time: 2 } hay chỉ số 2
        // Bạn hãy console.log(data) để kiểm tra nếu không hiện số
        const predictedValue = data?.time || data; 
        
        if (predictedValue) {
            setAiSuggestion(predictedValue);
        }
      },
      onError: (err) => {
        console.error("AI Predict Error", err);
        alert("Could not predict time. Please try again manually.");
      }
    });
  };

  const handleKeyDownWorkingTime = (e) => {
    // Nếu user bấm Tab hoặc Enter khi đang có gợi ý
    if (aiSuggestion && (!formData.working_time || formData.working_time === 0) && (e.key === 'Tab' || e.key === 'Enter')) {
        e.preventDefault();
        setFormData(prev => ({ ...prev, working_time: aiSuggestion }));
        setAiSuggestion(null); 
    }
  };

  if (!task) return null

  return (
    <div className={`fixed inset-0 ${task ? 'bg-black/50' : 'hidden'} flex items-center justify-center z-50 p-4`}>
      <Card className="w-full max-w-2xl p-6 bg-card border border-border animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-foreground">{isNew ? 'Add New Task' : 'Task Details'}</h2>
            <p className="text-sm text-muted-foreground">
                Enter task name and click the <Sparkles className="w-3 h-3 inline text-purple-500"/> button to estimate time.
            </p>
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
              autoFocus={isNew}
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

          <div className="grid grid-cols-2 gap-4 items-end"> 
            {/* Cột Working Hours */}
            <div className="flex flex-col relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-foreground">
                    Working Hours <span className="text-red-500">*</span>
                </label>
                
                {/* NÚT AI PREDICT */}
                <button 
                    type="button"
                    onClick={handlePredict}
                    disabled={isPredicting || !formData.name}
                    className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPredicting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                    {isPredicting ? 'Predicting...' : 'Auto Predict'}
                </button>
              </div>

              <div className="relative">
                <input
                    type="number"
                    name="working_time"
                    required
                    value={formData.working_time || ''} 
                    onChange={handleChange}
                    onKeyDown={handleKeyDownWorkingTime}
                    placeholder={aiSuggestion ? `${aiSuggestion} (Press Tab)` : "0"}
                    className={`h-11 text-center w-full px-4 py-2 border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary focus:outline-none
                        ${aiSuggestion && !formData.working_time ? 'border-purple-400 placeholder:text-purple-400/70' : 'border-border'}
                    `}
                />
                 {/* Tooltip gợi ý */}
                 {aiSuggestion && !formData.working_time && (
                    <div className="absolute -bottom-5 left-0 w-full text-center text-[10px] text-purple-500 font-medium animate-pulse">
                        AI suggests: {aiSuggestion}h
                    </div>
                 )}
              </div>
            </div>

            {/* Cột Deadline */}
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