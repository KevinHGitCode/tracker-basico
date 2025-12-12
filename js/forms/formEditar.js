import { formatearInputDate } from '../helpers/helpers.js';

function editarForm(r, i) {
  const grupos = window.storage.obtenerGrupos();
  const grupoActual = r.grupo || 'null';
  
  let grupoOptions = '<option value="null">Sin grupo</option>';
  grupos.forEach(grupo => {
    const selected = grupoActual === grupo.id ? 'selected' : '';
    grupoOptions += `<option value="${grupo.id}" ${selected}>${grupo.nombre}</option>`;
  });

  return `<form class='editar-form' onsubmit='return false;'>
    <input type='date' id='edit-dia' value='${formatearInputDate(r.fecha)}'>
    <input type='time' id='edit-inicio' value='${r.inicio}'>
    <input type='time' id='edit-fin' value='${r.fin}'>
    <input type='text' id='edit-actividad' value='${r.actividad}'>
    <select id='edit-grupo'>
      ${grupoOptions}
    </select>
    <button class='editar-guardar' data-idx='${i}'>Guardar</button>
    <button class='editar-cancelar' type='button'>Cancelar</button>
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
