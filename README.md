# 📊 Registro de Horas de Estudio — Minimalista (HTML, CSS, JS)

Aplicación web ligera que permite registrar sesiones de estudio, guardando la hora de inicio, hora de fin, duración y actividad realizada. Todos los datos se almacenan localmente usando `localStorage` en formato JSON.

---

## 📌 Características

- 📌 Registrar hora de inicio de una actividad.
- 📌 Registrar hora de fin de una actividad.
- 📌 Calcular y mostrar la duración de la sesión.
- 📌 Guardar registros de sesiones en `localStorage`.
- 📌 Mostrar historial acumulado de sesiones.
- 📌 Sin dependencias externas ni backend.
- 📌 Diseño minimalista y eficiente para bajo consumo de recursos.

---

## 📂 Estructura del Proyecto

```
/tracker
├── index.html # Interfaz principal
├── style.css # Estilos básicos
└── script.js # Lógica de registro y gestión de sesiones
```

---

## 📖 Cómo funciona

1. **Ingresar el nombre de la actividad** en el campo de texto.
2. Presionar **Iniciar** para registrar la hora de inicio.
3. Presionar **Finalizar** para capturar la hora de fin, calcular la duración y guardar el registro.
4. El historial de sesiones se muestra automáticamente debajo.

---

## 📦 Almacenamiento

Los registros se guardan en `localStorage` bajo la clave `registros` en formato JSON.

### 📌 Estructura del JSON:
```json
[
  {
    "fecha": "2025-06-30",
    "inicio": "08:00:00",
    "fin": "10:30:00",
    "duracion": "2h 30m",
    "actividad": "Estudio Redes"
  }
]
```
### 📌 Tecnologías usadas
- HTML5
- CSS3
- JavaScript ES6
- localStorage API (para persistencia local en navegador)

### 🚀 Instalación y uso
1. Descarga o clona el repositorio.
2. Abre index.html en tu navegador.
3. Usa los botones Iniciar y Finalizar para registrar sesiones.
4. Visualiza el historial en la sección inferior.

### ⚙️ Limitaciones
- Los registros se almacenan en localStorage, por lo que se eliminan al limpiar caché o datos de navegador.
- No permite exportar registros como archivo JSON (se puede añadir fácilmente).

- No permite modificar o eliminar registros individuales desde la interfaz.

### 📌 Mejoras sugeridas
Agregar botón de exportación de registros a archivo .json.

Permitir edición o eliminación de sesiones.

Filtrar sesiones por fecha.

Mostrar total de horas acumuladas por día.

### 📌 Créditos
Desarrollado por Kevin Diaz para fines personales y educativos.


