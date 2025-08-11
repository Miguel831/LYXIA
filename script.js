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
    stepsContainer.addEventListener('touchmove', moveDrag, { passive: true });



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
document.addEventListener("DOMContentLoaded", function () {
    const wheelPanel = document.getElementById("wheel-panel");
    if (wheelPanel) {
      wheelPanel.style.display = "block";
      wheelPanel.style.visibility = "visible";
      wheelPanel.style.opacity = "1";
    }
  });

document.addEventListener('DOMContentLoaded', () => {

  // --- LÓGICA DE LA RULETA AVANZADA (SIN CAMBIOS) ---
  const initAdvancedRoulette = () => {
    const prizes = [ { label: '5% OFF', color: '#4361ee', codePrefix: 'TECH5' }, { label: '10% OFF', color: '#3a0ca3', codePrefix: 'TECH10' }, { label: '15% OFF', color: '#7209b7', codePrefix: 'TECH15' }, { label: '20% OFF', color: '#f72585', codePrefix: 'TECH20' }, { label: 'ENVÍO FREE', color: '#4cc9f0', codePrefix: 'FREEDEL' }, { label: 'REGALO!', color: '#560bad', codePrefix: 'SURPRISE' } ];
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
    const winnerGlow = document.querySelector('.winner-glow');
    let spinning = false, panelOpen = false;
    
    // <<< LÓGICA AÑADIDA >>> Función para gestionar el temporizador
    const manageSpinCooldown = (endTime) => {
        const timeRemainingEl = document.getElementById('time-remaining');
        const wheelCenter = document.getElementById('wheel-center');

        spinBtn.disabled = true;
        wheelCenter.style.cursor = 'not-allowed';
        timeRemainingEl.style.display = 'block';

        const timerInterval = setInterval(() => {
            const timeLeft = endTime - Date.now();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timeRemainingEl.style.display = 'none';
                spinBtn.disabled = false;
                wheelCenter.style.cursor = 'pointer';
                localStorage.removeItem('lastSpinTimestamp');
                return;
            }
            const hours = Math.floor(timeLeft / (3600000));
            const minutes = Math.floor((timeLeft % 3600000) / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            timeRemainingEl.textContent = `Próximo giro: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    };

    // <<< LÓGICA AÑADIDA >>> Comprobación al cargar la página
    const lastSpinTime = localStorage.getItem('lastSpinTimestamp');
    if (lastSpinTime) {
        const cooldownEnd = parseInt(lastSpinTime, 10) + (24 * 60 * 60 * 1000);
        if (Date.now() < cooldownEnd) {
            manageSpinCooldown(cooldownEnd);
        } else {
            localStorage.removeItem('lastSpinTimestamp');
        }
    }

    const generateCode = (prefix) => prefix + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const drawWheel = (segments) => { const numSegments = segments.length; if (numSegments === 0) return; const centerX = canvas.width / 2, centerY = canvas.height / 2; const radius = Math.min(centerX, centerY) - 5; const anglePerSegment = (2 * Math.PI) / numSegments; ctx.clearRect(0, 0, canvas.width, canvas.height); segments.forEach((segment, i) => { const startAngle = i * anglePerSegment - (Math.PI / 2); const endAngle = startAngle + anglePerSegment; ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.arc(centerX, centerY, radius, startAngle, endAngle); ctx.closePath(); ctx.fillStyle = segment.color; ctx.fill(); ctx.strokeStyle = 'white'; ctx.lineWidth = 3; ctx.stroke(); ctx.save(); ctx.translate(centerX, centerY); const midAngle = startAngle + anglePerSegment / 2; ctx.rotate(midAngle); ctx.textAlign = 'right'; ctx.fillStyle = 'white'; ctx.font = 'bold 13px Montserrat'; const labelParts = segment.label.split(' '); if (labelParts.length > 1 && segment.label.length > 8) { ctx.fillText(labelParts[0], radius * 0.85, -2); ctx.fillText(labelParts[1], radius * 0.85, 12); } else { ctx.fillText(segment.label, radius * 0.85, 5); } ctx.restore(); }); };
    
    const spinWheel = () => {
      if (spinning || spinBtn.disabled) return; // <-- CORRECCIÓN: Comprueba si el botón ya está deshabilitado
      spinning = true;
      spinBtn.disabled = true;

      // Guarda la hora del giro y comienza el temporizador
      const now = Date.now();
      localStorage.setItem('lastSpinTimestamp', now.toString());
      const cooldownEnd = now + (24 * 60 * 60 * 1000);
      manageSpinCooldown(cooldownEnd);

      const currentTransform = window.getComputedStyle(canvas).getPropertyValue('transform');
      let currentAngleRad = 0;
      if (currentTransform !== 'none') {
        const matrix = new DOMMatrix(currentTransform);
        currentAngleRad = Math.atan2(matrix.b, matrix.a);
      }
      
      const randomExtraRotation = (Math.floor(Math.random() * 4) + 5) * 2 * Math.PI;
      const finalRandomAngle = Math.random() * 2 * Math.PI;
      const totalRotationInRad = currentAngleRad + randomExtraRotation + finalRandomAngle;

      canvas.style.transition = 'transform 6000ms cubic-bezier(0.1, 0.7, 0.3, 1)';
      canvas.style.transform = `rotate(${totalRotationInRad}rad)`;

      canvas.addEventListener('transitionend', function onWheelStop() {
        canvas.removeEventListener('transitionend', onWheelStop);

        const effectiveAngle = totalRotationInRad % (2 * Math.PI);
        const pointerAngle = ((2 * Math.PI) - effectiveAngle) % (2 * Math.PI);
        const anglePerSegment = (2 * Math.PI) / prizes.length;
        const winnerIndex = Math.floor(pointerAngle / anglePerSegment);
        const winner = prizes[winnerIndex];

        showPrize(winner);

        // <<< CORRECCIONES CLAVE >>>
        spinning = false; // La ruleta ya no está girando
        // Se elimina 'spinBtn.disabled = false;' para que el temporizador tenga el control.
      }, { once: true });
    };

    const showPrize = (prize) => { const prizeCode = generateCode(prize.codePrefix); const container = prizeMsg.querySelector('.prize-container'); container.innerHTML = `<button class="close-prize">✕</button><h3 class="prize-title">¡Felicidades!</h3><p class="prize-desc">Has ganado: <strong class="won-label">${prize.label}</strong></p><div class="prize-code-wrapper"><div class="prize-code" title="Haz clic para copiar">${prizeCode}</div><button class="copy-code-btn">Copiar Código</button></div><p>Usa este código en tu próximo mensaje.</p><button class="apply-btn">Aplicar y Contactar</button>`; prizeMsg.classList.add('show'); const copyAction = (btn) => { navigator.clipboard.writeText(prizeCode).then(() => { btn.textContent = '¡Copiado!'; setTimeout(() => { btn.textContent = 'Copiar Código'; }, 2000); }).catch(() => { btn.textContent = 'Error'; setTimeout(() => { btn.textContent = 'Copiar Código'; }, 2000); }); }; container.querySelector('.close-prize').addEventListener('click', () => prizeMsg.classList.remove('show')); const copyBtn = container.querySelector('.copy-code-btn'); container.querySelector('.prize-code').addEventListener('click', () => copyAction(copyBtn)); copyBtn.addEventListener('click', () => copyAction(copyBtn)); container.querySelector('.apply-btn').addEventListener('click', () => { const targetInput = document.getElementById('descuento'); if (targetInput) { targetInput.value = prizeCode; targetInput.dispatchEvent(new Event('input', { bubbles: true })); } document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); prizeMsg.classList.remove('show'); closePanel(); }); };
    const openPanel = () => { if (!panelOpen) { panel.classList.add('open'); panelOpen = true; panelToggle.innerHTML = svgChevronRight; } };
    const closePanel = () => { if (panelOpen) { panel.classList.remove('open'); panelOpen = false; panelToggle.innerHTML = svgChevronLeft; } };
    spinBtn.addEventListener('click', spinWheel); panelToggle.addEventListener('click', () => panelOpen ? closePanel() : openPanel()); closePanelBtn.addEventListener('click', closePanel); document.getElementById('wheel-center').addEventListener('click', () => { if (!spinBtn.disabled) spinBtn.click(); });
    drawWheel(prizes);
  };

  // --- LÓGICA DEL FORMULARIO DE CONTACTO CON VALIDACIÓN AVANZADA ---
  const initContactForm = () => {
    const form = document.getElementById("contactoForm");
    if (!form) {
      console.error("No se encontró el formulario con ID 'contactoForm'");
      return;
    }

    // --- RECUERDA CAMBIAR ESTOS VALORES POR LOS TUYOS EN EMAILJS ---
    emailjs.init("YpkUjCbz5Q2OdcxJg"); // Tu Public Key
    const serviceID = "service_4ualn0c";
    const templateID = "template_15jgays";

    const inputs = {
      nombre: form.querySelector('#nombre'),
      email: form.querySelector('#email'),
      asunto: form.querySelector('#asunto'),
      mensaje: form.querySelector('#mensaje'),
      descuento: form.querySelector('#descuento'), 
      privacidad: form.querySelector('#privacidad')
    };
    const submitBtn = form.querySelector('#submitBtn');

    // --- Toda tu lógica de validación (showError, hideError, etc.) permanece igual ---
    // (Tu código de validación va aquí, no es necesario cambiarlo)
    const showError = (input, message) => {
      const formRow = input.closest('.cnt-form-row');
      const errorSpan = formRow.querySelector('.cnt-error-message');
      formRow.classList.add('cnt-invalid');
      if (errorSpan) errorSpan.textContent = message;
    };

    const hideError = (input) => {
      const formRow = input.closest('.cnt-form-row');
      formRow.classList.remove('cnt-invalid');
    };

    const validateNombre = () => {
      if (inputs.nombre.value.trim() === '') {
        showError(inputs.nombre, 'El nombre es obligatorio.');
        return false;
      }
      hideError(inputs.nombre);
      return true;
    };

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (inputs.email.value.trim() === '') {
        showError(inputs.email, 'El correo electrónico es obligatorio.');
        return false;
      }
      if (!emailRegex.test(inputs.email.value.trim())) {
        showError(inputs.email, 'Por favor, introduce un formato de correo válido.');
        return false;
      }
      hideError(inputs.email);
      return true;
    };

    const validateAsunto = () => {
      if (inputs.asunto.value === '') {
        showError(inputs.asunto, 'Debes seleccionar un motivo.');
        return false;
      }
      hideError(inputs.asunto);
      return true;
    };

    const validatePrivacidad = () => {
      if (!inputs.privacidad.checked) {
        showError(inputs.privacidad, 'Debes aceptar la política de privacidad.');
        return false;
      }
      hideError(inputs.privacidad);
      return true;
    };

    const validatePremio = () => {
      const codigo = inputs.codigo.value.trim(); // Aquí asumo que tienes un input llamado "codigo"

      const esValido = prizes.some(prize => codigo.startsWith(prize.codePrefix));
      
      if (!esValido) {
        showError(inputs.codigo, 'El código introducido no es válido.');
        return false;
      }

      hideError(inputs.codigo);
      return true;
    };


    function obtenerDescuentoDesdeCodigo(code) {
      const premio = prizes.find(prize => code.startsWith(prize.codePrefix));
      return premio ? premio.label : null;
    }

    const validateForm = () => {
      const isNombreValid = validateNombre();
      const isEmailValid = validateEmail();
      const isAsuntoValid = validateAsunto();
      const isDescuento = validatePremio();
      const isPrivacidadValid = validatePrivacidad();
      return isNombreValid && isEmailValid && isAsuntoValid && validatePremio && isPrivacidadValid;
    };

    Object.values(inputs).forEach(input => {
      const eventType = (input.type === 'checkbox' || input.tagName === 'SELECT') ? 'change' : 'input';
      input.addEventListener(eventType, () => {
        switch (input.id) {
          case 'nombre': validateNombre(); break;
          case 'email': validateEmail(); break;
          case 'asunto': validateAsunto(); break;
          case 'descuento': validatePremio(); break;
          case 'privacidad': validatePrivacidad(); break;
        }
      });
    });

    // --- NOVEDAD: Función que genera el HTML del correo ---
    // Esta función toma los datos del formulario y devuelve el string HTML completo.
    const createBeautifulEmailHTML = (nombre, email, asunto, mensaje, descuento) => {
    
    let mensajeHTML = '';
    if (mensaje && mensaje.trim()) {
        mensajeHTML = `
        <tr>
            <td style="padding-top: 15px;">
                <p style="color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                    Tu mensaje
                </p>
                <div style="background-color: rgba(255,255,255,0.1); border-radius: 6px; padding: 15px; border-left: 3px solid rgba(255,255,255,0.4);">
                    <p style="color: #ffffff; font-size: 15px; line-height: 1.5; margin: 0; font-style: italic;">
                        "${mensaje}"
                    </p>
                </div>
            </td>
        </tr>
        `;
    }

    let descuentoHTML = '';
    if (descuento && descuento.trim()) {
        descuentoHTML = `
        <!-- Código promocional destacado -->
        <div style="text-align: center; background-color: rgba(255,255,255,0.15); border-radius: 8px; padding: 20px; border: 1px dashed rgba(255,255,255,0.3);">
            <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">
                🎁 Tu código de descuento especial
            </p>
            <div style="background-color: #ffffff; color: #3b82f6; padding: 12px 24px; border-radius: 25px; display: inline-block; font-weight: 700; font-size: 18px; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                ${obtenerDescuentoDesdeCodigo(descuento)}
            </div>
        </div>
        `;
    }

    return `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a LYXIA - Tu socio en IA</title>
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; background-color: #f8fafc; color: #1e293b;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: transparent;">
        ¡Gracias por confiar en LYXIA! Tu consulta ha sido recibida y nuestro equipo ya está trabajando en tu proyecto de IA.
    </div>

    <!-- Contenedor principal -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 40px 15px;">
                <!-- Email container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); border: 1px solid #e2e8f0;">
                    
                    <!-- Header moderno pero accesible -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%); padding: 50px 40px; text-align: center; position: relative;">
                            <!-- Patrón sutil -->
                            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%); opacity: 0.4;"></div>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="position: relative; z-index: 2;">
                                        <!-- Logo con marco elegante -->
                                        <div style="background-color: rgba(255,255,255,0.95); padding: 18px; border-radius: 8px; display: inline-block; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                            <img src="https://lyxia.es/assets/LOGO.png" alt="LYXIA" width="110" style="display: block; max-width: 110px; height: auto;">
                                        </div>
                                        
                                        <!-- Título amigable pero profesional -->
                                        <h1 style="color: #ffffff; font-size: 30px; font-weight: 600; margin: 0 0 12px 0; text-align: center; letter-spacing: -0.5px; line-height: 1.2;">
                                            ¡Bienvenido a LYXIA! 👋
                                        </h1>
                                        
                                        <!-- Subtítulo con personalidad -->
                                        <p style="color: rgba(255,255,255,0.9); font-size: 17px; margin: 0 0 8px 0; text-align: center; font-weight: 400;">
                                            Tu consulta de IA ha sido recibida con éxito
                                        </p>
                                        
                                        <!-- Badge de estado -->
                                        <div style="background-color: rgba(255,255,255,0.15); color: #ffffff; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 13px; font-weight: 600; margin-top: 8px; border: 1px solid rgba(255,255,255,0.2);">
                                            🚀 PROCESANDO TU SOLICITUD
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Cuerpo principal -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <!-- Saludo personalizado -->
                                <tr>
                                    <td style="padding-bottom: 35px;">
                                        <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 10px; padding: 28px; border-left: 4px solid #3b82f6;">
                                            <h2 style="color: #1e293b; font-size: 22px; font-weight: 600; margin: 0 0 16px 0; line-height: 1.3;">
                                                Hola <span style="color: #3b82f6;">${nombre}</span>, ¡es genial tenerte aquí! ✨
                                            </h2>
                                            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0; font-weight: 400;">
                                                Gracias por contactar con <strong>LYXIA</strong>. Tu interés en nuestras soluciones de Inteligencia Artificial nos emociona, y ya estamos preparando la mejor propuesta para tu proyecto.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Información de consulta moderna -->
                                <tr>
                                    <td style="padding-bottom: 40px;">
                                        <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); border-radius: 12px; padding: 35px; color: #ffffff; position: relative; overflow: hidden;">
                                            <!-- Efecto de fondo -->
                                            <div style="position: absolute; top: 0; right: 0; width: 100px; background-image: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
                                            
                                            <div style="position: relative; z-index: 2;">
                                                <!-- Header de sección -->
                                                <div style="text-align: center; margin-bottom: 25px;">
                                                    <h3 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">
                                                        📋 Resumen de tu consulta
                                                    </h3>
                                                    <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">
                                                        Información registrada en nuestro sistema
                                                    </p>
                                                </div>
                                                
                                                <!-- Detalles organizados -->
                                                <div style="background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 24px; margin-bottom: 20px; backdrop-filter: blur(10px);">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2);">
                                                                <p style="color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 600; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                                                    Tema de consulta
                                                                </p>
                                                                <p style="color: #ffffff; font-size: 17px; font-weight: 600; margin: 0;">
                                                                    🎯 ${asunto}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        ${mensajeHTML}
                                                    </table>
                                                </div>
                                                
                                                <!-- Código promocional destacado -->
                                                ${descuentoHTML}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Proceso con estilo intermedio -->
                                <tr>
                                    <td style="padding-bottom: 40px;">
                                        <div style="text-align: center; margin-bottom: 35px;">
                                            <h3 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 12px 0;">
                                                ¿Qué sigue ahora? 🚀
                                            </h3>
                                            <p style="color: #64748b; font-size: 15px; margin: 0; font-weight: 400;">
                                                Nuestro proceso optimizado para resultados excepcionales
                                            </p>
                                            <div style="width: 70px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); margin: 15px auto 0; border-radius: 2px;"></div>
                                        </div>
                                        
                                        <!-- Timeline moderna -->
                                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 35px 30px; border: 1px solid #e2e8f0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <!-- Paso 1 -->
                                                <tr>
                                                    <td style="padding-bottom: 28px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td width="55" style="vertical-align: top; padding-right: 20px;">
                                                                    <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; position: relative; box-shadow: 0 2px 8px rgba(59,130,246,0.3);">
                                                                        1
                                                                        <!-- Línea conectora -->
                                                                        <div style="position: absolute; top: 42px; left: 50%; transform: translateX(-50%); width: 2px; height: 28px; background: linear-gradient(to bottom, #3b82f6, #e2e8f0);"></div>
                                                                    </div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-left: 3px solid #3b82f6;">
                                                                        <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                                                                            🧠 Análisis inteligente de tu proyecto
                                                                        </h4>
                                                                        <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0;">
                                                                            Nuestro equipo analiza tu consulta y diseña una estrategia personalizada con IA
                                                                        </p>
                                                                        <div style="background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-weight: 600; display: inline-block;">
                                                                            ⚡ EN PROCESO
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                
                                                <!-- Paso 2 -->
                                                <tr>
                                                    <td style="padding-bottom: 28px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td width="55" style="vertical-align: top; padding-right: 20px;">
                                                                    <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; position: relative; box-shadow: 0 2px 8px rgba(99,102,241,0.3);">
                                                                        2
                                                                        <div style="position: absolute; top: 42px; left: 50%; transform: translateX(-50%); width: 2px; height: 28px; background: linear-gradient(to bottom, #8b5cf6, #e2e8f0);"></div>
                                                                    </div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-left: 3px solid #6366f1;">
                                                                        <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                                                                            💡 Te enviamos tu propuesta personalizada
                                                                        </h4>
                                                                        <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0;">
                                                                            Plan detallado con solución específica, timeline y presupuesto adaptado a tu negocio
                                                                        </p>
                                                                        <div style="background-color: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-weight: 600; display: inline-block;">
                                                                            ⏱️ MÁXIMO 24H
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                
                                                <!-- Paso 3 -->
                                                <tr>
                                                    <td>
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td width="55" style="vertical-align: top; padding-right: 20px;">
                                                                    <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%); color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; box-shadow: 0 2px 8px rgba(139,92,246,0.3);">
                                                                        3
                                                                    </div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-left: 3px solid #8b5cf6;">
                                                                        <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                                                                            🚀 Reunión virtual gratuita
                                                                        </h4>
                                                                        <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0;">
                                                                            Conversamos sobre tu proyecto, resolvemos dudas y alineamos objetivos
                                                                        </p>
                                                                        <div style="background-color: #ddd6fe; color: #6b21a8; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-weight: 600; display: inline-block;">
                                                                            📅 A COORDINAR
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Ventajas equilibradas -->
                                <tr>
                                    <td style="padding-bottom: 40px;">
                                        <div style="text-align: center; margin-bottom: 35px;">
                                            <h3 style="color: #1e293b; font-size: 22px; font-weight: 600; margin: 0 0 12px 0;">
                                                ¿Por qué elegir LYXIA? 🌟
                                            </h3>
                                            <p style="color: #64748b; font-size: 15px; margin: 0; font-weight: 400;">
                                                Lo que nos hace diferentes en el mundo de la IA
                                            </p>
                                            <div style="width: 60px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); margin: 15px auto 0; border-radius: 2px;"></div>
                                        </div>
                                        
                                        <!-- Grid de beneficios balanceados -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="50%" style="padding-left: 12px; padding-right: 15px; vertical-align: top;">
                                                    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 26px 20px; height: 150px; display: table; width: 100%; transition: all 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                                                        <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                            <div style="width: 52px; height: 52px; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); border-radius: 12px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 22px; box-shadow: 0 4px 12px rgba(59,130,246,0.25);">⚡</div>
                                                            <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">IA de Última Generación</h4>
                                                            <p style="color: #64748b; font-size: 13px; line-height: 1.4; margin: 0;">GPT-4, Claude y tecnologías custom para tu sector específico</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td width="50%" style="padding-left: 6px; padding-right: 30px; vertical-align: top;">
                                                    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 26px 20px; height: 150px; display: table; width: 100%; transition: all 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                                                        <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                            <div style="width: 52px; height: 52px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 22px; box-shadow: 0 4px 12px rgba(16,185,129,0.25);">📈</div>
                                                            <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Resultados Comprobados</h4>
                                                            <p style="color: #64748b; font-size: 13px; line-height: 1.4; margin: 0;">+280% de mejora promedio en eficiencia operacional</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-top: 20px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="50%" style="padding-left: 12px; padding-right: 12px; vertical-align: top;">
                                                                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 26px 20px; height: 150px; display: table; width: 100%; transition: all 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                                                                    <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                                        <div style="width: 52px; height: 52px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 22px; box-shadow: 0 4px 12px rgba(245,158,11,0.25);">🛡️</div>
                                                                        <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Seguridad Garantizada</h4>
                                                                        <p style="color: #64748b; font-size: 13px; line-height: 1.4; margin: 0;">Máxima protección de datos y cumplimiento GDPR total</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td width="50%" style="padding-left: 6px; padding-right: 30px; vertical-align: top;">
                                                                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 26px 20px; height: 150px; display: table; width: 100%; transition: all 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                                                                    <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                                                        <div style="width: 52px; height: 52px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 12px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 22px; box-shadow: 0 4px 12px rgba(139,92,246,0.25);">💎</div>
                                                                        <h4 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Soporte Premium</h4>
                                                                        <p style="color: #64748b; font-size: 13px; line-height: 1.4; margin: 0;">Equipo dedicado 24/7 y acompañamiento continuo</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- CTA atractivo pero profesional -->
                                <tr>
                                    <td style="text-align: center; padding: 35px 0;">
                                        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 35px; border: 1px solid #e2e8f0; position: relative; overflow: hidden;">
                                            <!-- Efecto decorativo -->
                                            
                                            <div style="position: relative; z-index: 2;">
                                                <h3 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">
                                                    ¿Listo para transformar tu negocio? 🚀
                                                </h3>
                                                <p style="color: #64748b; font-size: 15px; margin: 0 0 25px 0; max-width: 420px; margin-left: auto; margin-right: auto; line-height: 1.5;">
                                                    Descubre nuestro portafolio completo de soluciones IA y casos de éxito reales
                                                </p>
                                                
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                                    <tr>
                                                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); border-radius: 25px; box-shadow: 0 4px 15px rgba(59,130,246,0.4);">
                                                            <a href="https://www.lyxia.es/#servicios" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; letter-spacing: 0.3px; transition: all 0.3s ease;">
                                                                🌟 Explorar Soluciones IA
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Información de contacto moderna -->
                                <tr>
                                    <td style="padding-bottom: 40px;">
                                        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: #ffffff; border-radius: 12px; padding: 35px; position: relative; overflow: hidden;">
                                            <!-- Patrón decorativo -->
                                            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%); opacity: 0.6;"></div>
                                            
                                            <div style="position: relative; z-index: 2;">
                                                <div style="text-align: center; margin-bottom: 28px;">
                                                    <h3 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">
                                                        ¿Tienes alguna pregunta? 💬
                                                    </h3>
                                                    <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">
                                                        Nuestro equipo está aquí para ayudarte en cada paso
                                                    </p>
                                                </div>
                                                
                                                <!-- Grid de contactos balanceado -->
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <!-- EMAIL -->
                                                    <td width="33%" valign="top" style="padding: 12px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%">
                                                        <tr>
                                                        <td height="100%" style="background-color: rgba(255,255,255,0.1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); text-align: center; padding: 18px;">
                                                            <div style="font-size: 20px; margin-bottom: 6px; color: #60a5fa;">📧</div>
                                                            <p style="color: rgba(255,255,255,0.9); font-size: 12px; margin: 0 0 2px; font-weight: 600;">EMAIL</p>
                                                            <a href="mailto:info.lyxia@gmail.com" style="color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 500;">info.lyxia@gmail.com</a>
                                                        </td>
                                                        </tr>
                                                    </table>
                                                    </td>

                                                    <!-- WEB -->
                                                    <td width="33%" valign="top" style="padding: 12px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%">
                                                        <tr>
                                                        <td height="100%" style="background-color: rgba(255,255,255,0.1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); text-align: center; padding: 18px;">
                                                            <div style="font-size: 20px; margin-bottom: 6px; color: #34d399;">🌐</div>
                                                            <p style="color: rgba(255,255,255,0.9); font-size: 12px; margin: 0 0 2px; font-weight: 600;">WEB</p>
                                                            <a href="https://www.lyxia.es" style="color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 500;">www.lyxia.es</a>
                                                        </td>
                                                        </tr>
                                                    </table>
                                                    </td>

                                                    <!-- UBICACIÓN -->
                                                    <td width="33%" valign="top" style="padding: 12px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%">
                                                        <tr>
                                                        <td height="100%" style="background-color: rgba(255,255,255,0.1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); text-align: center; padding: 18px;">
                                                            <div style="font-size: 20px; margin-bottom: 6px; color: #f472b6;">📍</div>
                                                            <p style="color: rgba(255,255,255,0.9); font-size: 12px; margin: 0 0 2px; font-weight: 600;">UBICACIÓN</p>
                                                            <p style="color: #ffffff; font-size: 12px; margin: 0; font-weight: 500;">Valencia, ES</p>
                                                        </td>
                                                        </tr>
                                                    </table>
                                                    </td>
                                                </tr>
                                                </table>


                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Mensaje de cierre equilibrado -->
                                <tr>
                                    <td style="text-align: center; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                            En <strong>LYXIA</strong>, combinamos innovación tecnológica con un enfoque humano. 
                                            <strong>Tu éxito es nuestra pasión</strong>. 🎯
                                        </p>
                                        
                                        <!-- Firma moderna -->
                                        <div style="background-color: #f8fafc; border-radius: 10px; padding: 24px; margin-top: 25px; border-left: 3px solid #3b82f6;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td width="70" style="vertical-align: top; padding-right: 18px;">
                                                        <!-- Avatar del equipo -->
                                                        <div style="width: 55px; height: 55px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 20px; font-weight: 700; box-shadow: 0 2px 8px rgba(59,130,246,0.3);">
                                                            L
                                                        </div>
                                                    </td>
                                                    <td style="text-align: left;">
                                                        <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">
                                                            Equipo LYXIA 👥
                                                        </p>
                                                        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                                                            Especialistas en IA & Transformación Digital
                                                        </p>
                                                        <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: #ffffff; padding: 4px 12px; border-radius: 12px; display: inline-block; font-size: 11px; font-weight: 600;">
                                                            🤖 Powered by AI
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer corporativo equilibrado -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e293b 0%, #2d3748 100%); color: #cbd5e0; padding: 40px 35px; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <!-- Branding section -->
                                <tr>
                                    <td style="padding-bottom: 25px; border-bottom: 1px solid rgba(203,213,224,0.2);">
                                        <div style="background-color: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; display: inline-block; margin-bottom: 15px;">
                                            <img src="https://lyxia.es/assets/LOGO3.png" alt="LYXIA" width="150" style="display: block; max-width: 250px; height: auto; opacity: 0.9;">
                                        </div>
                                        
                                        <p style="color: #9ca3af; font-size: 13px; margin: 0; font-style: italic;">
                                            Transformando empresas con Inteligencia Artificial
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Links útiles -->
                                <tr>
                                    <td style="padding: 25px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                            <tr>
                                                <td style="padding: 0 18px;">
                                                    <a href="https://www.lyxia.es/#servicios" style="color: #cbd5e0; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.3s ease;">Servicios</a>
                                                </td>
                                                <td style="padding: 0 18px; border-left: 1px solid rgba(203,213,224,0.3);">
                                                    <a href="https://www.lyxia.es/#casos-exito" style="color: #cbd5e0; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.3s ease;">Casos de Éxito</a>
                                                </td>
                                                <td style="padding: 0 18px; border-left: 1px solid rgba(203,213,224,0.3);">
                                                    <a href="https://www.lyxia.es/#contacto" style="color: #cbd5e0; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.3s ease;">Contacto</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Footer info y compliance -->
                                <tr>
                                    <td style="border-top: 1px solid rgba(203,213,224,0.2); padding-top: 25px;">
                                        <p style="font-size: 14px; margin: 0 0 15px 0; color: #9ca3af; font-weight: 500;">
                                            © 2025 LYXIA • Innovación en Inteligencia Artificial
                                        </p>
                                        
                                        <!-- Badges de confianza -->
                                        <div style="margin: 15px 0 20px 0;">
                                            <span style="background-color: rgba(59,130,246,0.2); color: #60a5fa; padding: 6px 12px; border-radius: 15px; font-size: 11px; margin: 0 6px; border: 1px solid rgba(59,130,246,0.3); display: inline-block;">
                                                🔒 GDPR Compliant
                                            </span>
                                            <span style="background-color: rgba(16,185,129,0.2); color: #34d399; padding: 6px 12px; border-radius: 15px; font-size: 11px; margin: 0 6px; border: 1px solid rgba(16,185,129,0.3); display: inline-block;">
                                                🛡️ Seguridad Enterprise
                                            </span>
                                        </div>
                                        
                                        <!-- Unsubscribe amigable -->
                                        <p style="font-size: 12px; margin: 15px 0 0 0; color: #6b7280; line-height: 1.4;">
                                            Si prefieres no recibir más emails sobre nuestras innovaciones, puedes 
                                            <a href="#" style="color: #9ca3af; text-decoration: underline;">actualizar tus preferencias aquí</a>
                                        </p>
                                        
                                        <!-- Info legal -->
                                        <div style="margin-top: 20px; padding: 15px; background-color: rgba(0,0,0,0.1); border-radius: 6px;">
                                            <p style="font-size: 11px; margin: 0; color: #6b7280; line-height: 1.3;">
                                                LYXIA AI Solutions • Valencia, España<br>
                                                Empresa de innovación tecnológica especializada en IA
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Pixel de seguimiento (invisible) -->
    <img src="https://analytics.lyxia.es/email-open?campaign=welcome&user=NOMBRE&timestamp=2025" width="1" height="1" style="display: none;" alt="">
