//================================================================
// 1. NAVBAR
//================================================================
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.nexa-navbar-wrapper');
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navLeft = document.querySelector('.nexa-nav-left');
  const navLinks = document.querySelectorAll('.nexa-nav-link');
  const demoButton = document.getElementById('nexaDemoButton');

  let lastScrollTop = 0;
  let isMenuOpen = false;

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.classList.add('nexa-navbar-scrolled', 'nexa-navbar-wide');
      demoButton.classList.add('nexa-cta-visible');
    } else {
      header.classList.remove('nexa-navbar-scrolled', 'nexa-navbar-wide');
      demoButton.classList.remove('nexa-cta-visible');
    }
    lastScrollTop = scrollTop;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      isMenuOpen = !isMenuOpen;
      this.classList.toggle('nexa-menu-active');
      navLeft.classList.toggle('nexa-menu-active');
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth < 992 && isMenuOpen) {
        menuToggle.click();
      }
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#') && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  handleScroll();
});

document.addEventListener('DOMContentLoaded', function() {

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navbarWrapper = document.querySelector('.nexa-navbar-wrapper');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.nexa-mobile-link, .nexa-mobile-cta');

  // Función para abrir o cerrar el menú
  function toggleMenu() {
    // Añade/quita la clase 'is-open' al contenedor principal del navbar
    // El CSS se encarga de toda la animación basándose en esta clase
    navbarWrapper.classList.toggle('is-open');

    // Añade/quita una clase al body para prevenir el scroll cuando el menú está abierto
    document.body.classList.toggle('body-no-scroll');
  }

  // Evento para el botón de hamburguesa
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMenu);
  }
  
  // Evento para cerrar el menú cuando se hace clic en un enlace
  // Esto es crucial para páginas de una sola vista (single-page)
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Solo cierra el menú si está abierto
      if (navbarWrapper.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });

});


//================================================================
// 2. HERO
//================================================================
document.addEventListener('DOMContentLoaded', function() {
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      "particles": { "number": { "value": 50, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle" }, "opacity": { "value": 0.2, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.15, "width": 1 }, "move": { "enable": true, "speed": 1.5, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false } },
      "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } }, "push": { "particles_nb": 4 } } },
      "retina_detect": true
    });
  }

  const counters = document.querySelectorAll('.hero-stats .counter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.innerText;
        counter.innerText = '0';
        let count = 0;
        const speed = 200;
        const increment = target / speed;

        const updateCount = () => {
          count += increment;
          if (count < target) {
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, 1);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => observer.observe(counter));
});

//================================================================
// 3. SERVICIOS
//================================================================
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.servicios-filter .filter-btn');
  const serviceCards = document.querySelectorAll('.servicios-grid .servicio-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');

      serviceCards.forEach(card => {
        card.classList.toggle('hidden', !(filter === 'all' || card.dataset.category === filter));
      });
    });
  });

  serviceCards.forEach(card => {
    const cardInner = card.querySelector('.servicio-card-inner');
    const openBtn = card.querySelector('.servicio-card-button');
    const closeBtn = card.querySelector('.close-button');

    const flipCard = (e) => {
      e.stopPropagation();
      cardInner.classList.add('is-flipped');
    };

    const unflipCard = (e) => {
      e.stopPropagation();
      cardInner.classList.remove('is-flipped');
    };

    openBtn.addEventListener('click', flipCard);
    closeBtn.addEventListener('click', unflipCard);

    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            cardInner.classList.contains('is-flipped') ? unflipCard(e) : flipCard(e);
        }
    });
  });
});

//================================================================
// 4. QUIÉNES SOMOS
//================================================================
function loadScriptsForSomos() {
  const scripts = [
    { name: 'AOS', test: () => typeof AOS !== 'undefined', src: 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js' },
    { name: 'Lottie', test: () => typeof lottie !== 'undefined', src: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.9.6/lottie.min.js' }
  ];
  const scriptPromises = scripts.map(script => {
    if (script.test()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = script.src;
      scriptElement.onload = resolve;
      scriptElement.onerror = () => reject(`Error loading ${script.name}`);
      document.body.appendChild(scriptElement);
    });
  });
  return Promise.all(scriptPromises);
}

function initSomos() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }

  const lottieContainer = document.getElementById('lottie-animation');
  if (typeof lottie !== 'undefined' && lottieContainer) {
    lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/lottie3.json'
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.about')) {
        loadScriptsForSomos().then(initSomos).catch(console.error);
    }
});

