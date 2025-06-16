import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import TaskEditForm from '@/components/organisms/TaskEditForm'

function TaskItem({ task, categories, onUpdate, onDelete, onArchive, onRestore, isArchived = false }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const category = categories.find(cat => cat.Id === task.categoryId)
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error'
      case 'medium': return 'text-warning'
      case 'low': return 'text-success'
      default: return 'text-gray-400'
    }
  }

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'high': return 'task-priority-high'
      case 'medium': return 'task-priority-medium'
      case 'low': return 'task-priority-low'
      default: return ''
    }
  }

  const getDueDateInfo = (dueDate) => {
    if (!dueDate) return null
    
    const date = parseISO(dueDate)
    const isOverdue = isPast(date) && !isToday(date)
    
    let text = format(date, 'MMM d')
    let className = 'text-gray-500'
    
    if (isToday(date)) {
      text = 'Today'
      className = 'text-warning font-medium'
    } else if (isTomorrow(date)) {
      text = 'Tomorrow'
      className = 'text-info font-medium'
    } else if (isOverdue) {
      className = 'text-error font-medium'
    }
    
    return { text, className }
  }

  const handleToggleComplete = async () => {
    if (isArchived) return
    
    setIsCompleting(true)
    
    // Add a small delay for animation
    setTimeout(async () => {
      await onUpdate?.(task.Id, { completed: !task.completed })
      setIsCompleting(false)
    }, 150)
  }

  const handleUpdate = async (updates) => {
    await onUpdate?.(task.Id, updates)
    setIsEditing(false)
  }

  const dueDateInfo = getDueDateInfo(task.dueDate)

  if (isEditing) {
    return (
      <TaskEditForm
        task={task}
        categories={categories}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.01 }}
      className={`bg-white rounded-md shadow-card hover:shadow-card-hover transition-all duration-200 p-4 ${getPriorityBorder(task.priority)} ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        {!isArchived && (
          <button
            onClick={handleToggleComplete}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
              task.completed
                ? 'bg-success border-success text-white task-checkbox completed'
                : 'border-gray-300 hover:border-primary-400 task-checkbox'
            } ${isCompleting ? 'completing' : ''}`}
          >
            {task.completed && (
              <svg className="w-3 h-3 checkmark" fill="none" stroke="currentColor" viewBox="0 0 16 16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l3 3 7-7" />
              </svg>
            )}
          </button>
        )}

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              
              <div className="mt-2 flex items-center space-x-4 text-xs">
                {/* Category */}
                {category && (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-white font-medium"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </span>
                )}
                
                {/* Priority */}
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Flag" className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                  <span className={`capitalize ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                {/* Due Date */}
                {dueDateInfo && (
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Calendar" className={`w-3 h-3 ${dueDateInfo.className}`} />
                    <span className={dueDateInfo.className}>
                      {dueDateInfo.text}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 ml-2">
              {!isArchived && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Edit task"
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </button>
                  
                  {task.completed && (
                    <button
                      onClick={() => onArchive?.(task.Id)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                      title="Archive task"
                    >
                      <ApperIcon name="Archive" className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
              
              {isArchived && (
                <button
                  onClick={() => onRestore?.(task.Id)}
                  className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                  title="Restore task"
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => onDelete?.(task.Id)}
                className="p-1.5 text-gray-400 hover:text-error hover:bg-error/10 rounded transition-colors"
                title="Delete task"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem