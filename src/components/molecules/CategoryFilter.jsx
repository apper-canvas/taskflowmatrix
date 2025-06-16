import { motion } from 'framer-motion'

function CategoryFilter({ categories, selectedCategory, onCategoryChange, layout = 'vertical' }) {
  const containerClass = layout === 'horizontal' 
    ? 'flex flex-wrap gap-2' 
    : 'space-y-1'

  return (
    <div className={containerClass}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onCategoryChange('all')}
        className={`${layout === 'horizontal' ? 'px-3 py-1.5 rounded-full text-sm' : 'w-full px-3 py-2 rounded-lg text-left'} font-medium transition-colors ${
          selectedCategory === 'all'
            ? 'bg-primary-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        All Tasks
      </motion.button>
      
      {categories.map((category) => (
        <motion.button
          key={category.Id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategoryChange(category.Id)}
          className={`${layout === 'horizontal' ? 'px-3 py-1.5 rounded-full text-sm' : 'w-full px-3 py-2 rounded-lg text-left'} font-medium transition-colors flex items-center ${
            selectedCategory === category.Id
              ? 'text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
          style={{
            backgroundColor: selectedCategory === category.Id ? category.color : undefined
          }}
        >
          <div 
            className={`w-3 h-3 rounded-full ${layout === 'horizontal' ? 'mr-2' : 'mr-3'} flex-shrink-0`}
            style={{ 
              backgroundColor: selectedCategory === category.Id ? 'rgba(255,255,255,0.3)' : category.color 
            }}
          />
          <span className="truncate">{category.name}</span>
          {layout === 'vertical' && (
            <span className={`ml-auto text-xs ${selectedCategory === category.Id ? 'text-white/70' : 'text-gray-500'}`}>
              {category.taskCount}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  )
}

export default CategoryFilter