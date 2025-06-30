// helpers.js
// Funciones utilitarias para formateo y cálculo de tiempo

export function toHoraMinutos(date) {
  return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}

export function formatearInputDate(fecha) {
  const partes = fecha.split('/');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1].padStart(2,'0')}-${partes[0].padStart(2,'0')}`;
  }
  return fecha;
}

export function calcularDuracion(inicio, fin) {
  // inicio y fin son objetos Date
  const duracionMs = fin - inicio;
  const duracionMin = Math.floor(duracionMs / 60000);
  return {
    minutos: duracionMin,
    texto: `${Math.floor(duracionMin / 60)}h ${duracionMin % 60}m`
  };
}

export function sumarDuraciones(registros, indices) {
  let totalMin = 0;
  indices.forEach(idx => {
    if (registros[idx]) {
      const dur = registros[idx].duracion;
      const match = dur.match(/(\d+)h\s(\d+)m/);
      if (match) {
        totalMin += parseInt(match[1])*60 + parseInt(match[2]);
      }
    }
  });
  return {
    minutos: totalMin,
    texto: `${Math.floor(totalMin/60)}h ${totalMin%60}m`
  };
}
