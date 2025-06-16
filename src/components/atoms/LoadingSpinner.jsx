import { motion } from 'framer-motion'

function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`border-2 border-gray-200 border-t-primary-500 rounded-full ${sizeClasses[size]} ${className}`}
    />
  )
}

export default LoadingSpinner