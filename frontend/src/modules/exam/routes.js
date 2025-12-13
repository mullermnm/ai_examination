import ExamCreation from './components/ExamCreation.vue'
import ExamsList from './components/ExamsList.vue'

export default [
  {
    path: '/teacher/exam/create',
    name: 'exam-creation',
    component: ExamCreation,
    meta: {
      requiresAuth: true,
      role: 'teacher',
      title: 'Create Exam'
    }
  },

  {
    path: '/teacher/exams',
    name: 'exams-list',
    component: ExamsList,
    meta: {
      requiresAuth: true,
      role: 'teacher',
      title: 'Exams List'
    }
  },

  {
    path: '/teacher/exam/edit/:id',
    name: 'ExamEdit',
    component: () => import('./components/ExamEdit.vue'),
    meta: {
      requiresAuth: true,
      role: 'teacher'
    }
  }

]
