<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
  { id: 1, title: 'El Quijote' },
  { id: 2, title: 'Cien Años de Soledad' },
  { id: 3, title: '1984' },
])
</script>

<template>
  <h4>Libros Seleccionados</h4>
  <div class="grid grid-flow-col grid-rows-4 gap-4">
    <div v-for="item in data" :key="item.id">
      {{ item.title }}
    </div>
  </div>
</template>

<style>
/* Estilos opcionales */
</style>
