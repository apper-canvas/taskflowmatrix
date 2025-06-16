import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

function SearchBar({ value, onChange, placeholder = "Search...", className = "" }) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon 
          name="Search" 
          className={`w-4 h-4 transition-colors ${
            isFocused ? 'text-primary-500' : 'text-gray-400'
          }`} 
        />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
      />
      
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default SearchBar