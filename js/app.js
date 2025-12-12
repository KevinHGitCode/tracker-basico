// sesiones.js
// Lógica principal para gestión de sesiones, selección, edición y suma

import { setupModals } from './components/modals.js';
import { setupDarkTheme } from './themes/dark.js';
import { toHoraMinutos, calcularDuracion } from './helpers/helpers.js';
import { mostrarSumaSeleccion, eliminarSeleccionados } from './handlers/seleccion.js';
import { setupFloatingMenu } from './components/floatingMenu.js';
import { formCrear } from './forms/formCrear.js';
import { formEditar } from './forms/formEditar.js';
import { storage } from './storage/storage.js';
import { core } from './core/core.js';
import { sessionData } from './data/sessionData.js';
import { setupGroupsSidebar } from './components/groupsSidebar.js';

// Inicializar datos globales
window.sessionData = sessionData;
window.helpers = { calcularDuracion, toHoraMinutos };
window.storage = storage;
window.core = core;
window.formEditar = formEditar;

document.addEventListener('DOMContentLoaded', () => {
  setupDarkTheme();
  setupFloatingMenu();
  const modals = setupModals({
    onAgregarSesion: (registro) => {
      storage.guardarRegistro(registro);
      core.mostrarRegistros();
      // Actualizar sidebar después de agregar sesión
      if (window.groupsSidebar && window.groupsSidebar.renderizarGrupos) {
        window.groupsSidebar.renderizarGrupos();
      }
    }
  });

  // Inicializar sidebar de grupos
  const groupsSidebar = setupGroupsSidebar({
    grupoSeleccionadoRef: sessionData.grupoSeleccionadoRef,
    mostrarRegistros: core.mostrarRegistros
  });
  window.groupsSidebar = groupsSidebar;

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
  import('./handlers/eventos.js').then(({ setupEventos }) => {
    setupEventos({ 
      seleccionados: sessionData.seleccionados, 
      editandoIdxRef: sessionData.editandoIdxRef, 
      mostrarRegistros: core.mostrarRegistros, 
      eliminarSeleccionados 
    });
  });
});

