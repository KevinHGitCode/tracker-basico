import { setupSeleccion } from '../seleccion.js';
import { setupMobileSelection } from '../mobileSelection.js';

function mostrarRegistros() {
  let registros = window.storage.obtenerRegistros();
  let html = "<h3>Historial de Sesiones</h3>";
  const idxEdit = window.sessionData.editandoIdxRef.value !== null ? 
                 window.sessionData.editandoIdxRef.value : 
                 window.sessionData.editandoIdx;

  registros.slice().reverse().forEach((r, iReverso) => {
    const i = registros.length - 1 - iReverso;
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
