// estadisticas.js
// Componente para mostrar estadísticas de hoy

import { storage } from '../storage/storage.js';

function parsearDuracion(duracionStr) {
  // Parsea una duración en formato "2h 30m" a minutos
  const match = duracionStr.match(/(\d+)h\s*(\d+)m/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
}

function calcularEstadisticasHoy() {
  const registros = storage.obtenerRegistros();
  const hoy = new Date().toLocaleDateString();
  
  // Filtrar registros de hoy
  const registrosHoy = registros.filter(r => r.fecha === hoy);
  
  if (registrosHoy.length === 0) {
    return {
      totalMinutos: 0,
      totalTexto: '0h 0m',
      cantidadSesiones: 0,
      porActividad: {},
      porGrupo: {}
    };
  }
  
  // Calcular tiempo total
  let totalMinutos = 0;
  registrosHoy.forEach(r => {
    totalMinutos += parsearDuracion(r.duracion);
  });
  
  // Calcular estadísticas por actividad
  const porActividad = {};
  registrosHoy.forEach(r => {
    if (!porActividad[r.actividad]) {
      porActividad[r.actividad] = {
        minutos: 0,
        cantidad: 0
      };
    }
    porActividad[r.actividad].minutos += parsearDuracion(r.duracion);
    porActividad[r.actividad].cantidad += 1;
  });
  
  // Calcular estadísticas por grupo
  const grupos = storage.obtenerGrupos();
  const gruposMap = {};
  grupos.forEach(g => {
    gruposMap[g.id] = g.nombre;
  });
  
  const porGrupo = {};
  registrosHoy.forEach(r => {
    const grupoNombre = r.grupo ? (gruposMap[r.grupo] || 'Grupo desconocido') : 'Sin grupo';
    if (!porGrupo[grupoNombre]) {
      porGrupo[grupoNombre] = {
        minutos: 0,
        cantidad: 0
      };
    }
    porGrupo[grupoNombre].minutos += parsearDuracion(r.duracion);
    porGrupo[grupoNombre].cantidad += 1;
  });
  
  return {
    totalMinutos,
    totalTexto: `${Math.floor(totalMinutos / 60)}h ${totalMinutos % 60}m`,
    cantidadSesiones: registrosHoy.length,
    porActividad,
    porGrupo
  };
}

function formatearTiempo(minutos) {
  return `${Math.floor(minutos / 60)}h ${minutos % 60}m`;
}

function mostrarEstadisticas() {
  const stats = calcularEstadisticasHoy();
  const contenido = document.getElementById('estadisticas-contenido');
  
  let html = `<div class="mb-4">
    <p class="text-xl font-bold mb-2">⏱️ Tiempo Total: ${stats.totalTexto}</p>
    <p class="text-gray-600 dark:text-gray-400">${stats.cantidadSesiones} sesión${stats.cantidadSesiones !== 1 ? 'es' : ''} registrada${stats.cantidadSesiones !== 1 ? 's' : ''}</p>
  </div>`;
  
  // Estadísticas por actividad
  const actividades = Object.keys(stats.porActividad);
  if (actividades.length > 0) {
    html += `<div class="mb-4">
      <h3 class="font-semibold text-lg mb-2">📋 Por Actividad:</h3>
      <ul class="list-disc list-inside space-y-1">`;
    actividades.forEach(actividad => {
      const info = stats.porActividad[actividad];
      html += `<li><b>${actividad}</b>: ${formatearTiempo(info.minutos)} (${info.cantidad} sesión${info.cantidad !== 1 ? 'es' : ''})</li>`;
    });
    html += `</ul></div>`;
  }
  
  // Estadísticas por grupo
  const grupos = Object.keys(stats.porGrupo);
  if (grupos.length > 0) {
    html += `<div class="mb-4">
      <h3 class="font-semibold text-lg mb-2">👥 Por Grupo:</h3>
      <ul class="list-disc list-inside space-y-1">`;
    grupos.forEach(grupo => {
      const info = stats.porGrupo[grupo];
      html += `<li><b>${grupo}</b>: ${formatearTiempo(info.minutos)} (${info.cantidad} sesión${info.cantidad !== 1 ? 'es' : ''})</li>`;
    });
    html += `</ul></div>`;
  }
  
  contenido.innerHTML = html;
}

function abrirModalEstadisticas() {
  mostrarEstadisticas();
  const modalEstadisticas = document.getElementById('modal-estadisticas');
  modalEstadisticas.classList.remove('hidden');
  modalEstadisticas.classList.add('flex');
}

export function setupEstadisticas() {
  const estadisticasBtn = document.getElementById('estadisticas-btn');
  const modalEstadisticas = document.getElementById('modal-estadisticas');
  const closeEstadisticas = document.getElementById('closeEstadisticas');
  
  estadisticasBtn.onclick = abrirModalEstadisticas;
  
  closeEstadisticas.onclick = function() {
    modalEstadisticas.classList.add('hidden');
    modalEstadisticas.classList.remove('flex');
  };
  
  // Exponer la función para que pueda ser llamada desde otros módulos
  return {
    abrirModalEstadisticas
  };
}

