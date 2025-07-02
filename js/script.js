let inicio = null;
// Este archivo ya no es necesario. Toda la lógica ha sido migrada a sesiones.js, modals.js, darkTheme.js y registroManual.js
  const actividad = document.getElementById('actividad').value.trim();
  if (actividad === "") {
    alert("Ingresa una actividad.");
    return;
  }
  inicio = new Date();
  alert("Iniciado a las " + inicio.toLocaleTimeString());
// ...existing code...

function finalizar() {
  if (!inicio) {
    alert("Primero debes iniciar una sesión.");
    return;
  }
  const fin = new Date();
  const actividad = document.getElementById('actividad').value.trim();
  const duracionMs = fin - inicio;
  const duracionMin = Math.floor(duracionMs / 60000);
  const duracion = `${Math.floor(duracionMin / 60)}h ${duracionMin % 60}m`;

  const registro = {
    fecha: new Date().toLocaleDateString(),
    inicio: inicio.toLocaleTimeString(),
    fin: fin.toLocaleTimeString(),
    duracion: duracion,
    actividad: actividad
  };

  guardarRegistro(registro);
  mostrarRegistros();
  inicio = null;
}

function guardarRegistro(data) {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  registros.push(data);
  localStorage.setItem('registros', JSON.stringify(registros));
}


let seleccionados = new Set();
let editandoIdx = null;

function mostrarRegistros() {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  let html = "<h3>Historial de Sesiones</h3>";
  registros.forEach((r, i) => {
    const selected = seleccionados.has(i) ? 'selected' : '';
    html += `<p class=\"registro-item ${selected}\" data-idx=\"${i}\">${editandoIdx===i ? editarForm(r,i) : `<b>${r.fecha}</b> | ${r.actividad} | ${r.inicio} - ${r.fin} (${r.duracion})`}</p>`;
  });
  html += '<div id="suma-seleccion"></div>';
  document.getElementById('resumen').innerHTML = html;

  // Listeners para selección y edición
  document.querySelectorAll('.registro-item').forEach(el => {
    el.onclick = function(e) {
      const idx = Number(this.getAttribute('data-idx'));
      if (editandoIdx !== null) return; // No seleccionar si está editando
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
      mostrarSumaSeleccion();
    };
  });
  mostrarSumaSeleccion();
  // Listeners para guardar/cancelar edición
  document.querySelectorAll('.editar-guardar').forEach(btn => {
    btn.onclick = function() {
      guardarEdicion(Number(this.getAttribute('data-idx')));
    };
  });
  document.querySelectorAll('.editar-cancelar').forEach(btn => {
    btn.onclick = function() {
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

function formatearInputDate(fecha) {
  // Convierte dd/mm/yyyy o similar a yyyy-mm-dd
  const partes = fecha.split('/');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1].padStart(2,'0')}-${partes[0].padStart(2,'0')}`;
  }
  return fecha;
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
  // Calcular duración
  const [h1, m1] = inicioHora.split(":").map(Number);
  const [h2, m2] = finHora.split(":").map(Number);
  let min1 = h1 * 60 + m1;
  let min2 = h2 * 60 + m2;
  if (min2 < min1) min2 += 24 * 60;
  const duracionMin = min2 - min1;
  const duracion = `${Math.floor(duracionMin / 60)}h ${duracionMin % 60}m`;
  registros[idx] = {
    fecha: new Date(dia).toLocaleDateString(),
    inicio: inicioHora,
    fin: finHora,
    duracion: duracion,
    actividad: actividad
  };
  localStorage.setItem('registros', JSON.stringify(registros));
  editandoIdx = null;
  mostrarRegistros();
}

function mostrarSumaSeleccion() {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  let totalMin = 0;
  seleccionados.forEach(idx => {
    if (registros[idx]) {
      const dur = registros[idx].duracion;
      const match = dur.match(/(\d+)h\s(\d+)m/);
      if (match) {
        totalMin += parseInt(match[1])*60 + parseInt(match[2]);
      }
    }
  });
  let suma = '';
  if (seleccionados.size > 0) {
    suma = `<b>Total seleccionado:</b> ${Math.floor(totalMin/60)}h ${totalMin%60}m`;
  }
  document.getElementById('suma-seleccion').innerHTML = suma;
}

function eliminarSeleccionados() {
  if (seleccionados.size === 0) return;
  const pass = prompt('Introduce la contraseña para eliminar:');
  if (pass !== 'delete') {
    alert('Contraseña incorrecta.');
    return;
  }
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  // Eliminar de mayor a menor para no desordenar índices
  const indices = Array.from(seleccionados).sort((a,b)=>b-a);
  indices.forEach(idx => {
    registros.splice(idx, 1);
  });
  localStorage.setItem('registros', JSON.stringify(registros));
  seleccionados.clear();
  mostrarRegistros();
}

// Eliminar con tecla Suprimir o Backspace y editar con Enter
window.addEventListener('keydown', function(e) {
  if ((e.key === 'Delete' || e.key === 'Backspace') && seleccionados.size > 0 && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    eliminarSeleccionados();
  }
  if (e.key === 'Enter' && seleccionados.size === 1 && editandoIdx === null && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    editandoIdx = Array.from(seleccionados)[0];
    mostrarRegistros();
  }
});

function eliminarRegistro(idx) {
  const pass = prompt('Introduce la contraseña para eliminar:');
  if (pass !== 'delete') {
    alert('Contraseña incorrecta.');
    return;
  }
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  registros.splice(idx, 1);
  localStorage.setItem('registros', JSON.stringify(registros));
  mostrarRegistros();
}

mostrarRegistros();
