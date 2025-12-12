# Instalación de Tailwind CSS

## Pasos para configurar Tailwind CSS

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Compilar Tailwind CSS (primera vez):**
   ```bash
   npm run build-css
   ```

3. **Para desarrollo (con watch mode):**
   ```bash
   npm run watch-css
   ```
   Esto recompilará automáticamente el CSS cada vez que hagas cambios.

## Estructura

- `input.css` - Archivo de entrada con las directivas de Tailwind
- `tailwind.config.js` - Configuración de Tailwind
- `styles/tailwind.css` - Archivo CSS compilado (generado, no editar manualmente)

## Uso

Una vez compilado, Tailwind estará disponible en todo el proyecto. Puedes usar las clases de Tailwind junto con tus estilos CSS existentes.

El archivo `styles/tailwind.css` ya está incluido en `index.html` antes de tus otros archivos CSS, así que puedes sobrescribir estilos con tus CSS personalizados si es necesario.

