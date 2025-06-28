<template>
  <div
    class="w-full min-h-screen bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col md:flex-row transition-colors duration-500"
    style="font-family: 'Gentium Book Plus', serif"
  >
    <!-- Área principal: listado y filtros -->
    <div class="flex-1 p-4">
      <!-- Modificado: se quitó overflow-auto para usar scroll global -->
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
        <button
          @click="toggleDark()"
          class="ml-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-sm transition-colors duration-500"
        >
          {{ isDark ? 'Modo Claro' : 'Modo Oscuro' }}
        </button>
      </div>

      <!-- Resumen comprimido de filtros: sticky -->
      <div
        class="mb-4 flex items-center justify-between bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded cursor-pointer sticky top-0 z-10"
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

      <!-- Panel de filtros: sticky debajo del resumen -->
      <transition name="fade-down">
        <div
          v-if="showFiltersPanel"
          class="sticky top-[4rem] z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-white dark:bg-gray-900 p-4 rounded"
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
              class="absolute z-30 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-48 overflow-auto"
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

      <!-- Grid responsivo de cards -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
      >
        <div
          v-for="book in filteredBooks"
          :key="book.titulo"
          class="group flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition border-2 border-transparent hover:border-teal-600"
        >
          <!-- Imagen con página descriptiva -->
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
          <!-- Pie de la card -->
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
      class="w-full md:w-80 bg-gray-100 dark:bg-gray-800 border-t md:border-t-0 md:border-l border-gray-300 dark:border-gray-700 p-4 flex flex-col sticky top-2 h-screen transition-colors duration-500"
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
import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue' // no eliminar
import { useDark, useToggle } from '@vueuse/core'
import data from '@/data/data.json'

const isDark = useDark() // no eliminar
const toggleDark = useToggle(isDark) // no eliminar

interface Book {
  // no eliminar
  titulo: string
  autor: string
  descripcion: string
  imagen: string
  genero?: string
  cantidad?: number
  precio?: number
}

const books = reactive<Book[]>(data.libros as Book[]) // no eliminar
const readingList = reactive<Book[]>([]) // no eliminar

const prices = books.map((b) => b.precio ?? 125) // no eliminar
const minPrice = computed(() => Math.min(...prices)) // no eliminar
const maxPrice = computed(() => Math.max(...prices)) // no eliminar
const selectedPrice = ref(maxPrice.value) // no eliminar

const genres = Array.from(
  new Set(books.map((b) => b.genero).filter((g) => g)), // no eliminar
) as string[]
const selectedGenres = ref<string[]>([]) // no eliminar
const genreDropdownOpen = ref(false) // no eliminar
const genreContainer = ref<HTMLElement | null>(null) // no eliminar

const showFiltersPanel = ref(false) // no eliminar

const filteredBooks = computed(() =>
  // no eliminar
  books.filter((b) => {
    const price = b.precio ?? 125
    const okPrice = price <= selectedPrice.value
    const okGenre = selectedGenres.value.length
      ? b.genero && selectedGenres.value.includes(b.genero)
      : true
    return okPrice && okGenre
  }),
)

const currency = (
  v: number, // no eliminar
) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(v)
const formattedPrice = computed(() => currency(selectedPrice.value)) // no eliminar
const formattedMinPrice = computed(() => currency(minPrice.value)) // no eliminar
const formattedMaxPrice = computed(() => currency(maxPrice.value)) // no eliminar

const isInReadingList = (
  book: Book, // no eliminar
) => readingList.some((b) => b.titulo === book.titulo)
const toggleReadingList = (book: Book) => {
  // no eliminar
  const idx = readingList.findIndex((b) => b.titulo === book.titulo)
  if (idx !== -1) readingList.splice(idx, 1)
  else readingList.push(book)
}
const removeFromReadingList = (book: Book) => {
  // no eliminar
  const idx = readingList.findIndex((b) => b.titulo === book.titulo)
  if (idx !== -1) readingList.splice(idx, 1)
}
const clearReadingList = () => readingList.splice(0) // no eliminar

const toggleFiltersPanel = () => {
  showFiltersPanel.value = !showFiltersPanel.value
} // no eliminar
const toggleGenreDropdown = () => {
  genreDropdownOpen.value = !genreDropdownOpen.value
} // no eliminar
const removeGenre = (g: string) => {
  selectedGenres.value = selectedGenres.value.filter((x) => x !== g)
} // no eliminar

const palette: Record<string, string[]> = {
  // no eliminar
  Fantasía: ['bg-gradient-to-r', 'from-purple-500', 'to-pink-500'],
  Romance: ['bg-gradient-to-r', 'from-pink-500', 'to-red-400'],
  Aventura: ['bg-gradient-to-r', 'from-green-400', 'to-blue-500'],
  Ciencia: ['bg-gradient-to-r', 'from-indigo-500', 'to-blue-400'],
  Misterio: ['bg-gradient-to-r', 'from-gray-700', 'to-gray-500'],
  Terror: ['bg-gradient-to-r', 'from-red-700', 'to-orange-500'],
}
const defaultGradients = [
  // no eliminar
  ['bg-gradient-to-r', 'from-yellow-400', 'to-red-500'],
  ['bg-gradient-to-r', 'from-teal-500', 'to-cyan-500'],
  ['bg-gradient-to-r', 'from-green-300', 'to-blue-300'],
  ['bg-gradient-to-r', 'from-indigo-400', 'to-purple-400'],
  ['bg-gradient-to-r', 'from-pink-300', 'to-orange-300'],
]
function hashString(str: string): number {
  // no eliminar
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
const genreColor = (
  g: string, // no eliminar
) => palette[g] || defaultGradients[hashString(g) % defaultGradients.length]

const handleClickOutside = (e: MouseEvent) => {
  // no eliminar
  if (genreContainer.value && !genreContainer.value.contains(e.target as Node)) {
    genreDropdownOpen.value = false
  }
}

// listener global para "/"                           // no eliminar
const onKeydown = (e: KeyboardEvent) => {
  if (
    e.key === '/' &&
    document.activeElement &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement as HTMLElement).tagName)
  ) {
    e.preventDefault()
    toggleFiltersPanel()
  }
}

onMounted(() => {
  // no eliminar
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  // no eliminar
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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
