// darkTheme.js
// Funciones para manejo de tema oscuro

export function setupDarkTheme() {
  const temaBtn = document.getElementById('tema-btn');
  const htmlElement = document.documentElement;
  
  function toggleTheme() {
    htmlElement.classList.toggle('dark');
    // También mantener en body para compatibilidad con estilos antiguos si existen
    document.body.classList.toggle('dark');
    localStorage.setItem('tema', htmlElement.classList.contains('dark') ? 'dark' : '');
    const icon = temaBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-moon', !htmlElement.classList.contains('dark'));
      icon.classList.toggle('fa-sun', htmlElement.classList.contains('dark'));
    }
  }
  
  temaBtn.onclick = toggleTheme;
  
  if (localStorage.getItem('tema') === 'dark') {
    htmlElement.classList.add('dark');
    document.body.classList.add('dark');
    const icon = temaBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }
}