// modals.js
// Funciones para manejo de modales (agregar sesión y ayuda)

export function setupModals() {
  // Modal de ayuda
  const ayudaBtn = document.getElementById('ayuda-btn');
  const modalAyuda = document.getElementById('modal-ayuda');
  const closeAyuda = document.getElementById('closeAyuda');
  ayudaBtn.onclick = function() { modalAyuda.style.display = 'block'; };
  closeAyuda.onclick = function() { modalAyuda.style.display = 'none'; };

  // Modal de agregar sesión
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');
  closeModalBtn.onclick = cerrarModal;
  function cerrarModal() {
    modal.style.display = 'none';
    document.getElementById('modal-dia').value = '';
    document.getElementById('modal-inicio').value = '';
    document.getElementById('modal-fin').value = '';
    document.getElementById('modal-actividad').value = '';
  }
  return {
    abrirModal: function() { modal.style.display = 'block'; },
    cerrarModal
  };
}
