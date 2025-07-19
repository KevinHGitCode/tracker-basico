import { toHoraMinutos } from '../helpers.js';

function iniciar() {
  const actividad = document.getElementById('actividad').value.trim();
  if (actividad === "") {
    alert("Ingresa una actividad.");
    return;
  }
  window.sessionData.inicio = new Date();
  alert("Iniciado a las " + toHoraMinutos(window.sessionData.inicio));
}

function finalizar() {
  if (!window.sessionData.inicio) {
    alert("Primero debes iniciar una sesión.");
    return;
  }
  const fin = new Date();
  const actividad = document.getElementById('actividad').value.trim();
  const inicioStr = toHoraMinutos(window.sessionData.inicio);
  const finStr = toHoraMinutos(fin);
  const duracionObj = window.helpers.calcularDuracion(window.sessionData.inicio, fin);
  const registro = {
    fecha: new Date().toLocaleDateString(),
    inicio: inicioStr,
    fin: finStr,
    duracion: duracionObj.texto,
    actividad: actividad
  };
  window.storage.guardarRegistro(registro);
  window.core.mostrarRegistros();
  window.sessionData.inicio = null;
}

export const formCrear = {
  iniciar,
  finalizar
};
