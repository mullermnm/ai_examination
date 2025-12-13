<template>
  <div class="flex flex-col-reverse space-y-0 w-full h-screen max-h-screen">
    <PerfectScrollbar id="container" class="flex-grow">
      <keep-alive>
        <router-view class="w-full h-full"></router-view>
      </keep-alive>
    </PerfectScrollbar>
    <!-- <app-bar class="flex-shrink-0"></app-bar> -->
    <!-- <socket /> -->
  </div>
</template>

<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar"
</script>

<style></style>
