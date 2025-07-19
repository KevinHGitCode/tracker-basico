// mobileSelection.js
let touchStartTime = 0;
let touchTimer = null;
let modeChangeLock = false;

function setModeLock() {
  modeChangeLock = true;
  setTimeout(() => { modeChangeLock = false; }, 300); // Bloqueo por 300ms
}

export function setupMobileSelection({ seleccionados, editandoIdxRef, mostrarRegistros }) {
  return function addMobileSelectionListeners() {
    document.querySelectorAll('.registro-item').forEach(el => {
      // Manejo de eventos touch
      el.addEventListener('touchstart', function(e) {
        // Si estamos editando o el modo está bloqueado, ignorar completamente
        if (editandoIdxRef.value !== null || modeChangeLock) {
          e.preventDefault();
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
        } else if (touchDuration < 500) {
          // Touch corto normal, comportamiento por defecto
          if (!document.body.classList.contains('selection-mode')) {
            if (seleccionados.has(idx) && seleccionados.size === 1) {
              seleccionados.clear();
            } else {
              seleccionados.clear();
              seleccionados.add(idx);
            }
            setModeLock(); // Activar bloqueo temporal
            mostrarRegistros();
          }
        }
      });

      el.addEventListener('touchmove', function(e) {
        // Cancelar el timer si el dedo se mueve
        clearTimeout(touchTimer);
      });
    });

    // Agregar botón para salir del modo selección
    const exitButton = document.createElement('button');
    exitButton.id = 'exit-selection-mode';
    exitButton.innerHTML = '✕';
    exitButton.style.display = 'none';
    document.body.appendChild(exitButton);

    exitButton.addEventListener('click', () => {
      seleccionados.clear();
      document.body.classList.remove('selection-mode');
      exitButton.style.display = 'none';
      mostrarRegistros();
    });

    // Observar cambios en el modo selección
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('selection-mode')) {
          exitButton.style.display = 'block';
        } else {
          exitButton.style.display = 'none';
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  };
}
