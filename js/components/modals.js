// modals.js
// Funciones para manejo de modales (agregar sesión y ayuda)

// Recibe callbacks para guardar y refrescar registros
export function setupModals({ onAgregarSesion } = {}) {
  // Función para actualizar el selector de grupos en el modal
  function actualizarSelectorGrupos() {
    const selectGrupo = document.getElementById('modal-grupo');
    if (!selectGrupo) return;
    
    const grupos = window.storage.obtenerGrupos();
    const grupoSeleccionado = window.sessionData.grupoSeleccionadoRef.value;
    
    let html = '<option value="null">Sin grupo</option>';
    grupos.forEach(grupo => {
      const selected = grupoSeleccionado === grupo.id ? 'selected' : '';
      html += `<option value="${grupo.id}" ${selected}>${grupo.nombre}</option>`;
    });
    selectGrupo.innerHTML = html;
  }

  // Modal de ayuda
  const ayudaBtn = document.getElementById('ayuda-btn');
  const modalAyuda = document.getElementById('modal-ayuda');
  const closeAyuda = document.getElementById('closeAyuda');
  
  // Modal de estadísticas
  const modalEstadisticas = document.getElementById('modal-estadisticas');
  ayudaBtn.onclick = function() { 
    modalAyuda.classList.remove('hidden');
    modalAyuda.classList.add('flex');
  };
  closeAyuda.onclick = function() { 
    modalAyuda.classList.add('hidden');
    modalAyuda.classList.remove('flex');
  };

  // Modal de agregar sesión
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');
  closeModalBtn.onclick = cerrarModal;
  
  // Actualizar selector cuando se abre el modal
  const modalElement = document.getElementById('modal');
  if (modalElement) {
    const observer = new MutationObserver(() => {
      if (modalElement.classList.contains('flex')) {
        actualizarSelectorGrupos();
      }
    });
    observer.observe(modalElement, { attributes: true, attributeFilter: ['class'] });
  }

  // Cerrar modales al hacer clic fuera
  window.onclick = function(event) {
    if (event.target === modalAyuda) {
      modalAyuda.classList.add('hidden');
      modalAyuda.classList.remove('flex');
    }
    if (event.target === modal) {
      cerrarModal();
    }
    if (modalEstadisticas && event.target === modalEstadisticas) {
      modalEstadisticas.classList.add('hidden');
      modalEstadisticas.classList.remove('flex');
    }
  };
  function cerrarModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
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
      const grupoId = document.getElementById('modal-grupo').value;
      
      const registro = {
        fecha: fechaFormateada,
        inicio,
        fin,
        duracion,
        actividad
      };
      
      // Agregar grupo solo si no es "null"
      if (grupoId !== 'null') {
        registro.grupo = grupoId;
      }
      
      if (typeof onAgregarSesion === 'function') {
        onAgregarSesion(registro);
      }
      cerrarModal();
    };
  }
  return {
    abrirModal: function() { 
      actualizarSelectorGrupos();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    },
    cerrarModal
  };
}
