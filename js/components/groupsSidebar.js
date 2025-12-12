// groupsSidebar.js
// Componente para manejar el sidebar de grupos

export function setupGroupsSidebar({ grupoSeleccionadoRef, mostrarRegistros }) {
  const sidebar = document.getElementById('groups-sidebar');
  const gruposList = document.getElementById('groups-list');
  const btnCrearGrupo = document.getElementById('btn-crear-grupo');
  const inputGrupoNombre = document.getElementById('input-grupo-nombre');

  function renderizarGrupos() {
    const grupos = window.storage.obtenerGrupos();
    const grupoActual = grupoSeleccionadoRef.value;

    let html = `
      <div class="group-item ${grupoActual === null ? 'active' : ''}" data-group-id="null">
        <span class="group-name">Sin grupo</span>
        <span class="group-count">${window.storage.obtenerRegistros().filter(r => !r.grupo).length}</span>
      </div>
    `;

    grupos.forEach(grupo => {
      const count = window.storage.obtenerRegistros().filter(r => r.grupo === grupo.id).length;
      const active = grupoActual === grupo.id ? 'active' : '';
      html += `
        <div class="group-item ${active}" data-group-id="${grupo.id}">
          <span class="group-name">${grupo.nombre}</span>
          <span class="group-count">${count}</span>
          <button class="group-delete" data-group-id="${grupo.id}" title="Eliminar grupo">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    });

    gruposList.innerHTML = html;

    // Agregar listeners de clic
    document.querySelectorAll('.group-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // No cambiar si se hace clic en el botón de eliminar
        if (e.target.closest('.group-delete')) return;
        
        const groupId = item.getAttribute('data-group-id');
        grupoSeleccionadoRef.value = groupId === 'null' ? null : groupId;
        renderizarGrupos();
        mostrarRegistros();
      });
    });

    // Agregar listeners para eliminar grupos
    document.querySelectorAll('.group-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const groupId = btn.getAttribute('data-group-id');
        if (confirm('¿Eliminar este grupo? Las sesiones no se eliminarán, solo se quitará su agrupación.')) {
          window.storage.eliminarGrupo(groupId);
          // Si el grupo eliminado estaba seleccionado, volver a "sin grupo"
          if (grupoSeleccionadoRef.value === groupId) {
            grupoSeleccionadoRef.value = null;
          }
          renderizarGrupos();
          mostrarRegistros();
        }
      });
    });
  }

  // Crear nuevo grupo
  function crearGrupo() {
    const nombre = inputGrupoNombre.value.trim();
    if (!nombre) {
      alert('Ingresa un nombre para el grupo');
      return;
    }
    const nuevoGrupo = window.storage.crearGrupo(nombre);
    inputGrupoNombre.value = '';
    renderizarGrupos();
    // Opcional: seleccionar el grupo recién creado
    grupoSeleccionadoRef.value = nuevoGrupo.id;
    renderizarGrupos();
    mostrarRegistros();
  }

  if (btnCrearGrupo) {
    btnCrearGrupo.addEventListener('click', crearGrupo);
  }

  if (inputGrupoNombre) {
    inputGrupoNombre.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        crearGrupo();
      }
    });
  }

  // Renderizar inicialmente
  renderizarGrupos();

  return {
    renderizarGrupos
  };
}

