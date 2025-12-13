const TeacherDashboard = () => import("./components/Dashboard.vue")


const routes = [
  {
    path: "/teacher-dashboard",
    name: "TeacherDashboard",
    component: TeacherDashboard,
  },
]
export default routes.map((route) => ({
  ...route,
  meta: { ...route.meta, onlyWhenLoggedOut: false, public: false, memberRole: true, title: 'TeacherDashboard' },
}))
