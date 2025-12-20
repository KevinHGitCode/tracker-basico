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

  let html = "<h3 class='text-xl font-semibold mb-4'>Historial de Sesiones</h3>";
  const idxEdit = window.sessionData.editandoIdxRef.value !== null ? 
                 window.sessionData.editandoIdxRef.value : 
                 window.sessionData.editandoIdx;

  html += `<table class="w-full border-collapse">
    <thead>
      <tr class="border-b border-gray-300 dark:border-gray-600">
        <th class="text-left p-2 font-semibold">Fecha</th>
        <th class="text-left p-2 font-semibold">Actividad</th>
        <th class="text-left p-2 font-semibold">Inicio</th>
        <th class="text-left p-2 font-semibold">Fin</th>
        <th class="text-left p-2 font-semibold">Duración</th>
      </tr>
    </thead>
    <tbody>`;

  // Mostrar en orden inverso (más recientes primero)
  registrosConIndices.slice().reverse().forEach(({ registro: r, idx: i }) => {
    const selected = window.sessionData.seleccionados.has(i) ? 'selected' : '';
    
    if (idxEdit === i) {
      // Si está en modo edición, mostrar el formulario ocupando todas las columnas
      html += `<tr class="registro-item ${selected}" data-idx="${i}">
        <td colspan="5" class="p-2">
          ${window.formEditar.editarForm(r, i)}
        </td>
      </tr>`;
    } else {
      html += `<tr class="registro-item cursor-pointer transition-colors ${selected}" data-idx="${i}">
        <td class="p-2 border-b border-gray-200 dark:border-gray-700"><b>${r.fecha}</b></td>
        <td class="p-2 border-b border-gray-200 dark:border-gray-700">${r.actividad}</td>
        <td class="p-2 border-b border-gray-200 dark:border-gray-700">${r.inicio}</td>
        <td class="p-2 border-b border-gray-200 dark:border-gray-700">${r.fin}</td>
        <td class="p-2 border-b border-gray-200 dark:border-gray-700">${r.duracion}</td>
      </tr>`;
    }
  });
  
  html += `</tbody></table>`;
  
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
