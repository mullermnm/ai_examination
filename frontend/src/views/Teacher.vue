<template>
    
  <PerfectScrollbar>
    <!-- <Sidebar /> -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </PerfectScrollbar>
        
    
</template>

<script setup>
  import { ref } from 'vue';
  import { PerfectScrollbar } from "vue3-perfect-scrollbar";
  import Sidebar from '../components/Sidebar/Sidebar.vue';
</script>
