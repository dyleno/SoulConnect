<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  
 <router-view />
  
</template> 

<style>
/* GLOBAL FIX – NIET IN SCOPED PLAATSEN */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent !important;
}

/* Verwijder zwarte achtergrond van layout / shell */
.layout, .app-wrapper, .root, .container, .wrapper {
  background: transparent !important;
}

</style>



