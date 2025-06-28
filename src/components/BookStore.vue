<template>
  <div
    class="w-full min-h-screen bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col md:flex-row"
    style="font-family: 'Gentium Book Plus', serif"
  >
    <!-- Área principal: listado y filtros -->
    <div class="flex-1 p-4">
      <!-- Cabecera con conteo y botón de tema -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-teal-600 dark:text-teal-400">
            {{ filteredBooks.length }} libros disponibles
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ readingList.length }} en la lista de lectura
          </p>
        </div>
        <!-- Botón toggle modo oscuro/claro -->
        <button
          @click="toggleDark()"
          class="ml-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-sm transition-colors duration-500"
        >
          {{ isDark ? 'Modo Claro' : 'Modo Oscuro' }}
        </button>
      </div>

      <!-- Resumen comprimido de filtros: sticky con top custom -->
      <div
        class="mb-4 flex items-center justify-between bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded cursor-pointer z-10 sticky top-0"
        @click="toggleFiltersPanel"
      >
        <div class="flex flex-wrap gap-2 items-center">
          <span class="font-medium">Filtros:</span>
          <span v-if="selectedPrice < maxPrice" class="text-sm">
            Precio ≤ {{ formattedPrice }}
          </span>
          <template v-if="selectedGenres.length">
            <span v-for="genre in selectedGenres" :key="genre" class="text-sm">
              {{ genre }}
            </span>
          </template>
          <span v-if="selectedPrice >= maxPrice && selectedGenres.length === 0" class="text-sm">
            Ninguno
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs">
            Presiona <kbd class="px-1 bg-gray-300 dark:bg-gray-700 rounded">/</kbd>
          </span>
          <svg
            class="w-5 h-5 transform"
            :class="{ 'rotate-180': showFiltersPanel }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- Panel desplegable de filtros con animación fade-down -->
      <transition name="fade-down">
        <div
          v-if="showFiltersPanel"
          class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-white dark:bg-gray-900 p-4 rounded"
        >
          <!-- Tarjeta Range Slider de precio -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4 w-full mx-auto">
            <div class="mb-3">
              <label
                for="priceRange"
                class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
              >
                Precio ≤ {{ formattedPrice }}
              </label>
              <input
                id="priceRange"
                type="range"
                :min="minPrice"
                :max="maxPrice"
                v-model.number="selectedPrice"
                class="w-full accent-teal-600"
              />
            </div>
            <div class="flex justify-between text-gray-500 dark:text-gray-400 text-xs">
              <span>{{ formattedMinPrice }}</span>
              <span>{{ formattedMaxPrice }}</span>
            </div>
          </div>

          <!-- Tarjeta Multi-select Género -->
          <div
            ref="genreContainer"
            class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4 w-full mx-auto relative"
          >
            <button
              type="button"
              class="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-3 py-2 text-left flex justify-between items-center"
              @click.stop="toggleGenreDropdown"
            >
              <span>Seleccionar géneros</span>
              <svg
                class="w-4 h-4 transform"
                :class="{ 'rotate-180': genreDropdownOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="genreDropdownOpen"
              class="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-48 overflow-auto"
            >
              <ul class="py-1">
                <li v-for="genre in genres" :key="genre">
                  <label
                    class="flex items-center px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="genre"
                      v-model="selectedGenres"
                      class="mr-2 accent-teal-600"
                    />
                    <span class="text-gray-800 dark:text-gray-200">{{ genre }}</span>
                  </label>
                </li>
              </ul>
            </div>
            <div v-if="selectedGenres.length" class="mt-3 flex flex-wrap gap-2">
              <template v-for="genre in selectedGenres" :key="genre">
                <span
                  class="text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                  :class="genreColor(genre)"
                >
                  {{ genre }}
                  <button
                    type="button"
                    class="ml-1 text-white hover:text-gray-200"
                    @click="removeGenre(genre)"
                  >
                    ✕
                  </button>
                </span>
              </template>
            </div>
          </div>
        </div>
      </transition>

      <!-- Grid responsivo de cards más pequeñas -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
      >
        <div
          v-for="book in filteredBooks"
          :key="book.titulo"
          class="group flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition border-2 border-transparent hover:border-teal-600"
        >
          <!-- Imagen compacta con efecto de página sobresaliente en hover -->
          <div
            class="relative w-full"
            style="padding-top: 120%"
            @click.stop="toggleReadingList(book)"
          >
            <img
              :src="book.imagen"
              :alt="book.titulo"
              class="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div
              class="absolute top-0 right-0 w-2/3 h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out shadow-lg"
            >
              <h4 class="font-semibold mb-2">{{ book.titulo }}</h4>
              <p class="text-xs">{{ book.descripcion }}</p>
            </div>
          </div>
          <!-- Pie de la card toggle lectura -->
          <div
            class="p-2 flex items-center justify-between bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
            @click="toggleReadingList(book)"
          >
            <p class="font-medium text-xs truncate">{{ book.titulo }}</p>
            <p class="font-medium text-xs">{{ currency(book.precio ?? 125) }}</p>
          </div>
          <div class="p-2 pt-0 bg-gray-100 dark:bg-gray-700">
            <button
              type="button"
              class="w-full bg-teal-600 dark:bg-teal-500 text-white font-bold uppercase text-[10px] py-1 rounded-md shadow transition transform hover:scale-105 focus:scale-105 active:scale-100"
              @click.stop="toggleReadingList(book)"
            >
              {{ isInReadingList(book) ? 'Quitar' : 'Agregar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar: lista de lectura -->
    <div
      class="w-full md:w-80 bg-gray-100 dark:bg-gray-800 border-t md:border-t-0 md:border-l border-gray-300 dark:border-gray-700 p-4 flex flex-col sticky top-0 h-screen transition-colors duration-500"
      style="font-family: 'Gentium Book Plus', serif"
    >
      <h3 class="text-lg font-semibold text-teal-600 dark:text-teal-400 mb-4">Lista de lectura</h3>
      <div v-if="readingList.length === 0" class="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Sin libros en la lista
      </div>
      <ul class="space-y-2 overflow-auto flex-1" v-else>
        <li
          v-for="book in readingList"
          :key="book.titulo"
          class="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded-lg"
        >
          <div class="flex items-center space-x-2">
            <img :src="book.imagen" :alt="book.titulo" class="h-10 w-6 object-cover rounded" />
            <p class="font-medium text-xs text-gray-900 dark:text-gray-100 truncate">
              {{ book.titulo }}
            </p>
          </div>
          <button
            type="button"
            @click="removeFromReadingList(book)"
            class="text-red-500 dark:text-red-400 text-xs hover:text-red-700"
          >
            ✕
          </button>
        </li>
      </ul>
      <button
        v-if="readingList.length"
        type="button"
        @click="clearReadingList"
        class="mt-4 bg-red-600 dark:bg-red-500 text-white font-bold uppercase text-xs py-2 rounded-md shadow transition transform hover:scale-105 focus:scale-105 active:scale-100"
      >
        Vaciar lista
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar APIs de Vue
import { reactive, ref, computed, onBeforeUnmount } from 'vue'
// Importar useDark y useToggle para tema oscuro
import { useDark, useToggle } from '@vueuse/core'
// Importar datos de libros
import data from '@/data/data.json'

const isDark = useDark() // isDark es ref que indica estado del tema
const toggleDark = useToggle(isDark) // función para alternar tema

// Interfaz Book
interface Book {
  titulo: string
  autor: string
  descripcion: string
  imagen: string
  genero?: string
  cantidad?: number
  precio?: number
}

// Datos reactivos
const books = reactive<Book[]>(data.libros as Book[])
const readingList = reactive<Book[]>([])

// Precios
const prices = books.map((b) => b.precio ?? 125)
const minPrice = computed(() => Math.min(...prices))
const maxPrice = computed(() => Math.max(...prices))
const selectedPrice = ref(maxPrice.value)

// Géneros
const genres = Array.from(new Set(books.map((b) => b.genero).filter((g) => g))) as string[]
const selectedGenres = ref<string[]>([])
const genreDropdownOpen = ref(false)
const genreContainer = ref<HTMLElement | null>(null)

// Mostrar filtros
const showFiltersPanel = ref(false)

// Libros filtrados
const filteredBooks = computed(() => {
  return books.filter((b) => {
    const price = b.precio ?? 125
    const okPrice = price <= selectedPrice.value
    const okGenre = selectedGenres.value.length
      ? b.genero && selectedGenres.value.includes(b.genero)
      : true
    return okPrice && okGenre
  })
})

// Formateo de moneda
const currency = (v: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(v)
const formattedPrice = computed(() => currency(selectedPrice.value))
const formattedMinPrice = computed(() => currency(minPrice.value))
const formattedMaxPrice = computed(() => currency(maxPrice.value))

// Lista de lectura helpers
const isInReadingList = (book: Book) => readingList.some((b) => b.titulo === book.titulo)
const toggleReadingList = (book: Book) => {
  const idx = readingList.findIndex((b) => b.titulo === book.titulo)
  if (idx !== -1) readingList.splice(idx, 1)
  else readingList.push(book)
}
const removeFromReadingList = (book: Book) => {
  const idx = readingList.findIndex((b) => b.titulo === book.titulo)
  if (idx !== -1) readingList.splice(idx, 1)
}
const clearReadingList = () => readingList.splice(0, readingList.length)

// Toggles de UI
const toggleFiltersPanel = () => {
  showFiltersPanel.value = !showFiltersPanel.value
}
const toggleGenreDropdown = () => {
  genreDropdownOpen.value = !genreDropdownOpen.value
}
const removeGenre = (g: string) => {
  selectedGenres.value = selectedGenres.value.filter((x) => x !== g)
}

// Colores por género
const palette: Record<string, string[]> = {
  Fantasía: ['bg-gradient-to-r', 'from-purple-500', 'to-pink-500'],
  Romance: ['bg-gradient-to-r', 'from-pink-500', 'to-red-400'],
  Aventura: ['bg-gradient-to-r', 'from-green-400', 'to-blue-500'],
  Ciencia: ['bg-gradient-to-r', 'from-indigo-500', 'to-blue-400'],
  Misterio: ['bg-gradient-to-r', 'from-gray-700', 'to-gray-500'],
  Terror: ['bg-gradient-to-r', 'from-red-700', 'to-orange-500'],
}
const defaultGradients = [
  ['bg-gradient-to-r', 'from-yellow-400', 'to-red-500'],
  ['bg-gradient-to-r', 'from-teal-500', 'to-cyan-500'],
  ['bg-gradient-to-r', 'from-green-300', 'to-blue-300'],
  ['bg-gradient-to-r', 'from-indigo-400', 'to-purple-400'],
  ['bg-gradient-to-r', 'from-pink-300', 'to-orange-300'],
]
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
const genreColor = (g: string) =>
  palette[g] || defaultGradients[hashString(g) % defaultGradients.length]

// Cerrar dropdown al clic fuera
const handleClickOutside = (e: MouseEvent) => {
  if (genreContainer.value && !genreContainer.value.contains(e.target as Node)) {
    genreDropdownOpen.value = false
  }
}

// Tecla "/" para alternar filtros
const onKeydown = (e: KeyboardEvent) => {
  if (
    e.key === '/' &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement as HTMLElement).tagName)
  ) {
    e.preventDefault()
    toggleFiltersPanel()
  }
}
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Animaciones fade-down */
.fade-down-enter-active {
  animation: fadeInDown 0.3s ease-out;
}
.fade-down-leave-active {
  animation: fadeOutUp 0.2s ease-in forwards;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeOutUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
