import { setupSeleccion } from '../handlers/seleccion.js';
import { setupMobileSelection } from '../handlers/mobileSelection.js';

function mostrarRegistros() {
  let registros = window.storage.obtenerRegistros();
  const grupoSeleccionado = window.sessionData.grupoSeleccionadoRef.value;
  
  // Crear array de registros con sus índices originales
  let registrosConIndices = registros.map((r, idx) => ({ registro: r, idx }));
  
  // Filtrar por grupo si hay uno seleccionado
  if (grupoSeleccionado !== null) {
    registrosConIndices = registrosConIndices.filter(item => item.registro.grupo === grupoSeleccionado);
  } else {
    // Si no hay grupo seleccionado, mostrar solo sesiones sin grupo
    registrosConIndices = registrosConIndices.filter(item => !item.registro.grupo);
  }

  let html = "<h3>Historial de Sesiones</h3>";
  const idxEdit = window.sessionData.editandoIdxRef.value !== null ? 
                 window.sessionData.editandoIdxRef.value : 
                 window.sessionData.editandoIdx;

  // Mostrar en orden inverso (más recientes primero)
  registrosConIndices.slice().reverse().forEach(({ registro: r, idx: i }) => {
    const selected = window.sessionData.seleccionados.has(i) ? 'selected' : '';
    html += `<p class="registro-item ${selected}" data-idx="${i}">
      ${idxEdit === i ? 
        window.formEditar.editarForm(r, i) : 
        `<span><b>${r.fecha}</b> | ${r.actividad} | </span> <span>${r.inicio} - ${r.fin} (${r.duracion})</span>`}
    </p>`;
  });
  
  document.getElementById('resumen').innerHTML = html;

  setupSeleccion({ 
    seleccionados: window.sessionData.seleccionados, 
    editandoIdxRef: window.sessionData.editandoIdxRef, 
    mostrarRegistros 
  })();
  
  setupMobileSelection({ 
    seleccionados: window.sessionData.seleccionados, 
    editandoIdxRef: window.sessionData.editandoIdxRef, 
    mostrarRegistros 
  })();

  if (typeof window.mostrarSumaSeleccion === 'function') {
    window.mostrarSumaSeleccion(window.sessionData.seleccionados);
  }

  document.querySelectorAll('.editar-guardar').forEach(btn => {
    btn.onclick = function() {
      window.formEditar.guardarEdicion(Number(this.getAttribute('data-idx')));
    };
  });

  document.querySelectorAll('.editar-cancelar').forEach(btn => {
    btn.onclick = function() {
      window.sessionData.editandoIdxRef.value = null;
      window.sessionData.editandoIdx = null;
      mostrarRegistros();
    };
  });
}

export const core = {
  mostrarRegistros
};
