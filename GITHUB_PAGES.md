# Despliegue en GitHub Pages con Tailwind CSS

## ✅ Configuración Automática

El proyecto está configurado para compilar Tailwind CSS automáticamente usando GitHub Actions.

### Cómo funciona:

1. **GitHub Actions** compila automáticamente Tailwind CSS en cada push a `main` o `master`
2. El CSS compilado (`styles/tailwind.css`) se commitea automáticamente al repositorio
3. GitHub Pages despliega el sitio normalmente desde la rama `main` o `master`

## 🚀 Pasos para Configurar GitHub Pages

### 1. Configurar GitHub Pages en tu repositorio:

1. Ve a **Settings** → **Pages** en tu repositorio de GitHub
2. En **Source**, selecciona **Deploy from a branch**
3. Elige la rama `main` (o `master`) y la carpeta `/ (root)`
4. Guarda los cambios

### 2. Habilitar permisos para GitHub Actions:

1. Ve a **Settings** → **Actions** → **General**
2. En **Workflow permissions**, selecciona **Read and write permissions**
3. Marca **Allow GitHub Actions to create and approve pull requests**
4. Guarda los cambios

### 3. Hacer push de tus cambios:

```bash
git add .
git commit -m "Agregar Tailwind CSS y configuración de GitHub Pages"
git push origin main
```

### 4. Verificar:

- Ve a la pestaña **Actions** en tu repositorio
- Deberías ver el workflow ejecutándose
- Una vez completado, el CSS compilado estará en el repositorio
- Tu sitio estará disponible en: `https://[tu-usuario].github.io/[nombre-repositorio]/`

## 📝 Notas Importantes

- El archivo `styles/tailwind.css` se genera y commitea automáticamente por GitHub Actions
- No es necesario compilar manualmente antes de hacer push
- Para desarrollo local, usa `npm run build-css` o `npm run watch-css`
- El workflow se ejecuta en cada push a `main` o `master`

## 🔧 Desarrollo Local

Para desarrollo local:

```bash
npm install
npm run build-css    # Compilar una vez
npm run watch-css    # Compilar y observar cambios
```

## ❓ Solución de Problemas

Si el despliegue falla:

1. Verifica que GitHub Actions esté habilitado en tu repositorio
2. Asegúrate de que la rama sea `main` o `master`
3. Revisa los logs en la pestaña **Actions** para ver errores
4. Verifica que `package.json` y `tailwind.config.js` estén en el repositorio
5. Verifica los permisos de GitHub Actions (debe tener write access)
