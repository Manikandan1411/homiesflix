// js/timeline.js

AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic', offset: 100 });

function renderTimeline() {
  const container = document.getElementById('timelineContainer');

  container.innerHTML = TIMELINE_EVENTS.map((event, i) => {
    const isEven = i % 2 === 0;
    return `
      <div class="tl-item" data-aos="${isEven ? 'fade-right' : 'fade-left'}" data-aos-delay="${i * 100}">
        ${isEven ? `
          <div class="tl-card">
            <img class="tl-card-img" src="${event.image}" alt="${event.title}" loading="lazy"/>
            <div class="tl-card-body">
              <div class="tl-card-year">${event.year}</div>
              <div class="tl-card-title">${event.title}</div>
              <p class="tl-card-desc">${event.description}</p>
            </div>
          </div>
          <div class="tl-dot"></div>
          <div class="tl-spacer"></div>
        ` : `
          <div class="tl-spacer"></div>
          <div class="tl-dot"></div>
          <div class="tl-card">
            <img class="tl-card-img" src="${event.image}" alt="${event.title}" loading="lazy"/>
            <div class="tl-card-body">
              <div class="tl-card-year">${event.year}</div>
              <div class="tl-card-title">${event.title}</div>
              <p class="tl-card-desc">${event.description}</p>
            </div>
          </div>
        `}
      </div>
    `;
  }).join('');

  // GSAP scroll-triggered glow on dots
  const dots = document.querySelectorAll('.tl-dot');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          boxShadow: '0 0 30px rgba(229,9,20,0.9)',
          duration: 0.4
        });
      }
    });
  }, { threshold: 0.5 });
  dots.forEach(d => observer.observe(d));
}

function toggleMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('mobileMenuOverlay');
  if (btn && overlay) {
    btn.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  }
}

document.addEventListener('DOMContentLoaded', renderTimeline);
