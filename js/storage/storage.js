function guardarRegistro(data) {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  registros.push(data);
  localStorage.setItem('registros', JSON.stringify(registros));
}

function obtenerRegistros() {
  return JSON.parse(localStorage.getItem('registros') || '[]');
}

function actualizarRegistro(idx, data) {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  if (idx >= 0 && idx < registros.length) {
    registros[idx] = data;
    localStorage.setItem('registros', JSON.stringify(registros));
  }
}

function obtenerGrupos() {
  return JSON.parse(localStorage.getItem('grupos') || '[]');
}

function crearGrupo(nombre) {
  let grupos = obtenerGrupos();
  const nuevoGrupo = {
    id: Date.now().toString(),
    nombre: nombre.trim()
  };
  grupos.push(nuevoGrupo);
  localStorage.setItem('grupos', JSON.stringify(grupos));
  return nuevoGrupo;
}

function eliminarGrupo(id) {
  let grupos = obtenerGrupos();
  grupos = grupos.filter(g => g.id !== id);
  localStorage.setItem('grupos', JSON.stringify(grupos));
  // Remover el grupo de todas las sesiones
  let registros = obtenerRegistros();
  registros = registros.map(r => {
    if (r.grupo === id) {
      const { grupo, ...rest } = r;
      return rest;
    }
    return r;
  });
  localStorage.setItem('registros', JSON.stringify(registros));
}

export const storage = {
  guardarRegistro,
  obtenerRegistros,
  actualizarRegistro,
  obtenerGrupos,
  crearGrupo,
  eliminarGrupo
};
