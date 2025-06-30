// eventos.js
// Lógica para listeners globales de teclado

export function setupEventos({ seleccionados, editandoIdxRef, mostrarRegistros, eliminarSeleccionados }) {
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
