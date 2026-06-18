export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  // Páginas públicas
  if (to.path === '/login') {
    if (isAuthenticated.value) {
      return navigateTo('/dashboard')
    }
    return
  }
  
  // Redireciona para login se não autenticado
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
