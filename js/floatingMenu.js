// floatingMenu.js
export function setupFloatingMenu() {
  const menuBtn = document.createElement('button');
  menuBtn.id = 'floating-menu-btn';
  menuBtn.innerHTML = '<i class="fa-solid fa-compass"></i>';
  menuBtn.title = 'Menú de opciones';

  const menuContainer = document.createElement('div');
  menuContainer.id = 'floating-menu-container';

  const options = [
    { icon: 'fa-plus', text: 'Agregar', action: () => {
      const modal = document.getElementById('modal');
      modal.style.display = 'block';
    }},
    { icon: 'fa-trash', text: 'Eliminar', action: () => {
      const password = prompt('Ingresa la contraseña para eliminar:');
      if (password === 'delete') {
        document.dispatchEvent(new Event('deleteSelected'));
      }
    }},
    { icon: 'fa-circle-question', text: 'Ayuda', action: () => {
      const modalAyuda = document.getElementById('modal-ayuda');
      modalAyuda.style.display = 'block';
    }}
  ];

  options.forEach((opt, i) => {
    const button = document.createElement('button');
    button.className = 'floating-menu-option';
    button.style.setProperty('--index', i);
    button.innerHTML = `<i class="fa-solid ${opt.icon}"></i>`;
    button.title = opt.text;
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      opt.action();
      toggleMenu(false);
    });
    menuContainer.appendChild(button);
  });

  document.body.appendChild(menuContainer);
  document.body.appendChild(menuBtn);

  let menuOpen = false;

  function toggleMenu(force = !menuOpen) {
    menuOpen = force;
    menuContainer.classList.toggle('active', menuOpen);
    menuBtn.classList.toggle('active', menuOpen);
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', () => {
    if (menuOpen) toggleMenu(false);
  });
}
