// Datos globales de la sesión
export const sessionData = {
  inicio: null,
  seleccionados: new Set(),
  editandoIdx: null,
  editandoIdxRef: { value: null },
  grupoSeleccionado: null, // null significa "sin grupo" o "todos"
  grupoSeleccionadoRef: { value: null }
};
