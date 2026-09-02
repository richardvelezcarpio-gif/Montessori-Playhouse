const langButtons = document.querySelectorAll('.lang-btn');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  langButtons.forEach((button) => button.classList.toggle('active', button.dataset.lang === lang));

  document.querySelectorAll('[data-en][data-es]').forEach((element) => {
    const value = element.dataset[lang];
    if (value) element.textContent = value;
  });

  document.querySelectorAll('[data-placeholder-en][data-placeholder-es]').forEach((element) => {
    element.placeholder = lang === 'en' ? element.dataset.placeholderEn : element.dataset.placeholderEs;
  });

  document.title = lang === 'en'
    ? 'Montessori Playhouse | Group Family Daycare'
    : 'Montessori Playhouse | Guardería Familiar Grupal';
}

langButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.lang)));

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});

mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

document.getElementById('preRegisterForm').addEventListener('submit', (event) => {
  event.preventDefault();
  submitPreRegistration(event.currentTarget);
});

async function submitPreRegistration(form) {
  const parentName = document.getElementById('parentName').value.trim();
  const childName = document.getElementById('childName').value.trim();
  const childAge = document.getElementById('childAge').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const program = document.getElementById('program').value;
  const contactMethod = document.getElementById('contactMethod').value;
  const message = document.getElementById('message').value.trim();
  const website = document.getElementById('website').value;
  const status = document.getElementById('formStatus');
  const successEn = 'Thank you! We received your pre-registration request. Montessori Playhouse will contact you soon.';
  const successEs = '¡Gracias! Recibimos su solicitud de pre-registro. Montessori Playhouse se comunicará con usted pronto.';
  const errorEn = 'We could not send your request right now. Please try again or contact us by WhatsApp.';
  const errorEs = 'No pudimos enviar su solicitud en este momento. Inténtelo de nuevo o contáctenos por WhatsApp.';

  form.classList.add('submitting');
  status.className = 'form-status';
  status.textContent = '';

  try {
    const response = await fetch('/api/pre-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentName, childName, childAge, phone, email, program, contactMethod, message, website }),
    });
    if (!response.ok) throw new Error('Request failed');
    status.textContent = currentLang === 'en' ? successEn : successEs;
    status.className = 'form-status success';
    form.reset();
  } catch {
    status.textContent = currentLang === 'en' ? errorEn : errorEs;
    status.className = 'form-status error';
  } finally {
    form.classList.remove('submitting');
  }
}

document.getElementById('year').textContent = new Date().getFullYear();
setLanguage('en');
