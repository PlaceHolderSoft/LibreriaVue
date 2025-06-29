# LecturasApp

Pequeña aplicación para gestionar una librería personal y lista de lectura.

## 🚀 Descripción

Esta aplicación, basada en las [Pruebas Técnicas 01 de Midudev](https://github.com/midudev/pruebas-tecnicas/tree/main/pruebas/01-reading-list), permite buscar y filtrar libros por precio y género, así como agregarlos a una lista de lectura. Además, incluye un botón para alternar entre tema oscuro y claro.

## 🛠️ Tecnologías

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5" height="30" />
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white" alt="Vue.js" height="30" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" height="30" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" height="30" />
  <img src="https://img.shields.io/badge/VueUse-ffb400?logo=vueuse&logoColor=white" alt="VueUse" height="30" />
</div>

## ⚙️ Instalación

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>

# Instalar dependencias
npm install # instalado con npmi

# Iniciar servidor de desarrollo
npm run dev
```

## 📚 Funcionalidades

* 🎚️ **Filtrado**: Filtrar resultados por **precio** y **género**.
* ➕ **Lista de Lectura**: Agregar libros a una lista personal.
* 🌗 **Cambio de Tema**: Alternar entre tema claro y oscuro.

## 📂 Estructura del Proyecto

```
├── public/                # Archivos estáticos
├── src/
│   ├── assets/            # Imágenes y estilos globales
│   ├── components/        # Componentes Vue reutilizables
│   ├── composables/       # Hooks y lógica con VueUse
│   ├── views/             # Vistas principales
│   ├── App.vue            # Componente raíz
│   ├── main.ts            # Punto de entrada
├── tsconfig.json          # Configuración de TypeScript
└── vite.config.ts         # Configuración de Vite
```

## 📖 Uso

1. Ejecuta la aplicación con `npm run dev`.  
2. En el navegador, abre `http://localhost:5173`.  
3. Explora la lista de libros, utiliza la búsqueda y filtros.  
4. Usa el botón de tema para cambiar entre claro/oscuro.  
5. Agrega libros a tu "Lista de Lectura" para revisarlos más tarde.

*Generado por PlaceHolderSoft*  <!-- Comentario inline indicando autor -->
