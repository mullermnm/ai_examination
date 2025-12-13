import Dashboard from './components/Dashboard.vue'
import TakingExam from './components/TakingExam.vue'
export default [
  {
    path: '/',
    name: 'StudentDashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      role: 'student'
    }
  },
  {
    path: '/student-dashboard',
    name: 'StudentDashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      role: 'student'
    }
  },
  {
    path: '/student/exam/:id',
    name: 'TakingExam',
    component: TakingExam,
    meta: {
      requiresAuth: true,
      role: 'student'
    }
  }
]