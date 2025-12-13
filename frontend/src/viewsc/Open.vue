<template>
  <div class="open-layout">
    <nav class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </nav>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'OpenLayout'
}
</script>

<style scoped>
.open-layout {
  min-height: 100vh;
}

.nav {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
