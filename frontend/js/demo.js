// Nur im Demo-Build eingebunden (partials/demo-banner.hbs).
// Anruf-Links wählen in der Demo nicht (kein tel:), ein Klick zeigt kurz einen Hinweis in der Live-Region.
const toast = document.querySelector('[data-demo-toast]');
const MESSAGE = 'Demo: fiktive Nummer – es wird nicht gewählt.';
let timer;

document.addEventListener('click', (event) => {
  if (!toast || !event.target.closest('[data-demo-call]')) return;
  event.preventDefault();
  // Erst leeren, dann setzen: Screenreader kündigen den Text auch beim wiederholten Klick erneut an
  toast.textContent = '';
  requestAnimationFrame(() => {
    toast.textContent = MESSAGE;
    toast.classList.add('is-visible');
  });
  clearTimeout(timer);
  timer = setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.textContent = '';
  }, 4000);
});
