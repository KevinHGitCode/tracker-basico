// eventos.js
// Lógica para listeners globales de teclado

export function setupEventos({ seleccionados, editandoIdxRef, mostrarRegistros, eliminarSeleccionados }) {
  // Solo configurar eventos de mouse en dispositivos no táctiles
  if (!('ontouchstart' in window) && !navigator.maxTouchPoints) {
    document.addEventListener('click', function(e) {
      const item = e.target.closest('.registro-item');
      if (!item) return;

      const idx = Number(item.getAttribute('data-idx'));
      if (e.ctrlKey || e.metaKey) {
        // Toggle selección con Ctrl/Cmd
        if (seleccionados.has(idx)) {
          seleccionados.delete(idx);
        } else {
          seleccionados.add(idx);
        }
      } else if (e.shiftKey && seleccionados.size > 0) {
        // Selección de rango con Shift
        const lastSelected = Math.min(...seleccionados);
        const start = Math.min(lastSelected, idx);
        const end = Math.max(lastSelected, idx);
        for (let i = start; i <= end; i++) {
          seleccionados.add(i);
        }
      } else {
        // Click normal
        seleccionados.clear();
        seleccionados.add(idx);
      }
      mostrarRegistros();
    });
  }

  window.addEventListener('keydown', function(e) {
    // Escape abre modal de agregar
    if (e.key === 'Escape' && window.modals && window.modals.abrirModal) {
      window.modals.abrirModal();
    }
    // Delete/Backspace elimina seleccionados (si no está en input/textarea)
    if ((e.key === 'Delete' || e.key === 'Backspace') && seleccionados.size > 0 && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      eliminarSeleccionados(seleccionados, mostrarRegistros);
    }
    // Enter edita si hay solo uno seleccionado y no se está editando
    if (e.key === 'Enter' && seleccionados.size === 1 && editandoIdxRef.value === null && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      editandoIdxRef.value = Array.from(seleccionados)[0];
      mostrarRegistros();
    }
  });
}
