// groupsSidebar.js
// Componente para manejar el sidebar de grupos

export function setupGroupsSidebar({ grupoSeleccionadoRef, mostrarRegistros }) {
  const sidebar = document.getElementById('groups-sidebar');
  const gruposList = document.getElementById('groups-list');
  const btnCrearGrupo = document.getElementById('btn-crear-grupo');
  const inputGrupoNombre = document.getElementById('input-grupo-nombre');
  const toggleBtn = document.getElementById('toggle-sidebar-btn');
  const showSidebarBtn = document.getElementById('show-sidebar-btn');
  const main = document.getElementById('main');
  
  // Cargar estado del sidebar desde localStorage (por defecto visible)
  let sidebarVisible = localStorage.getItem('sidebarVisible') !== 'false';
  
  function toggleSidebar() {
    sidebarVisible = !sidebarVisible;
    localStorage.setItem('sidebarVisible', sidebarVisible.toString());
    updateSidebarState();
  }
  
  function updateSidebarState() {
    if (sidebarVisible) {
      // Sidebar visible
      sidebar.classList.remove('translate-x-full');
      sidebar.classList.add('translate-x-0');
      if (main) {
        main.classList.remove('mr-auto');
        main.classList.add('ml-auto', 'mr-[calc(280px+20px)]');
      }
      if (showSidebarBtn) {
        showSidebarBtn.classList.add('hidden');
      }
    } else {
      // Sidebar oculto
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('translate-x-full');
      if (main) {
        main.classList.remove('mr-[calc(280px+20px)]');
        main.classList.add('mx-auto');
      }
      if (showSidebarBtn) {
        showSidebarBtn.classList.remove('hidden');
      }
    }
  }
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }
  
  if (showSidebarBtn) {
    showSidebarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }
  
  // Inicializar estado
  updateSidebarState();

  function renderizarGrupos() {
    const grupos = window.storage.obtenerGrupos();
    const grupoActual = grupoSeleccionadoRef.value;

    const isActiveNull = grupoActual === null ? 'bg-black text-white font-bold dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-800';
    let html = `
      <div class="group-item flex items-center p-2.5 mb-1.5 rounded-lg cursor-pointer transition-colors relative ${isActiveNull}" data-group-id="null">
        <span class="flex-1 text-[0.95em] overflow-hidden text-ellipsis whitespace-nowrap">Sin grupo</span>
        <span class="group-count bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs ml-2 min-w-[24px] text-center dark:bg-gray-700 dark:text-gray-200 ${grupoActual === null ? 'bg-white text-black dark:bg-black dark:text-white' : ''}">${window.storage.obtenerRegistros().filter(r => !r.grupo).length}</span>
      </div>
    `;

    grupos.forEach(grupo => {
      const count = window.storage.obtenerRegistros().filter(r => r.grupo === grupo.id).length;
      const isActive = grupoActual === grupo.id ? 'bg-black text-white font-bold dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-800';
      const countActive = grupoActual === grupo.id ? 'bg-white text-black dark:bg-black dark:text-white' : '';
      html += `
        <div class="group-item flex items-center p-2.5 mb-1.5 rounded-lg cursor-pointer transition-colors relative ${isActive}" data-group-id="${grupo.id}">
          <span class="flex-1 text-[0.95em] overflow-hidden text-ellipsis whitespace-nowrap">${grupo.nombre}</span>
          <span class="group-count bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs ml-2 min-w-[24px] text-center dark:bg-[#444] dark:text-[#e0e6ef] ${countActive}">${count}</span>
          <button class="group-delete ml-2 px-2 py-1 bg-transparent border-none text-gray-400 cursor-pointer opacity-0 transition-all hover:text-black dark:hover:text-white dark:text-gray-500" data-group-id="${grupo.id}" title="Eliminar grupo">
            <i class="fa-solid fa-trash text-sm"></i>
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
      
      // Mostrar botón eliminar en hover
      item.addEventListener('mouseenter', () => {
        const deleteBtn = item.querySelector('.group-delete');
        if (deleteBtn) deleteBtn.classList.remove('opacity-0');
      });
      
      item.addEventListener('mouseleave', () => {
        const deleteBtn = item.querySelector('.group-delete');
        if (deleteBtn) deleteBtn.classList.add('opacity-0');
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
    renderizarGrupos,
    toggleSidebar,
    updateSidebarState
  };
}

