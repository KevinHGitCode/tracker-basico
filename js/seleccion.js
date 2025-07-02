// seleccion.js
// Lógica para selección de sesiones, suma y eliminación
import { sumarDuraciones } from './helpers.js';

export function setupSeleccion({ seleccionados, editandoIdxRef, mostrarRegistros }) {
  return function addSeleccionListeners() {
    document.querySelectorAll('.registro-item').forEach(el => {
      el.onclick = function(e) {
        const idx = Number(this.getAttribute('data-idx'));
        if (editandoIdxRef.value !== null) return;
        if (e.ctrlKey || e.metaKey) {
          if (seleccionados.has(idx)) seleccionados.delete(idx);
          else seleccionados.add(idx);
        } else if (e.shiftKey && seleccionados.size > 0) {
          const arr = Array.from(seleccionados);
          const last = arr[arr.length-1];
          const min = Math.min(last, idx);
          const max = Math.max(last, idx);
          for (let j = min; j <= max; j++) seleccionados.add(j);
        } else {
          if (seleccionados.has(idx) && seleccionados.size === 1) {
            seleccionados.clear();
          } else {
            seleccionados.clear();
            seleccionados.add(idx);
          }
        }
        mostrarRegistros();
        mostrarSumaSeleccion(seleccionados);
      };
    });
  };
}

export function mostrarSumaSeleccion(seleccionados) {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  const indices = Array.from(seleccionados);
  const sumaObj = sumarDuraciones(registros, indices);
  let suma = '';
  if (seleccionados.size > 0) {
    suma = `<b>Total seleccionado:</b> ${sumaObj.texto}`;
  }
  document.getElementById('suma-seleccion').innerHTML = suma;
}

export function eliminarSeleccionados(seleccionados, mostrarRegistros) {
  if (!seleccionados || typeof seleccionados.size !== 'number' || seleccionados.size === 0) return;
  const pass = prompt('Introduce la contraseña para eliminar:');
  if (pass !== 'delete') {
    alert('Contraseña incorrecta.');
    return;
  }
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  const indices = Array.from(seleccionados).sort((a,b)=>b-a);
  indices.forEach(idx => {
    registros.splice(idx, 1);
  });
  localStorage.setItem('registros', JSON.stringify(registros));
  seleccionados.clear();
  if (typeof mostrarRegistros === 'function') mostrarRegistros();
}
