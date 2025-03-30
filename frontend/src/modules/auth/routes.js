

const routes = [
  
]
export default routes.map((route) => ({
  ...route,
  meta: { ...route.meta, onlyWhenLoggedOut: false, public: false, memberRole: true, title: 'Auth' },
}))