//================================================================
// 5. METODOLOGIA
//================================================================
window.addEventListener('load', function() {
    const stepsContainer = document.getElementById('procesoSteps');
    if (!stepsContainer) return;

    const steps = document.querySelectorAll('.proceso-step');
    const progressBar = document.getElementById('procesoProgreso');
    const indicadoresContainer = document.getElementById('indicadoresContainer');
    
    let currentStep = 0;
    // Ahora 'stepWidth' se calcula de forma segura
    const stepWidth = steps.length > 0 ? steps[0].offsetWidth + 30 : 0; // +30 por el gap
    
    const updateUI = (snap = true) => {
        if (snap && stepWidth > 0) {
            stepsContainer.scrollTo({
                left: currentStep * stepWidth,
                behavior: 'smooth'
            });
        }
        
        steps.forEach((step, i) => step.classList.toggle('active', i === currentStep));
        
        const progress = (currentStep / (steps.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
        
        const indicators = indicadoresContainer.children;
        Array.from(indicators).forEach((ind, i) => ind.classList.toggle('active', i === currentStep));
    };

    steps.forEach((_, index) => {
        const indicador = document.createElement('div');
        indicador.className = 'indicador';
        indicador.addEventListener('click', () => {
            currentStep = index;
            updateUI();
        });
        indicadoresContainer.appendChild(indicador);
    });

    // --- LÓGICA DE ARRASTRE ---
    let isDown = false;
    let startX;
    let scrollLeft;
    let lastScrollLeft = 0; // Para detectar la dirección del swipe
    let velocity = 0; // Velocidad del swipe
    let lastTime = 0;

    const startDrag = (e) => {
        isDown = true;
        stepsContainer.classList.add('active');
        startX = (e.pageX || e.touches[0].pageX) - stepsContainer.offsetLeft;
        scrollLeft = stepsContainer.scrollLeft;
        stepsContainer.style.scrollBehavior = 'auto';
        lastTime = Date.now();
    };

    const endDrag = (e) => {
        if (!isDown) return;
        isDown = false;
        stepsContainer.classList.remove('active');
        stepsContainer.style.scrollBehavior = 'smooth';
        
        const finalScrollLeft = stepsContainer.scrollLeft;
        const dragDistance = finalScrollLeft - scrollLeft;
        
        // Lógica de snap mejorada: considera la dirección y velocidad del swipe
        let newStep = currentStep;
        if (Math.abs(dragDistance) > 50 || Math.abs(velocity) > 0.5) { // Umbral de distancia o velocidad
             if (dragDistance > 0) { // Swipe a la izquierda
                newStep = Math.min(steps.length - 1, currentStep + 1);
             } else if (dragDistance < 0) { // Swipe a la derecha
                newStep = Math.max(0, currentStep - 1);
             }
        } else {
            // Si el arrastre es corto, volvemos al paso actual
            newStep = Math.round(finalScrollLeft / stepWidth);
        }
        
        currentStep = Math.max(0, Math.min(steps.length - 1, newStep));
        
        updateUI(); 
    };

    const moveDrag = (e) => {
        if (!isDown) return;
        e.preventDefault(); // Prevenir scroll vertical en móvil mientras se arrastra horizontalmente
        const x = (e.pageX || e.touches[0].pageX) - stepsContainer.offsetLeft;
        const walk = (x - startX);
        stepsContainer.scrollLeft = scrollLeft - walk;
        
        // Calcular velocidad
        const now = Date.now();
        const dt = now - lastTime;
        if (dt > 0) {
            velocity = (stepsContainer.scrollLeft - lastScrollLeft) / dt;
        }
        lastTime = now;
        lastScrollLeft = stepsContainer.scrollLeft;
    };
    
    stepsContainer.addEventListener('mousedown', startDrag);
    stepsContainer.addEventListener('mouseleave', endDrag);
    stepsContainer.addEventListener('mouseup', endDrag);
    stepsContainer.addEventListener('mousemove', moveDrag);
    
    stepsContainer.addEventListener('touchstart', startDrag, { passive: true }); // passive:true para mejor rendimiento si no prevenimos default
    stepsContainer.addEventListener('touchend', endDrag);
    stepsContainer.addEventListener('touchmove', (e) => {
        if(isDown) { // Solo prevenir el comportamiento por defecto si estamos arrastrando
            e.preventDefault();
            moveDrag(e);
        }
    }, { passive: false });


    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.metodologia-section .animate-fadeInUp').forEach(el => observer.observe(el));
    
    updateUI();
});

//================================================================
// 6. GRÁFICAS
//================================================================
document.addEventListener('DOMContentLoaded', () => {
  const chartCanvas = document.getElementById('efficiencyChart');
  if (!chartCanvas) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        renderChart();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  const chartCard = document.querySelector('.ai-graphics .chart-card');
  if (chartCard) observer.observe(chartCard);

  function renderChart() {
    const ctx = chartCanvas.getContext('2d');
    const grad1 = ctx.createLinearGradient(0,0,0,300);
    grad1.addColorStop(0, 'rgba(67, 97, 238, 0.8)');
    grad1.addColorStop(1, 'rgba(114, 9, 183, 0.4)');
    const grad2 = ctx.createLinearGradient(0,0,0,300);
    grad2.addColorStop(0, 'rgba(247, 37, 133, 0.8)');
    grad2.addColorStop(1, 'rgba(247, 37, 133, 0.4)');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['At. Cliente','Inventario','Análisis','Calidad','Logística'],
        datasets: [
          { label: 'Sin IA', data: [45,50,30,70,40], backgroundColor: grad1, borderRadius: 8 },
          { label: 'Con IA', data: [85,88,92,95,78], backgroundColor: grad2, borderRadius: 8 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top' }, tooltip: { padding: 10, callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%` } } },
        scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' }, title: { display: true, text: 'Eficiencia (%)' } } },
        animation: { duration: 1800, easing: 'easeOutCubic' }
      }
    });
  }
});

//================================================================
// 7. PREGUNTAS (FAQ)
//================================================================
document.addEventListener('DOMContentLoaded', function() {
  const faqSection = document.getElementById('preguntas-frecuentes');
  if (!faqSection) return;

  const searchInput = document.getElementById('faq-search-input');
  const searchClear = document.getElementById('search-clear');
  const topicButtons = document.querySelectorAll('.topic-btn');
  const faqItems = document.querySelectorAll('.faq-item');
  const noResults = document.querySelector('.faq-no-results');

  const filterFAQs = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const activeTopic = document.querySelector('.topic-btn.active').dataset.topic;
    let foundResults = false;
    
    faqItems.forEach(item => {
      const question = item.querySelector('h3').textContent.toLowerCase();
      const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
      const topic = item.dataset.topic;
      
      const matchesTopic = activeTopic === 'all' || topic === activeTopic;
      const matchesSearch = !searchTerm || question.includes(searchTerm) || answer.includes(searchTerm);
      
      if (matchesTopic && matchesSearch) {
        item.style.display = 'flex';
        foundResults = true;
      } else {
        item.style.display = 'none';
      }
    });
    noResults.style.display = foundResults ? 'none' : 'block';
    searchClear.style.display = searchTerm ? 'block' : 'none';
  };

  searchInput.addEventListener('input', filterFAQs);
  searchClear.addEventListener('click', () => { searchInput.value = ''; filterFAQs(); });
  
  topicButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('.topic-btn.active').classList.remove('active');
      button.classList.add('active');
      filterFAQs();
    });
  });

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
});

