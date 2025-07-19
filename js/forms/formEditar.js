import { formatearInputDate } from '../helpers.js';

function editarForm(r, i) {
  return `<form class='editar-form' onsubmit='return false;'>
    <input type='date' id='edit-dia' value='${formatearInputDate(r.fecha)}'>
    <input type='time' id='edit-inicio' value='${r.inicio}'>
    <input type='time' id='edit-fin' value='${r.fin}'>
    <input type='text' id='edit-actividad' value='${r.actividad}'>
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
  
  registros[idx] = {
    fecha: fechaFormateada,
    inicio: inicioHora,
    fin: finHora,
    duracion: duracion,
    actividad: actividad
  };
  localStorage.setItem('registros', JSON.stringify(registros));
  window.sessionData.editandoIdxRef.value = null;
  window.sessionData.editandoIdx = null;
  window.core.mostrarRegistros();
}

export const formEditar = {
  editarForm,
  guardarEdicion
};
