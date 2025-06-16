import { Outlet, NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-gray-900">TaskFlow</h1>
          </div>
          
          <nav className="flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <ApperIcon name="List" className="w-4 h-4" />
              <span>Tasks</span>
            </NavLink>
            
            <NavLink
              to="/archive"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <ApperIcon name="Archive" className="w-4 h-4" />
              <span>Archive</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout