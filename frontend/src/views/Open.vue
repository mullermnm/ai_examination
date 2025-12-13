<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-0 overflow-y-auto h-screen">
    <router-view class="h-screen"></router-view>
    <Toast />
  </div>
</template>

<script>
import Toast from '../components/app/Toast.vue';

export default {
    setup() {
    },
    components: { Toast }
}
</script>

<style>
@import "../styles/tailwind.css";
@media (max-width: 640px) {
  .h-screen {
    height: calc(100vh - 48px);
  }  
}
</style>
