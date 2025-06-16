import mockData from '@/services/mockData/tasks.json'

let tasks = [...mockData]
let nextId = Math.max(...tasks.map(t => t.Id)) + 1

const delay = () => new Promise(resolve => setTimeout(resolve, 300))

const taskService = {
  async getAll() {
    await delay()
    return [...tasks]
  },

  async getById(id) {
    await delay()
    const task = tasks.find(t => t.Id === parseInt(id))
    return task ? { ...task } : null
  },

  async create(taskData) {
    await delay()
    const newTask = {
      Id: nextId++,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      categoryId: taskData.categoryId || '1',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      archived: false
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay()
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) return null
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      completedAt: updates.completed && !tasks[index].completed 
        ? new Date().toISOString() 
        : updates.completed === false 
        ? null 
        : tasks[index].completedAt
    }
    
    tasks[index] = updatedTask
    return { ...updatedTask }
  },

  async delete(id) {
    await delay()
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) return false
    
    tasks.splice(index, 1)
    return true
  },

  async getActive() {
    await delay()
    return tasks.filter(t => !t.archived && !t.completed).map(t => ({ ...t }))
  },

  async getCompleted() {
    await delay()
    return tasks.filter(t => !t.archived && t.completed).map(t => ({ ...t }))
  },

  async getArchived() {
    await delay()
    return tasks.filter(t => t.archived).map(t => ({ ...t }))
  },

  async archive(id) {
    await delay()
    return this.update(id, { archived: true })
  },

  async unarchive(id) {
    await delay()
    return this.update(id, { archived: false })
  },

  async bulkDelete(ids) {
    await delay()
    const numericIds = ids.map(id => parseInt(id))
    tasks = tasks.filter(t => !numericIds.includes(t.Id))
    return true
  }
}

export default taskService