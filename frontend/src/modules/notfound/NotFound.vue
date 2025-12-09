
<template>
  <div class="notfound-root">
    <div class="notfound-content">
      <div class="ribbon">404</div>
      <div class="rive-wrapper">
        <canvas ref="riveCanvas" width="340" height="340" class="rive-canvas"></canvas>
      </div>
      <h1 class="notfound-title">Page Not Found</h1>
      <p class="notfound-desc">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <router-link to="/" class="notfound-btn">Go Back Home</router-link>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import Rive from 'rive-js';

export default {
  name: "NotFound",
  setup() {
    const riveCanvas = ref(null);
    onMounted(() => {
      new Rive({
        src: '/404.riv',
        canvas: riveCanvas.value,
        autoplay: true,
      });
    });
    return { riveCanvas };
  }
};
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
  padding: 2.5rem 2rem 2rem 2rem;
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
.notfound-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-blue);
  margin-bottom: 0.5rem;
}
.notfound-desc {
  color: #4b4b4b;
  margin-bottom: 1.5rem;
}
.notfound-btn {
  display: inline-block;
  background: var(--accent-green);
  color: #fff;
  font-weight: 600;
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(47,122,91,0.12);
  transition: background 0.2s;
}
.notfound-btn:hover {
  background: var(--accent-blue);
}
@media (max-width: 500px) {
  .notfound-content { padding: 1.2rem 0.5rem 1rem 0.5rem; }
  .notfound-title { font-size: 1.3rem; }
  .ribbon { font-size: 1rem; padding: 0.4rem 1.2rem; }
}
</style>
