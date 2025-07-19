// sesiones.js
// Lógica principal para gestión de sesiones, selección, edición y suma

import { setupModals } from './modals.js';
import { setupDarkTheme } from './darkTheme.js';
import { toHoraMinutos, calcularDuracion } from './helpers.js';
import { mostrarSumaSeleccion, eliminarSeleccionados } from './seleccion.js';
import { formCrear } from './forms/formCrear.js';
import { formEditar } from './forms/formEditar.js';
import { storage } from './storage/storage.js';
import { core } from './core/core.js';
import { sessionData } from './sessionData.js';

// Inicializar datos globales
window.sessionData = sessionData;
window.helpers = { calcularDuracion, toHoraMinutos };
window.storage = storage;
window.core = core;
window.formEditar = formEditar;

document.addEventListener('DOMContentLoaded', () => {
  setupDarkTheme();
  const modals = setupModals({
    onAgregarSesion: (registro) => {
      storage.guardarRegistro(registro);
      core.mostrarRegistros();
    }
  });

  window.modals = modals;
  window.mostrarSumaSeleccion = mostrarSumaSeleccion;
  window.eliminarSeleccionados = (seleccionadosArg, mostrarRegistrosArg) => {
    eliminarSeleccionados(sessionData.seleccionados, core.mostrarRegistros);
  };

  // Asignar funciones de formulario al objeto window
  window.iniciar = formCrear.iniciar;
  window.finalizar = formCrear.finalizar;

  core.mostrarRegistros();

  // Modular: listeners globales
  import('./eventos.js').then(({ setupEventos }) => {
    setupEventos({ 
      seleccionados: sessionData.seleccionados, 
      editandoIdxRef: sessionData.editandoIdxRef, 
      mostrarRegistros: core.mostrarRegistros, 
      eliminarSeleccionados 
    });
  });
});