//================================================================
// 8. CONTACTO Y RULETA
//================================================================
document.addEventListener('DOMContentLoaded', () => {

  // --- LÓGICA DE LA RULETA AVANZADA (SIN CAMBIOS) ---
  const initAdvancedRoulette = () => {
    // --- Configuración y Elementos del DOM ---
    const prizes = [
        { label: '5% OFF', color: '#4361ee', codePrefix: 'TECH5', weight: 40 },
        { label: '10% OFF', color: '#3a0ca3', codePrefix: 'TECH10', weight: 30 },
        { label: '15% OFF', color: '#7209b7', codePrefix: 'TECH15', weight: 15 },
        { label: '20% OFF', color: '#f72585', codePrefix: 'TECH20', weight: 10 },
        { label: 'ENVÍO FREE', color: '#4cc9f0', codePrefix: 'FREEDEL', weight: 3 },
        { label: 'REGALO!', color: '#560bad', codePrefix: 'SURPRISE', weight: 2 }
    ];
    const svgChevronLeft = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
    const svgChevronRight = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

    const canvas = document.getElementById('wheel');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spin');
    const prizeMsg = document.getElementById('prize-message');
    const panel = document.getElementById('wheel-panel');
    const panelToggle = document.getElementById('panel-toggle');
    const closePanelBtn = panel.querySelector('.close-panel');
    const timeRemainingEl = document.getElementById('time-remaining');
    const winnerGlow = document.querySelector('.winner-glow');
    const popupNotification = document.getElementById('popup-notification');

    let spinning = false, panelOpen = false, autoOpenTimer, userHasInteracted = false;

    const handleUserInteraction = () => { if (!userHasInteracted) { userHasInteracted = true; clearTimeout(autoOpenTimer); } };
    const generateCode = (prefix) => prefix + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const drawWheel = (segments) => { const numSegments = segments.length; if (numSegments === 0) return; const centerX = canvas.width / 2, centerY = canvas.height / 2; const radius = Math.min(centerX, centerY) - 5; const anglePerSegment = (2 * Math.PI) / numSegments; ctx.clearRect(0, 0, canvas.width, canvas.height); segments.forEach((segment, i) => { const startAngle = i * anglePerSegment - (Math.PI / 2); const endAngle = startAngle + anglePerSegment; ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.arc(centerX, centerY, radius, startAngle, endAngle); ctx.closePath(); ctx.fillStyle = segment.color; ctx.fill(); ctx.strokeStyle = 'white'; ctx.lineWidth = 3; ctx.stroke(); ctx.save(); ctx.translate(centerX, centerY); const midAngle = startAngle + anglePerSegment / 2; ctx.rotate(midAngle); ctx.textAlign = 'right'; ctx.fillStyle = 'white'; ctx.font = 'bold 13px Montserrat'; const labelParts = segment.label.split(' '); if (labelParts.length > 1 && segment.label.length > 8) { ctx.fillText(labelParts[0], radius * 0.85, -2); ctx.fillText(labelParts[1], radius * 0.85, 12); } else { ctx.fillText(segment.label, radius * 0.85, 5); } ctx.restore(); }); };
    const spinWheel = () => { if (spinning) return; handleUserInteraction(); spinning = true; spinBtn.disabled = true; const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0); let randomWeight = Math.random() * totalWeight; let winnerIndex = prizes.findIndex(p => (randomWeight -= p.weight) <= 0) ?? 0; const winner = prizes[winnerIndex]; const anglePerSegment = (2 * Math.PI) / prizes.length; const targetAngleCenter = (winnerIndex * anglePerSegment) + (anglePerSegment / 2) - (Math.PI / 2); const rotation = -(targetAngleCenter + (Math.random() - 0.5) * anglePerSegment * 0.6); const totalRotation = rotation + ((Math.floor(Math.random() * 3) + 5) * 2 * Math.PI); canvas.style.transition = 'none'; void canvas.offsetWidth; canvas.style.transition = `transform 5000ms cubic-bezier(0.25, 0.1, 0.25, 1)`; canvas.style.transform = `rotate(${totalRotation}rad)`; canvas.addEventListener('transitionend', function onWheelStop() { canvas.removeEventListener('transitionend', onWheelStop); winnerGlow.classList.add('active'); setTimeout(() => winnerGlow.classList.remove('active'), 800); showPrize(winner); spinning = false; spinBtn.disabled = false; }, { once: true }); };
    const showPrize = (prize) => { const prizeCode = generateCode(prize.codePrefix); const container = prizeMsg.querySelector('.prize-container'); container.innerHTML = `<button class="close-prize">✕</button><h3 class="prize-title">¡Felicidades!</h3><p class="prize-desc">Has ganado: <strong class="won-label">${prize.label}</strong></p><div class="prize-code-wrapper"><div class="prize-code" title="Haz clic para copiar">${prizeCode}</div><button class="copy-code-btn">Copiar Código</button></div><p>Usa este código en tu próximo mensaje.</p><button class="apply-btn">Aplicar y Contactar</button>`; prizeMsg.classList.add('show'); const copyAction = (btn) => { navigator.clipboard.writeText(prizeCode).then(() => { btn.textContent = '¡Copiado!'; setTimeout(() => { btn.textContent = 'Copiar Código'; }, 2000); }).catch(() => { btn.textContent = 'Error'; setTimeout(() => { btn.textContent = 'Copiar Código'; }, 2000); }); }; container.querySelector('.close-prize').addEventListener('click', () => prizeMsg.classList.remove('show')); const copyBtn = container.querySelector('.copy-code-btn'); container.querySelector('.prize-code').addEventListener('click', () => copyAction(copyBtn)); copyBtn.addEventListener('click', () => copyAction(copyBtn)); container.querySelector('.apply-btn').addEventListener('click', () => { const targetInput = document.getElementById('descuento'); if (targetInput) { targetInput.value = prizeCode; targetInput.dispatchEvent(new Event('input', { bubbles: true })); } document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); prizeMsg.classList.remove('show'); closePanel(); }); };
    const openPanel = () => { handleUserInteraction(); if (!panelOpen) { panel.classList.add('open'); panelOpen = true; panelToggle.innerHTML = svgChevronRight; } };
    const closePanel = () => { handleUserInteraction(); if (panelOpen) { panel.classList.remove('open'); panelOpen = false; panelToggle.innerHTML = svgChevronLeft; } };

    spinBtn.addEventListener('click', spinWheel); 
    panelToggle.addEventListener('click', () => panelOpen ? closePanel() : openPanel()); 
    closePanelBtn.addEventListener('click', closePanel); 
    document.getElementById('wheel-center').addEventListener('click', () => { if (!spinBtn.disabled) spinBtn.click(); }); 
    popupNotification.querySelector('.notification-button')?.addEventListener('click', () => { openPanel(); popupNotification.classList.remove('show'); }); 
    popupNotification.querySelector('.notification-close')?.addEventListener('click', () => popupNotification.classList.remove('show'));

    const autoOpenedKey = 'rouletteAutoOpened_v2'; 
    if (!sessionStorage.getItem(autoOpenedKey)) { 
      autoOpenTimer = setTimeout(() => { 
        if (!userHasInteracted) { 
          openPanel(); 
          sessionStorage.setItem(autoOpenedKey, 'true'); 
        } 
      }, 15000); 
    }
    
    const notificationShownKey = 'rouletteNotificationShown_v2'; 
    const handleScroll = () => { 
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight); 
      if (scrolled > 0.20 && !sessionStorage.getItem(notificationShownKey)) { 
        sessionStorage.setItem(notificationShownKey, 'true'); 
        if (!panelOpen && !userHasInteracted) { 
          popupNotification.classList.add('show'); 
          setTimeout(() => popupNotification.classList.remove('show'), 10000); 
        } 
        window.removeEventListener('scroll', handleScroll); 
      } 
    }; 
    window.addEventListener('scroll', handleScroll, { passive: true });
    drawWheel(prizes);
  };

  // --- LÓGICA DEL FORMULARIO DE CONTACTO (CORREGIDA) ---
  const initContactForm = () => {

    
    // --- CONFIGURA tus datos de EmailJS ---
    const PUBLIC_KEY  = 'YpkUjCbz5Q2OdcxJg'; // Reemplaza con tu Public Key
    const SERVICE_ID  = 'service_4ualn0c'; // Reemplaza con tu Service ID
    const TEMPLATE_ID = 'template_15jgays';// Reemplaza con tu Template ID

    // Inicializa EmailJS (solo si la librería está presente)
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: PUBLIC_KEY });
    } else {
      console.error("La librería EmailJS no está cargada. El formulario de contacto no funcionará.");
      return;
    }

    // Referencias al DOM
    const form         = document.getElementById('contactoForm');
    const submitBtn    = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    const closeSuccess = document.getElementById('closeSuccessModal');

    // Si el formulario no existe en la página, no continuamos.
    if (!form) return;

    // Validación del formulario
    function validateForm() {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const row = field.closest('.cnt-form-row');
        let ok = field.checkValidity();
        if (field.type === 'email' && field.value) {
          ok = /^\S+@\S+\.\S+$/.test(field.value);
        }
        if (row) {
           row.classList.toggle('cnt-invalid', !ok);
        }
        if (!ok) valid = false;
      });
      return valid;
    }

    // Maneja el submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
        return;
      }

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Enviando...';

      const templateParams = {
        nombre:    form.nombre.value.trim(),
        email:     form.email.value.trim(),
        asunto:    form.asunto.value,
        descuento: form.descuento.value.trim(),
        mensaje:   form.mensaje.value.trim()
      };

      try {
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        console.log('Email enviado:', response.status, response.text);
        if (successModal) successModal.classList.add('cnt-active');
        form.reset();
      } catch (error) {
        console.error('Error al enviar email:', error);
        alert('Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Enviar Mensaje';
      }
    });

    // Cierra el modal
    closeSuccess?.addEventListener('click', () => {
      if (successModal) successModal.classList.remove('cnt-active');
    });
  };

  // --- INICIALIZACIÓN ---
  // Se ejecutan ambas funciones cuando el DOM está listo.
  initAdvancedRoulette();
  initContactForm();
});

