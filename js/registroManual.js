// registroManual.js
// Lógica para agregar sesión manual desde el modal

export function setupRegistroManual(guardarRegistro, mostrarRegistros) {
  const modalAgregarBtn = document.getElementById('modal-agregar');
  modalAgregarBtn.onclick = function() {
    const dia = document.getElementById('modal-dia').value;
    const inicioHora = document.getElementById('modal-inicio').value;
    const finHora = document.getElementById('modal-fin').value;
    const actividad = document.getElementById('modal-actividad').value.trim();
    if (!dia || !inicioHora || !finHora || !actividad) {
      alert('Completa todos los campos.');
      return;
    }
    // Calcular duración
    const [h1, m1] = inicioHora.split(":").map(Number);
    const [h2, m2] = finHora.split(":").map(Number);
    let min1 = h1 * 60 + m1;
    let min2 = h2 * 60 + m2;
    if (min2 < min1) min2 += 24 * 60; // Soporta sesiones que cruzan medianoche
    const duracionMin = min2 - min1;
    const duracion = `${Math.floor(duracionMin / 60)}h ${duracionMin % 60}m`;
    const registro = {
      fecha: new Date(dia).toLocaleDateString(),
      inicio: inicioHora,
      fin: finHora,
      duracion: duracion,
      actividad: actividad
    };
    guardarRegistro(registro);
    mostrarRegistros();
    document.getElementById('modal').style.display = 'none';
  };
}