</body>
</html>
    `;
};

    // --- SECCIÓN MODIFICADA DEL EVENTO SUBMIT ---
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateForm()) {
        const formCard = form.closest('.cnt-form-card');
        if (formCard) {
          formCard.classList.add('shake');
          setTimeout(() => formCard.classList.remove('shake'), 500);
        }
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      // 1. Generamos el HTML del correo llamando a nuestra nueva función
      const emailHTML = createBeautifulEmailHTML( 
          inputs.nombre.value.trim(),
          inputs.email.value.trim(),
          inputs.asunto.value,
          inputs.mensaje.value.trim(),
          inputs.descuento.value.trim()
      );

      // 2. Creamos el objeto de parámetros. Solo necesitamos enviar el HTML.
      // También enviamos 'from_email' para usarlo en el campo "Reply-to".
      const templateParams = {
          from_name: inputs.nombre.value.trim(),
          from_email: inputs.email.value.trim(),
          html_content: emailHTML // Aquí va todo el código HTML del correo
      };

      // 3. Usamos emailjs.send() con nuestros nuevos parámetros
      emailjs.send(serviceID, templateID, templateParams).then(
        () => {
          const successModal = document.getElementById('successModal');
          if (successModal) successModal.classList.add('cnt-active');
          form.reset();
          Object.values(inputs).forEach(hideError);
          form.querySelectorAll('.cnt-input, .cnt-textarea').forEach(el => el.dispatchEvent(new Event('input')));
        },
        (error) => {
          alert("Error al enviar el mensaje. Por favor, inténtalo más tarde.");
          console.error("Error de EmailJS:", error);
        }
      ).finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
      });
    });

    const closeSuccessModalBtn = document.getElementById('closeSuccessModal');
    const successModal = document.getElementById('successModal');
    if (closeSuccessModalBtn && successModal) {
      closeSuccessModalBtn.addEventListener('click', () => {
        successModal.classList.remove('cnt-active');
      });
    }
};

  // --- INICIALIZACIÓN DE AMBAS FUNCIONES ---
  initAdvancedRoulette();
  initContactForm();
});

//================================================================
// 9. FOOTER
//================================================================
document.addEventListener('DOMContentLoaded', function() {
        // Botón de "Volver Arriba"
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            window.addEventListener('scroll', () => {
                backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
            });
            backToTopButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Actualizar el año del copyright
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    });



//================================================================
// 10. SECCIÓN DE ACCIÓN (CTA) - VERSIÓN CORREGIDA
//================================================================
document.addEventListener('DOMContentLoaded', function() {
      // Animación de entrada suave
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      document.querySelectorAll('.cta-title, .cta-description, .cta-benefits, .cta-action-area').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
      });

      // Efecto ripple para el botón
      const primaryBtn = document.querySelector('.btn-primary');
      if (primaryBtn) {
        primaryBtn.addEventListener('click', function(e) {
          const ripple = document.createElement('span');
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          ripple.style.position = 'absolute';
          ripple.style.borderRadius = '50%';
          ripple.style.background = 'rgba(255, 255, 255, 0.3)';
          ripple.style.transform = 'scale(0)';
          ripple.style.animation = 'ripple 0.6s linear';
          ripple.style.pointerEvents = 'none';
          
          this.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      }

      // Inicializar Lottie
      if (typeof lottie !== 'undefined') {
        const lottieContainer = document.getElementById('lottie-animation2');
        lottieContainer.innerHTML = ''; // Limpiar placeholder
        
        lottie.loadAnimation({
          container: lottieContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          // 4. RUTA DEL LOTTIE ACTUALIZADA
          path: "assets/lottie1.json"
        });
      }

      // Smooth scroll para enlaces internos
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    });

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(rippleStyle);






//================================================================
// COOKIES
//================================================================

    let cookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            personalization: false
        };

        // Mostrar banner al cargar la página
        window.addEventListener('load', function() {
            setTimeout(() => {
                //if (!localStorage.getItem('cookieConsent')) {
                    showCookieBanner();
                //}
            }, 1000);
        });

        function showCookieBanner() {
            document.getElementById('cookieBanner').classList.add('show');
        }

        function hideCookieBanner() {
            document.getElementById('cookieBanner').classList.remove('show');
        }

        function acceptAllCookies() {
            cookiePreferences = {
                necessary: true,
                analytics: true,
                marketing: true,
                personalization: true
            };
            
            saveCookiePreferences();
            loadCookies();
            hideCookieBanner();
            closeCookieModal();
            
            // Mostrar mensaje de confirmación
            showToast('Todas las cookies han sido aceptadas');
        }

        function rejectCookies() {
            cookiePreferences = {
                necessary: true,
                analytics: false,
                marketing: false,
                personalization: false
            };
            
            saveCookiePreferences();
            hideCookieBanner();
            closeCookieModal();
            
            // Mostrar mensaje de confirmación
            showToast('Solo las cookies necesarias han sido aceptadas');
        }

        function showCookieSettings() {
            document.getElementById('cookieModal').classList.add('show');
            
            // Cargar preferencias actuales
            document.getElementById('necessary').checked = cookiePreferences.necessary;
            document.getElementById('analytics').checked = cookiePreferences.analytics;
            document.getElementById('marketing').checked = cookiePreferences.marketing;
            document.getElementById('personalization').checked = cookiePreferences.personalization;
        }

        function closeCookieModal() {
            document.getElementById('cookieModal').classList.remove('show');
        }

        function toggleCategory(category) {
            const content = document.getElementById(category + '-content');
            content.classList.toggle('show');
        }

        function savePreferences() {
            cookiePreferences.necessary = document.getElementById('necessary').checked;
            cookiePreferences.analytics = document.getElementById('analytics').checked;
            cookiePreferences.marketing = document.getElementById('marketing').checked;
            cookiePreferences.personalization = document.getElementById('personalization').checked;
            
            saveCookiePreferences();
            loadCookies();
            hideCookieBanner();
            
            showToast('Preferencias guardadas correctamente');
        }

        function saveCookiePreferences() {
            localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
        }

        function loadCookiePreferences() {
            const saved = localStorage.getItem('cookieConsent');
            if (saved) {
                cookiePreferences = JSON.parse(saved);
            }
        }

        function loadCookies() {
            // Aquí cargarías las cookies según las preferencias
            console.log('Cargando cookies según preferencias:', cookiePreferences);
            
            if (cookiePreferences.analytics) {
                // Cargar Google Analytics, etc.
                console.log('✓ Cookies analíticas cargadas');
            }
            
            if (cookiePreferences.marketing) {
                // Cargar Facebook Pixel, Google Ads, etc.
                console.log('✓ Cookies de marketing cargadas');
            }
            
            if (cookiePreferences.personalization) {
                // Cargar cookies de personalización
                console.log('✓ Cookies de personalización cargadas');
            }
        }

        function showPrivacyPolicy() {
            alert('Aquí se abriría tu política de privacidad. Reemplaza esto con un enlace real a tu política de privacidad.');
        }

        function showToast(message) {
            // Crear toast de confirmación
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 10002;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-size: 14px;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        // Cerrar modal al hacer clic fuera
        document.getElementById('cookieModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeCookieModal();
            }
        });

        // Cargar preferencias guardadas al iniciar
        loadCookiePreferences();