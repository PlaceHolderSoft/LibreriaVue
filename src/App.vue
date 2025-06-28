<!-- src/App.vue -->
<template>
  <!-- Contenedor principal ocupa todo el ancho y alto mínimo -->
  <div class="flex flex-col min-h-screen bg-slate-900 text-white">
    <!-- Header sticky ocupa full width -->
    <header class="sticky top-0 bg-slate-800 shadow z-50 w-full">
      <div class="w-full flex items-center justify-between py-4 px-6">
        <!-- Título principal -->
        <h1 class="text-2xl font-bold">Mi Librería</h1>
        <!-- Aquí podrían ir enlaces si hubiera más vistas -->
      </div>
    </header>

    <!-- Main: ocupa todo el ancho libre -->
    <main class="flex-grow w-full">
      <!-- Renderizamos BookStore que ya ocupa todo el ancho -->
      <BookStore />
    </main>

    <!-- Footer full width -->
    <footer class="bg-slate-800 w-full">
      <div class="w-full py-4 px-6 text-center text-sm text-slate-300">
        &copy; {{ new Date().getFullYear() }} Mi Librería. Todos los derechos reservados.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Importar componente principal
import BookStore from '@/components/BookStore.vue'
</script>

<style scoped>
/* No estilos extra; Tailwind maneja el diseño */
</style>