//================================================================
// 9. FOOTER
//================================================================
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.getElementById('back-to-top');
  if (!backToTopButton) return;

  window.addEventListener('scroll', () => {
    backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
  });
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const newsletterForm = document.getElementById('newsletter-form');
  if(newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const msgEl = document.getElementById('newsletter-message');
        msgEl.textContent = '¡Gracias por suscribirte!';
        msgEl.style.color = 'var(--color-success)';
        this.querySelector('input').value = '';
        setTimeout(() => { msgEl.textContent = ''; }, 5000);
    });
  }
});



//================================================================
// 10. SECCIÓN DE ACCIÓN (CTA) - VERSIÓN CORREGIDA
//================================================================
document.addEventListener('DOMContentLoaded', function() {
  // Ahora encontrará la sección porque el ID está en el HTML
  const ctaSection = document.getElementById('accion');
  if (!ctaSection) return;

  // Cargar Lottie para la animación
  const lottieContainer = document.getElementById('lottie-animation-cta');
  // Esta comprobación es vital. Asegúrate de tener la librería Lottie cargada.
  if (typeof lottie !== 'undefined' && lottieContainer) {
    lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // PASO 4: Verifica que esta ruta es correcta desde tu archivo HTML.
      // Abre la consola del navegador (F12) y mira en la pestaña "Network" si hay un error 404.
      path: 'assets/lottie3.json' 
    });
  }

  // Animación de entrada para los elementos de la sección
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // PASO 2: Quitamos '.lottie-container' de la lista de elementos a animar.
  // De esta forma, la animación no se ocultará con opacity: 0 y será visible desde el principio.
  const elementsToAnimate = ctaSection.querySelectorAll('.cta-title, .cta-description, .benefit-item, .cta-action-area');
  
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});