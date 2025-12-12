import { formatearInputDate } from '../helpers/helpers.js';

function editarForm(r, i) {
  const grupos = window.storage.obtenerGrupos();
  const grupoActual = r.grupo || 'null';
  
  let grupoOptions = '<option value="null">Sin grupo</option>';
  grupos.forEach(grupo => {
    const selected = grupoActual === grupo.id ? 'selected' : '';
    grupoOptions += `<option value="${grupo.id}" ${selected}>${grupo.nombre}</option>`;
  });

  return `<form class='flex flex-wrap gap-2' onsubmit='return false;'>
    <input type='date' id='edit-dia' value='${formatearInputDate(r.fecha)}' class='px-3 py-2.5 border border-black rounded dark:bg-black dark:text-white dark:border-white'>
    <input type='time' id='edit-inicio' value='${r.inicio}' class='px-3 py-2.5 border border-black rounded dark:bg-black dark:text-white dark:border-white'>
    <input type='time' id='edit-fin' value='${r.fin}' class='px-3 py-2.5 border border-black rounded dark:bg-black dark:text-white dark:border-white'>
    <input type='text' id='edit-actividad' value='${r.actividad}' class='px-3 py-2.5 border border-black rounded dark:bg-black dark:text-white dark:border-white'>
    <select id='edit-grupo' class='px-3 py-2.5 border border-black rounded dark:bg-black dark:text-white dark:border-white'>
      ${grupoOptions}
    </select>
    <button class='editar-guardar px-3 py-2.5 bg-black text-white border border-black rounded cursor-pointer hover:bg-gray-800 dark:bg-white dark:text-black dark:border-white dark:hover:bg-gray-200' data-idx='${i}'>Guardar</button>
    <button class='editar-cancelar px-3 py-2.5 bg-white text-black border border-black rounded cursor-pointer hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-800' type='button'>Cancelar</button>
  </form>`;
}

function guardarEdicion(idx) {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  const dia = document.getElementById('edit-dia').value;
  const inicioHora = document.getElementById('edit-inicio').value;
  const finHora = document.getElementById('edit-fin').value;
  const actividad = document.getElementById('edit-actividad').value.trim();
  const grupoId = document.getElementById('edit-grupo').value;
  if (!dia || !inicioHora || !finHora || !actividad) {
    alert('Completa todos los campos.');
    return;
  }
  
  const partes = dia.split('-');
  const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
  const [h1, m1] = inicioHora.split(":").map(Number);
  const [h2, m2] = finHora.split(":").map(Number);
  let min1 = h1 * 60 + m1;
  let min2 = h2 * 60 + m2;
  if (min2 < min1) min2 += 24 * 60;
  const duracionMin = min2 - min1;
  const duracion = `${Math.floor(duracionMin / 60)}h ${duracionMin % 60}m`;
  
  const registroActualizado = {
    fecha: fechaFormateada,
    inicio: inicioHora,
    fin: finHora,
    duracion: duracion,
    actividad: actividad
  };
  
  // Agregar grupo solo si no es "null"
  if (grupoId !== 'null') {
    registroActualizado.grupo = grupoId;
  }
  
  window.storage.actualizarRegistro(idx, registroActualizado);
  window.sessionData.editandoIdxRef.value = null;
  window.sessionData.editandoIdx = null;
  window.core.mostrarRegistros();
  
  // Actualizar sidebar si existe
  if (window.groupsSidebar && window.groupsSidebar.renderizarGrupos) {
    window.groupsSidebar.renderizarGrupos();
  }
}

export const formEditar = {
  editarForm,
  guardarEdicion
};
