function guardarRegistro(data) {
  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  registros.push(data);
  localStorage.setItem('registros', JSON.stringify(registros));
}

function obtenerRegistros() {
  return JSON.parse(localStorage.getItem('registros') || '[]');
}

export const storage = {
  guardarRegistro,
  obtenerRegistros
};
