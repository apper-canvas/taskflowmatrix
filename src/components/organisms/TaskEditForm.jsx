import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

function TaskEditForm({ task, categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: task.title,
    priority: task.priority,
    categoryId: task.categoryId,
    dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface rounded-md border-2 border-primary-200 p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title */}
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          autoFocus
          required
        />

        {/* Priority & Category */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
            value={formData.categoryId}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            {categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.title.trim() || isSubmitting}
            className="flex-1 px-3 py-2 text-sm bg-primary-500 text-white rounded-sm hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default TaskEditForm