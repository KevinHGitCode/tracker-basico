// darkTheme.js
// Funciones para manejo de tema oscuro

export function setupDarkTheme() {
  const temaBtn = document.getElementById('tema-btn');
  function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('tema', document.body.classList.contains('dark') ? 'dark' : '');
    temaBtn.innerText = document.body.classList.contains('dark') ? '☀️' : '🌙';
  }
  temaBtn.onclick = toggleTheme;
  if (localStorage.getItem('tema') === 'dark') {
    document.body.classList.add('dark');
    temaBtn.innerText = '☀️';
  }
}