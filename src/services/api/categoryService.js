import mockData from '@/services/mockData/categories.json'

let categories = [...mockData]
let nextId = Math.max(...categories.map(c => parseInt(c.Id))) + 1

const delay = () => new Promise(resolve => setTimeout(resolve, 200))

const categoryService = {
  async getAll() {
    await delay()
    return [...categories]
  },

  async getById(id) {
    await delay()
    const category = categories.find(c => c.Id === id.toString())
    return category ? { ...category } : null
  },

  async create(categoryData) {
    await delay()
    const newCategory = {
      Id: nextId++.toString(),
      name: categoryData.name,
      color: categoryData.color || '#5B4FE8',
      taskCount: 0
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, updates) {
    await delay()
    const index = categories.findIndex(c => c.Id === id.toString())
    if (index === -1) return null
    
    categories[index] = { ...categories[index], ...updates }
    return { ...categories[index] }
  },

  async delete(id) {
    await delay()
    const index = categories.findIndex(c => c.Id === id.toString())
    if (index === -1) return false
    
    categories.splice(index, 1)
    return true
  }
}

export default categoryService