import TasksPage from '@/components/pages/TasksPage'
import ArchivePage from '@/components/pages/ArchivePage'

export const routes = [
  {
    path: '/',
    component: TasksPage,
    label: 'Tasks'
  },
  {
    path: '/archive',
    component: ArchivePage,
    label: 'Archive'
  }
]