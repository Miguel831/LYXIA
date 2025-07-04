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
document.addEventListener('DOMContentLoaded', function() {
    const stepsContainer = document.getElementById('procesoSteps');
    if (!stepsContainer) return;

    const steps = document.querySelectorAll('.proceso-step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('procesoProgreso');
    const indicadoresContainer = document.getElementById('indicadoresContainer');
    
    let currentStep = 0;
    const stepWidth = steps.length > 0 ? steps[0].offsetWidth + 30 : 0;
    
    const updateUI = () => {
      if (!stepsContainer.style.display || stepsContainer.style.display === 'flex') {
        stepsContainer.scrollLeft = currentStep * stepWidth;
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

    prevBtn.addEventListener('click', () => { currentStep = Math.max(0, currentStep - 1); updateUI(); });
    nextBtn.addEventListener('click', () => { currentStep = Math.min(steps.length - 1, currentStep + 1); updateUI(); });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.metodologia-section .animate-fadeInUp, .metodologia-section .estadistica').forEach(el => observer.observe(el));
    
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
    const wheelPanel = document.getElementById('wheel-panel');
    if (!wheelPanel) return;

    // --- RULETA ---
    const canvas = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin');
    const prizeMsg = document.getElementById('prize-message');
    const panelToggle = document.getElementById('panel-toggle');
    const closePanelBtn = document.querySelector('.close-panel');
    const ctx = canvas.getContext('2d');
    let spinning = false;

    const prizes = [
      { label: '5% OFF', color: '#4361ee', codePrefix: 'TECH5', weight: 40 },
      { label: '10% OFF', color: '#3a0ca3', codePrefix: 'TECH10', weight: 30 },
      { label: '15% OFF', color: '#7209b7', codePrefix: 'TECH15', weight: 15 },
      { label: '20% OFF', color: '#f72585', codePrefix: 'TECH20', weight: 10 },
      { label: 'ENVÍO FREE', color: '#4cc9f0', codePrefix: 'FREEDEL', weight: 3 },
      { label: 'REGALO!', color: '#560bad', codePrefix: 'SURPRISE', weight: 2 }
    ];

    const drawWheel = () => {
        const numSegments = prizes.length;
        const anglePerSegment = (2 * Math.PI) / numSegments;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        prizes.forEach((prize, i) => {
            const startAngle = i * anglePerSegment - (Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, startAngle, startAngle + anglePerSegment);
            ctx.closePath();
            ctx.fillStyle = prize.color;
            ctx.fill();
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(startAngle + anglePerSegment / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Montserrat';
            ctx.fillText(prize.label, (canvas.width / 2 - 5) * 0.65, 5);
            ctx.restore();
        });
    };

    const spinWheel = () => {
        if (spinning) return;
        spinning = true;
        spinBtn.disabled = true;

        const totalWeight = prizes.reduce((s, p) => s + p.weight, 0);
        let r = Math.random() * totalWeight;
        let winnerIndex = prizes.findIndex(p => (r -= p.weight) <= 0);
        const winner = prizes[winnerIndex];
        
        const sliceAngle = 2 * Math.PI / prizes.length;
        const targetAngle = (winnerIndex * sliceAngle) + (Math.random() * sliceAngle * 0.8 + sliceAngle * 0.1);
        const totalSpinAngle = (5 * 2 * Math.PI) + (2 * Math.PI - targetAngle);

        canvas.style.transition = 'transform 5s cubic-bezier(0.22, 0.61, 0.36, 1)';
        canvas.style.transform = `rotate(${totalSpinAngle}rad)`;

        canvas.addEventListener('transitionend', () => {
            showPrize(winner);
            canvas.style.transition = 'none';
            const currentRotation = totalSpinAngle % (2 * Math.PI);
            canvas.style.transform = `rotate(${currentRotation}rad)`;
            spinning = false;
            spinBtn.disabled = false;
        }, { once: true });
    };

    const showPrize = (prize) => {
        const prizeCode = `TECH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const container = prizeMsg.querySelector('.prize-container');
        container.innerHTML = `
            <button class="close-prize">✕</button>
            <h3 class="prize-title">¡Felicidades!</h3>
            <p class="prize-desc">Has ganado: <strong class="won-label">${prize.label}</strong></p>
            <div class="prize-code-wrapper">
                <div class="prize-code">${prizeCode}</div>
                <button class="copy-code-btn">Copiar</button>
            </div>
            <button class="apply-btn">Aplicar Ahora</button>`;
        prizeMsg.classList.add('show');

        container.querySelector('.close-prize').addEventListener('click', () => prizeMsg.classList.remove('show'));
        container.querySelector('.copy-code-btn').addEventListener('click', () => navigator.clipboard.writeText(prizeCode));
        container.querySelector('.apply-btn').addEventListener('click', () => {
            const discountInput = document.getElementById('descuento');
            if (discountInput) {
                discountInput.value = prizeCode;
                discountInput.dispatchEvent(new Event('input', { bubbles: true }));
                document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
            }
            prizeMsg.classList.remove('show');
        });
    };

    panelToggle.addEventListener('click', () => wheelPanel.classList.toggle('open'));
    closePanelBtn.addEventListener('click', () => wheelPanel.classList.remove('open'));
    spinBtn.addEventListener('click', spinWheel);
    drawWheel();

    // --- FORMULARIO DE CONTACTO ---
    const form = document.getElementById('contactoForm');
    const submitButton = form.querySelector('#submitBtn');
    const successModal = document.getElementById('successModal');
    const requiredFields = Array.from(form.querySelectorAll('[required]'));

    const validateField = (field) => {
      const value = field.type === 'checkbox' ? field.checked : field.value.trim();
      let isValid = field.required ? (field.type === 'checkbox' ? value : value !== '') : true;
      if (isValid && field.type === 'email' && value) {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      if (isValid && field.minLength > 0 && value) {
        isValid = value.length >= field.minLength;
      }
      field.classList.toggle('cnt-invalid', !isValid);
      const errorEl = document.getElementById(`${field.id}Error`);
      if (errorEl) errorEl.classList.toggle('cnt-error-visible', !isValid);
      return isValid;
    };
    
    const validateForm = () => requiredFields.every(validateField);

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateForm()) {
        submitButton.classList.add('cnt-loading');
        submitButton.disabled = true;
        const formData = new FormData(form);
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyTekPg8XgYWiGED9o_jNBV5QVyY8fuGl2mRb_gtD8fo_mI11b-ClFLcXv9JHUZQlGr/exec";

        fetch(WEB_APP_URL, { method: 'POST', body: formData, mode: 'no-cors' })
          .then(() => {
            successModal.classList.add('cnt-active');
            form.reset();
            requiredFields.forEach(f => f.classList.remove('cnt-invalid'));
            document.querySelectorAll('.cnt-error-message').forEach(el => el.classList.remove('cnt-error-visible'));
          })
          .catch(error => console.error('Error:', error))
          .finally(() => {
            submitButton.classList.remove('cnt-loading');
            submitButton.disabled = false;
          });
      }
    });

    requiredFields.forEach(field => field.addEventListener('input', () => validateField(field)));
    document.getElementById('closeSuccessModal').addEventListener('click', () => successModal.classList.remove('cnt-active'));
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