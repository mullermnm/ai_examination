<template>
  <div class="notfound-root">
    <div class="notfound-content">
      <div class="ribbon">404</div>

      <div class="rive-wrapper">
        <canvas ref="riveCanvas" width="340" height="340" class="rive-canvas"></canvas>
      </div>

      <h1 class="notfound-title">Page Not Found</h1>
      <p class="notfound-desc">
        The page you are looking for might have been removed or is unavailable.
      </p>

      <router-link to="/" class="notfound-btn">Go Back Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Rive } from '@rive-app/canvas';

const riveCanvas = ref(null);

onMounted(() => {
  new Rive({
    src: new URL('/404.riv', import.meta.url).href, // FIXED
    canvas: riveCanvas.value,
    autoplay: true,
  });
});
</script>

<style scoped>
:root {
  --brown: #efe6db;
  --accent-green: #2f7a5b;
  --accent-blue: #247ba0;
}

.notfound-root {
  min-height: 100vh;
  background: var(--brown);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notfound-content {
  background: rgba(255,255,255,0.7);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(36,123,160,0.08);
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  position: relative;
}

.ribbon {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%) rotate(-6deg);
  background: linear-gradient(90deg,var(--accent-blue),var(--accent-green));
  color: #fff;
  padding: 0.5rem 2.2rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.3rem;
  box-shadow: 0 4px 14px rgba(36,123,160,0.18);
  letter-spacing: 0.1em;
}

.rive-wrapper {
  margin: 1.2rem auto 1.5rem auto;
  display: flex;
  justify-content: center;
}

.rive-canvas {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(36,123,160,0.10);
  background: #fff;
}
</style>
