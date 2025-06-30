// modals.js
// Funciones para manejo de modales (agregar sesión y ayuda)

// Recibe callbacks para guardar y refrescar registros
export function setupModals({ onAgregarSesion } = {}) {
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
  // Lógica para agregar sesión manual
  const agregarBtn = document.getElementById('modal-agregar');
  if (agregarBtn) {
    agregarBtn.onclick = function() {
      const dia = document.getElementById('modal-dia').value;
      const inicio = document.getElementById('modal-inicio').value;
      const fin = document.getElementById('modal-fin').value;
      const actividad = document.getElementById('modal-actividad').value.trim();
      if (!dia || !inicio || !fin || !actividad) {
        alert('Completa todos los campos.');
        return;
      }
      // Formato dd/mm/yyyy
      const partes = dia.split('-');
      const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
      // Calcular duración
      const [h1, m1] = inicio.split(":").map(Number);
      const [h2, m2] = fin.split(":").map(Number);
      let min1 = h1 * 60 + m1;
      let min2 = h2 * 60 + m2;
      if (min2 < min1) min2 += 24 * 60;
      const duracionMin = min2 - min1;
      const duracion = `${Math.floor(duracionMin / 60)}h ${duracionMin % 60}m`;
      const registro = {
        fecha: fechaFormateada,
        inicio,
        fin,
        duracion,
        actividad
      };
      if (typeof onAgregarSesion === 'function') {
        onAgregarSesion(registro);
      }
      cerrarModal();
    };
  }
  return {
    abrirModal: function() { modal.style.display = 'block'; },
    cerrarModal
  };
}
