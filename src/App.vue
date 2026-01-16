<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="bg-orange-50 font-sans">
    <Navbar />
    <main>
      <Hero />
      <FeaturesSection />
    </main>
    <Footer />
  </div>
</template>

<style>
/* Using a style block here for global styles for now, can be moved to a separate file if needed */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
