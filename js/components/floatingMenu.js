// floatingMenu.js
export function setupFloatingMenu() {
  const menuBtn = document.createElement('button');
  menuBtn.id = 'floating-menu-btn';
  menuBtn.className = 'fixed bottom-5 left-5 w-11 h-11 rounded-full bg-white text-black border border-black shadow-[0_2px_8px_rgba(0,0,0,0.15)] cursor-pointer z-[2000] text-2xl transition-all hidden md:hidden hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-800';
  menuBtn.innerHTML = '<i class="fa-solid fa-compass"></i>';
  menuBtn.title = 'Menú de opciones';

  const menuContainer = document.createElement('div');
  menuContainer.id = 'floating-menu-container';
  menuContainer.className = 'fixed bottom-5 left-5 w-14 h-14 z-[1999] hidden';

  const options = [
    { icon: 'fa-plus', text: 'Agregar', action: () => {
      const modal = document.getElementById('modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }},
    { icon: 'fa-trash', text: 'Eliminar', action: () => {
      const password = prompt('Ingresa la contraseña para eliminar:');
      if (password === 'delete') {
        document.dispatchEvent(new Event('deleteSelected'));
      }
    }},
    { icon: 'fa-circle-question', text: 'Ayuda', action: () => {
      const modalAyuda = document.getElementById('modal-ayuda');
      modalAyuda.classList.remove('hidden');
      modalAyuda.classList.add('flex');
    }}
  ];

  options.forEach((opt, i) => {
    const button = document.createElement('button');
    button.className = 'floating-menu-option absolute w-11 h-11 rounded-full bg-white text-black border border-black shadow-[0_2px_8px_rgba(0,0,0,0.15)] cursor-pointer text-2xl transition-all opacity-0 scale-75 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-800';
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
    if (menuOpen) {
      menuContainer.classList.add('block');
      menuContainer.classList.remove('hidden');
      menuBtn.style.transform = 'rotate(225deg)';
      // Animar opciones
      const options = menuContainer.querySelectorAll('.floating-menu-option');
      options.forEach((btn, i) => {
        btn.classList.remove('opacity-0');
        btn.classList.remove('scale-75');
        btn.classList.add('scale-100');
        const positions = [
          { x: 70, y: -10 },
          { x: 50, y: -50 },
          { x: 10, y: -70 }
        ];
        btn.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px) scale(1)`;
      });
    } else {
      menuContainer.classList.remove('block');
      menuContainer.classList.add('hidden');
      menuBtn.style.transform = '';
      const options = menuContainer.querySelectorAll('.floating-menu-option');
      options.forEach(btn => {
        btn.classList.add('opacity-0');
        btn.classList.add('scale-75');
        btn.classList.remove('scale-100');
        btn.style.transform = '';
      });
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', () => {
    if (menuOpen) toggleMenu(false);
  });
}
