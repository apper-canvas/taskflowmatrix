import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { taskService, categoryService } from '@/services'
import ApperIcon from '@/components/ApperIcon'
import TaskItem from '@/components/organisms/TaskItem'
import SearchBar from '@/components/molecules/SearchBar'
import EmptyState from '@/components/atoms/EmptyState'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'

function ArchivePage() {
  const [archivedTasks, setArchivedTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTasks, setSelectedTasks] = useState(new Set())

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getArchived(),
        categoryService.getAll()
      ])
      setArchivedTasks(tasksData)
      setCategories(categoriesData)
    } catch (error) {
      toast.error('Failed to load archived tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleUnarchiveTask = async (taskId) => {
    try {
      await taskService.unarchive(taskId)
      setArchivedTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task restored to active list')
    } catch (error) {
      toast.error('Failed to restore task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setArchivedTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task permanently deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleSelectTask = (taskId) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
    } else {
      newSelected.add(taskId)
    }
    setSelectedTasks(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(filteredTasks.map(task => task.Id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return
    
    try {
      await taskService.bulkDelete([...selectedTasks])
      setArchivedTasks(prev => prev.filter(task => !selectedTasks.has(task.Id)))
      setSelectedTasks(new Set())
      toast.success(`${selectedTasks.size} tasks permanently deleted`)
    } catch (error) {
      toast.error('Failed to delete selected tasks')
    }
  }

  const getFilteredTasks = () => {
    let filtered = archivedTasks

    if (searchQuery.trim()) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      // Sort by completion date (most recent first)
      if (a.completedAt && b.completedAt) {
        return new Date(b.completedAt) - new Date(a.completedAt)
      }
      // Fall back to creation date
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  const filteredTasks = getFilteredTasks()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Archive</h1>
            <p className="text-gray-600 mt-1">
              {archivedTasks.length} archived tasks
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search archived tasks..."
              className="w-full lg:w-64"
            />
            
            {selectedTasks.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-error text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-error/90 transition-colors flex items-center space-x-2"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
                <span>Delete ({selectedTasks.size})</span>
              </button>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {filteredTasks.length > 0 && (
          <div className="mt-4 flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">
                Select all ({filteredTasks.length})
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon="Archive"
            title={searchQuery.trim() ? "No archived tasks found" : "No archived tasks"}
            description={
              searchQuery.trim() 
                ? "Try adjusting your search"
                : "Completed tasks that you archive will appear here"
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredTasks.map((task) => (
              <div key={task.Id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedTasks.has(task.Id)}
                  onChange={() => handleSelectTask(task.Id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <TaskItem
                    task={task}
                    categories={categories}
                    onDelete={handleDeleteTask}
                    onRestore={handleUnarchiveTask}
                    isArchived={true}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ArchivePage