import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import { taskService, categoryService } from '@/services'
import ApperIcon from '@/components/ApperIcon'
import TaskItem from '@/components/organisms/TaskItem'
import AddTaskForm from '@/components/organisms/AddTaskForm'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import SearchBar from '@/components/molecules/SearchBar'
import EmptyState from '@/components/atoms/EmptyState'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'

function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksData.filter(task => !task.archived))
      setCategories(categoriesData)
    } catch (error) {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      setShowAddForm(false)
      toast.success('Task created successfully!')
    } catch (error) {
      toast.error('Failed to create task')
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates)
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.Id === taskId ? updatedTask : task
        ))
        if (updates.completed) {
          toast.success('Task completed! 🎉')
        }
      }
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleArchiveTask = async (taskId) => {
    try {
      await taskService.archive(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task archived')
    } catch (error) {
      toast.error('Failed to archive task')
    }
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(task => !task.completed)
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.categoryId === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // First by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Then by due date (overdue first, then today, then future)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (a.dueDate && !b.dueDate) return -1
      if (!a.dueDate && b.dueDate) return 1

      // Finally by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  const filteredTasks = getFilteredTasks()
  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  const getTasksForToday = () => {
    return activeTasks.filter(task => {
      if (!task.dueDate) return false
      return isToday(parseISO(task.dueDate))
    })
  }

  const getOverdueTasks = () => {
    return activeTasks.filter(task => {
      if (!task.dueDate) return false
      return isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate))
    })
  }

  const todayTasks = getTasksForToday()
  const overdueTasks = getOverdueTasks()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Sidebar - Categories */}
      <div className="hidden lg:block w-64 bg-surface border-r border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Categories
            </h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Overview
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Clock" className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Active correct</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{activeTasks.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{completedTasks.length}</span>
              </div>

              {overdueTasks.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-error/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="AlertCircle" className="w-4 h-4 text-error" />
                    </div>
                    <span className="text-sm font-medium text-error">Overdue</span>
                  </div>
                  <span className="text-sm font-semibold text-error">{overdueTasks.length}</span>
                </div>
              )}

              {todayTasks.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-warning/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-warning" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Due Today</span>
                  </div>
                  <span className="text-sm font-semibold text-warning">{todayTasks.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-600 mt-1">
                {activeTasks.length} active tasks
                {overdueTasks.length > 0 && (
                  <span className="text-error ml-2">• {overdueTasks.length} overdue</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tasks..."
                className="w-full lg:w-64"
              />
              
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showCompleted
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showCompleted ? 'Hide' : 'Show'} Completed
              </button>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Mobile Categories */}
          <div className="lg:hidden mt-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              layout="horizontal"
            />
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon="CheckSquare"
              title={searchQuery.trim() ? "No tasks found" : "No tasks yet"}
              description={
                searchQuery.trim() 
                  ? "Try adjusting your search or filters"
                  : "Create your first task to get started organizing your day"
              }
              action={
                !searchQuery.trim() && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    Create First Task
                  </button>
                )
              }
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.Id}
                  task={task}
                  categories={categories}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onArchive={handleArchiveTask}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddForm && (
        <AddTaskForm
          categories={categories}
          onSubmit={handleCreateTask}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}

export default TasksPage
