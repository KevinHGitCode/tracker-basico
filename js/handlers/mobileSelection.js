// mobileSelection.js
let touchStartTime = 0;
let touchTimer = null;
let modeChangeLock = false;

function setModeLock() {
  modeChangeLock = true;
  setTimeout(() => { modeChangeLock = false; }, 300); // Bloqueo por 300ms
}

function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

export function setupMobileSelection({ seleccionados, editandoIdxRef, mostrarRegistros }) {
  // Si no es un dispositivo táctil, no configurar los listeners móviles
  if (!isTouchDevice()) return () => {};

  return function addMobileSelectionListeners() {
    document.querySelectorAll('.registro-item').forEach(el => {
      // Prevenir eventos de mouse en dispositivos táctiles
      el.addEventListener('mousedown', e => e.preventDefault());
      // Manejo de eventos touch
      el.addEventListener('touchstart', function(e) {
        // Prevenir el gesto de navegación del navegador
        if (e.touches.length === 1) {
          e.preventDefault();
        }

        // Si estamos editando o el modo está bloqueado, ignorar completamente
        if (editandoIdxRef.value !== null || modeChangeLock) {
          return;
        }

        touchStartTime = Date.now();
        const idx = Number(this.getAttribute('data-idx'));
        
        // Comenzar timer para detectar touch largo
        touchTimer = setTimeout(() => {
          // Verificación adicional de modo edición y bloqueo
          if (editandoIdxRef.value !== null || modeChangeLock) return;
          
          // Touch largo activa modo selección múltiple
          if (!seleccionados.has(idx)) {
            seleccionados.add(idx);
            mostrarRegistros();
          }
          
          // Mostrar indicador visual de modo selección
          document.body.classList.add('selection-mode');
          setModeLock(); // Activar bloqueo temporal
        }, 500); // 500ms para considerar touch largo
      });

      el.addEventListener('touchend', function(e) {
        clearTimeout(touchTimer);
        const idx = Number(this.getAttribute('data-idx'));
        const touchDuration = Date.now() - touchStartTime;
        
        // Si estamos editando o el modo está bloqueado, ignorar completamente
        if (editandoIdxRef.value !== null || modeChangeLock) {
          e.preventDefault();
          return;
        }

        // Si estamos en modo selección
        if (document.body.classList.contains('selection-mode')) {
          e.preventDefault(); // Prevenir eventos de click
          if (seleccionados.has(idx)) {
            seleccionados.delete(idx);
          } else {
            seleccionados.add(idx);
          }
          
          // Si no hay más seleccionados, salir del modo selección
          if (seleccionados.size === 0) {
            document.body.classList.remove('selection-mode');
            setModeLock(); // Activar bloqueo temporal
          }
          
          mostrarRegistros();
        } else if (touchDuration < 500 && !document.body.classList.contains('selection-mode')) {
          // Touch corto normal, solo si no estamos en modo selección
          if (seleccionados.has(idx) && seleccionados.size === 1) {
            seleccionados.clear();
          } else {
            seleccionados.clear();
            seleccionados.add(idx);
          }
          setModeLock(); // Activar bloqueo temporal
          mostrarRegistros();
        }
      });

      el.addEventListener('touchmove', function(e) {
        // Cancelar el timer si el dedo se mueve
        clearTimeout(touchTimer);
      });
    });

    // Crear contenedor de controles de selección
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'selection-controls';
    
    // Botones de control
    const controls = [
      { icon: 'fa-check-double', title: 'Seleccionar todo', action: () => {
        const items = document.querySelectorAll('.registro-item');
        items.forEach(item => {
          const idx = Number(item.getAttribute('data-idx'));
          seleccionados.add(idx);
        });
        document.body.classList.add('selection-mode');
        mostrarRegistros();
      }},
      { icon: 'fa-times', title: 'Salir de selección', action: () => {
        seleccionados.clear();
        document.body.classList.remove('selection-mode');
        mostrarRegistros();
      }}
    ];

    controls.forEach(control => {
      const button = document.createElement('button');
      button.innerHTML = `<i class="fa-solid ${control.icon}"></i>`;
      button.title = control.title;
      button.addEventListener('click', control.action);
      controlsContainer.appendChild(button);
    });

    // Insertar controles después del h3 del resumen
    const h3 = document.querySelector('#resumen > h3');
    if (h3) {
      h3.style.display = 'flex';
      h3.style.alignItems = 'center';
      h3.appendChild(controlsContainer);
    }

  };
}
