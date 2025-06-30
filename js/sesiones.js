// sesiones.js
// Lógica principal para gestión de sesiones, selección, edición y suma

import { setupModals } from './modals.js';
import { setupDarkTheme } from './darkTheme.js';
import { toHoraMinutos, formatearInputDate, calcularDuracion, sumarDuraciones } from './helpers.js';
import { mostrarSumaSeleccion, eliminarSeleccionados } from './seleccion.js';


let inicio = null;
let seleccionados = new Set();
let editandoIdx = null;
let modals;

const editandoIdxRef = { value: null };
document.addEventListener('DOMContentLoaded', () => {
  setupDarkTheme();
  modals = setupModals();

  window.modals = modals; // para eventos globales
  window.mostrarSumaSeleccion = mostrarSumaSeleccion;
  window.eliminarSeleccionados = (seleccionadosArg, mostrarRegistrosArg) => {
    // Siempre pasar los valores actuales
    eliminarSeleccionados(seleccionados, mostrarRegistros);
  };

  mostrarRegistros();
  // Modular: listeners globales
  import('./eventos.js').then(({ setupEventos }) => {
    setupEventos({ seleccionados, editandoIdxRef, mostrarRegistros, eliminarSeleccionados });
  });
});

// El listener global de teclado ahora está en eventos.js

function iniciar() {
  const actividad = document.getElementById('actividad').value.trim();
  if (actividad === "") {
    alert("Ingresa una actividad.");
    return;
  }
  inicio = new Date();
  alert("Iniciado a las " + toHoraMinutos(inicio));
}
window.iniciar = iniciar;

function finalizar() {
  if (!inicio) {
    alert("Primero debes iniciar una sesión.");
    return;
  }
  const fin = new Date();
  const actividad = document.getElementById('actividad').value.trim();
  const inicioStr = toHoraMinutos(inicio);
  const finStr = toHoraMinutos(fin);
  const duracionObj = calcularDuracion(inicio, fin);
  const registro = {
    fecha: new Date().toLocaleDateString(),
    inicio: inicioStr,
    fin: finStr,
    duracion: duracionObj.texto,
    actividad: actividad
  };
  guardarRegistro(registro);
  mostrarRegistros();
  inicio = null;
}
window.finalizar = finalizar;

function guardarRegistro(data) {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  registros.push(data);
  localStorage.setItem('registros', JSON.stringify(registros));
}

import { setupSeleccion } from './seleccion.js';
function mostrarRegistros() {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  let html = "<h3>Historial de Sesiones</h3>";
  const idxEdit = editandoIdxRef.value !== null ? editandoIdxRef.value : editandoIdx;
  registros.forEach((r, i) => {
    const selected = seleccionados.has(i) ? 'selected' : '';
    html += `<p class=\"registro-item ${selected}\" data-idx=\"${i}\">${idxEdit===i ? editarForm(r,i) : `<b>${r.fecha}</b> | ${r.actividad} | ${r.inicio} - ${r.fin} (${r.duracion})`}</p>`;
  });
  html += '<div id="suma-seleccion"></div>';
  document.getElementById('resumen').innerHTML = html;

  // Modular: listeners de selección
  setupSeleccion({ seleccionados, editandoIdxRef, mostrarRegistros })();

  if (typeof window.mostrarSumaSeleccion === 'function') {
    window.mostrarSumaSeleccion(seleccionados);
  }
  document.querySelectorAll('.editar-guardar').forEach(btn => {
    btn.onclick = function() {
      guardarEdicion(Number(this.getAttribute('data-idx')));
    };
  });
  document.querySelectorAll('.editar-cancelar').forEach(btn => {
    btn.onclick = function() {
      editandoIdxRef.value = null;
      editandoIdx = null;
      mostrarRegistros();
    };
  });
}

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
  // Corregir: la fecha debe mostrarse igual que en el registro manual, sin desfase
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
  editandoIdxRef.value = null;
  editandoIdx = null;
  mostrarRegistros();
}

