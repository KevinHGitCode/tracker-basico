import { toHoraMinutos } from '../helpers/helpers.js';

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
  
  // Obtener el grupo seleccionado actualmente
  const grupoSeleccionado = window.sessionData.grupoSeleccionadoRef.value;
  
  const registro = {
    fecha: new Date().toLocaleDateString(),
    inicio: inicioStr,
    fin: finStr,
    duracion: duracionObj.texto,
    actividad: actividad
  };
  
  // Agregar grupo solo si hay uno seleccionado
  if (grupoSeleccionado !== null) {
    registro.grupo = grupoSeleccionado;
  }
  
  window.storage.guardarRegistro(registro);
  window.core.mostrarRegistros();
  
  // Actualizar sidebar si existe
  if (window.groupsSidebar && window.groupsSidebar.renderizarGrupos) {
    window.groupsSidebar.renderizarGrupos();
  }
  
  window.sessionData.inicio = null;
}

export const formCrear = {
  iniciar,
  finalizar
};
