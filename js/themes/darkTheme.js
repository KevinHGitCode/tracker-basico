// darkTheme.js
// Funciones para manejo de tema oscuro

export function setupDarkTheme() {
  const temaBtn = document.getElementById('tema-btn');
  function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('tema', document.body.classList.contains('dark') ? 'dark' : '');
    const icon = temaBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-moon', !document.body.classList.contains('dark'));
      icon.classList.toggle('fa-sun', document.body.classList.contains('dark'));
    }
  }
  temaBtn.onclick = toggleTheme;
  if (localStorage.getItem('tema') === 'dark') {
    document.body.classList.add('dark');
    const icon = temaBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }
}