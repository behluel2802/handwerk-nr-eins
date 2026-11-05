// Elektro Berger – Haupt-Skript
// Wird ab Schritt 4 erweitert (mobiles Menü, Lightbox, Formular).

// Aktuelles Jahr im Footer
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});
