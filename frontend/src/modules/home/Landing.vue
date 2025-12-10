<template>
  <div class="landing-root">
    <navbar />

    <main class="hero">
      <div class="hero-inner container mx-auto px-6 py-20">
        <div class="hero-content max-w-4xl mx-auto text-center">
          <div class="ribbon">New look</div>
          <h1 class="title">Exams that care</h1>
          <p class="subtitle">
            A thoughtful, accessible examination platform crafted for inclusion.
            Designed to be simple, reliable, and friendly for students and teachers.
          </p>

          <div class="actions mt-8">
            <router-link to="/student">
              <button class="btn-primary">Get started</button>
            </router-link>
            <button class="btn-secondary">Learn more</button>
          </div>
        </div>
      </div>
    </main>

    <section class="features container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="feature card">
          <div class="icon bg-green">
            <i class="fas fa-universal-access"></i>
          </div>
          <h3>Accessibility First</h3>
          <p>Built to be navigable, readable, and usable for everyone.</p>
        </div>

        <div class="feature card">
          <div class="icon bg-blue">
            <i class="fas fa-robot"></i>
          </div>
          <h3>AI-Assisted</h3>
          <p>Smart tools to support students while keeping fairness and integrity.</p>
        </div>

        <div class="feature card">
          <div class="icon bg-amber">
            <i class="fas fa-hand-holding-heart"></i>
          </div>
          <h3>Human-centered</h3>
          <p>Clear workflows for teachers, with empathy for student needs.</p>
        </div>
      </div>
    </section>

    <footer-component />
  </div>
</template>

<script>
import Navbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";

export default {
  components: { Navbar, FooterComponent },
};
</script>

<style >
:root {
  --brown: #efe6db; /* light brown background */
  --accent-green: #2f7a5b; /* deep green */
  --accent-blue: #247ba0; /* deep blue */
  --accent-amber: #c48b49; /* warm amber for contrast */
}
</style>
<style scoped>
.landing-root {
  background: var(--brown);
  min-height: 100vh;
  color: #2b2b2b;
}

.hero {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

.hero-inner {
  position: relative;
}

.hero-content {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(43,43,43,0.08);
}

.title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #3b2f2a;
}

.subtitle {
  margin-top: 0.75rem;
  color: #4b4b4b;
  line-height: 1.6;
}

.actions { display:flex; justify-content:center; gap:1rem; }
.btn-primary {
  background: linear-gradient(90deg,var(--accent-green), #3aa07a);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(47,122,91,0.18);
}
.btn-secondary {
  background: white;
  color: var(--accent-blue);
  border: 2px solid rgba(36,123,160,0.12);
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
}

.features { margin-top: 1.5rem; }
.card {
  background: rgba(255,255,255,0.85);
  padding: 1.25rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(43,43,43,0.06);
}
.icon {
  width:56px; height:56px; margin:0 auto 0.75rem; display:flex; align-items:center; justify-content:center; border-radius:12px; color:white; font-size:1.25rem;
}
.bg-green { background: var(--accent-green); }
.bg-blue { background: var(--accent-blue); }
.bg-amber { background: var(--accent-amber); }

.ribbon {
  position: absolute;
  right: -40px;
  top: -12px;
  background: linear-gradient(45deg,var(--accent-blue),var(--accent-green));
  color: #fff;
  padding: 0.5rem 1.4rem;
  transform: rotate(10deg);
  border-radius: 6px;
  font-weight:600;
  box-shadow: 0 6px 14px rgba(36,123,160,0.18);
}

@media (max-width: 768px) {
  .ribbon { right: -20px; top: -8px; transform: rotate(6deg); }
  .title { font-size: 1.6rem; }
}

</style>
