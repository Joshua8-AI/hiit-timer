// Applies the saved (or system-preferred) theme before first paint.
// Loaded synchronously in <head> so the page never flashes the wrong theme.
// CSP disallows inline scripts, hence a separate file.
(function () {
  let theme = null;
  try {
    theme = localStorage.getItem('hiit-timer-theme');
  } catch (e) {
    // localStorage unavailable (e.g. private browsing) - fall through
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.dataset.theme = theme;
})();
