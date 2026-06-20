/* ===================================
   YUKgas.in — Shared Interactions
   Toast, Confetti, Page Transitions
   =================================== */

const YG = {
  // ===== Init (lazy create toast container) =====
  init() {
    if (this.toastContainer) return;
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    this.toastContainer.style.cssText = 'position:fixed;top:1rem;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none;width:max-content;max-width:90vw;';
    document.body.appendChild(this.toastContainer);
  },

  // ===== Toast Notification System =====
  toast(message, type = 'info', duration = 2500) {
    this.init();
    const icons = {
      success: 'check-circle-2',
      error: 'alert-circle',
      info: 'info',
      warning: 'alert-triangle',
    };

    const toast = document.createElement('div');
    toast.className = `toast-pop toast-${type}`;
    toast.innerHTML = `
      <i data-lucide="${icons[type] || icons.info}" class="w-5 h-5 flex-shrink-0"></i>
      <span>${message}</span>
    `;
    this.toastContainer.appendChild(toast);

    this.initLucide();

    setTimeout(() => {
      toast.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px) scale(0.95)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // ===== Popup Bulat (Circular Success Animation) =====
  // Bulat loading → centang muncul → hilang. Cepat & satisfying.
  pop(message = 'Berhasil!', type = 'success', duration = 1600) {
    const colors = {
      success: '#0CA789',
      error: '#FF4757',
      info: '#FF6B35',
      warning: '#FFB627',
    };
    const icons = {
      success: 'check',
      error: 'x',
      info: 'info',
      warning: 'alert-triangle',
    };
    const color = colors[type] || colors.info;
    const icon = icons[type] || icons.info;

    // Backdrop
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(45, 27, 18, 0);
      display: flex; align-items: center; justify-content: center;
      pointer-events: none;
      transition: background 0.2s ease;
    `;

    // Container
    const popup = document.createElement('div');
    popup.style.cssText = `
      display: flex; flex-direction: column; align-items: center; gap: 16px;
      transform: scale(0.8); opacity: 0;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    // Circle with SVG ring + checkmark
    const circleWrap = document.createElement('div');
    circleWrap.style.cssText = `position: relative; width: 90px; height: 90px;`;
    circleWrap.innerHTML = `
      <svg width="90" height="90" viewBox="0 0 90 90" style="transform: rotate(-90deg);">
        <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="5"/>
        <circle class="yg-pop-ring" cx="45" cy="45" r="40" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
      </svg>
      <div class="yg-pop-icon" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:${color};border-radius:50%;opacity:0;transform:scale(0);transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.5s;">
        <i data-lucide="${icon}" style="width:40px;height:40px;color:white;stroke-width:3"></i>
      </div>
    `;

    // Message text
    const text = document.createElement('p');
    text.textContent = message;
    text.style.cssText = `
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700; font-size: 1rem; color: white;
      text-align: center; max-width: 220px;
      opacity: 0; transform: translateY(8px);
      transition: all 0.3s ease 0.6s;
    `;

    popup.appendChild(circleWrap);
    popup.appendChild(text);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    this.initLucide();

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.background = 'rgba(45, 27, 18, 0.4)';
      overlay.style.backdropFilter = 'blur(4px)';
      popup.style.transform = 'scale(1)';
      popup.style.opacity = '1';

      // Ring animation (loading circle)
      const ring = circleWrap.querySelector('.yg-pop-ring');
      ring.animate([
        { strokeDashoffset: '251.3' },
        { strokeDashoffset: '0' }
      ], { duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });

      // Icon pop after ring completes
      setTimeout(() => {
        const iconEl = circleWrap.querySelector('.yg-pop-icon');
        iconEl.style.opacity = '1';
        iconEl.style.transform = 'scale(1)';
        text.style.opacity = '1';
        text.style.transform = 'translateY(0)';
      }, 800);
    });

    // Animate out
    setTimeout(() => {
      overlay.style.background = 'rgba(45, 27, 18, 0)';
      popup.style.transform = 'scale(0.9)';
      popup.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }, duration);
  },

  toast(message, type = 'info', duration = 3500) {
    this.init();
    const icons = {
      success: 'check-circle-2',
      error: 'alert-circle',
      info: 'info',
      warning: 'alert-triangle',
    };

    const toast = document.createElement('div');
    toast.className = `toast-pop toast-${type}`;
    toast.innerHTML = `
      <i data-lucide="${icons[type] || icons.info}" class="w-5 h-5 flex-shrink-0"></i>
      <span>${message}</span>
    `;
    this.toastContainer.appendChild(toast);

    this.initLucide();

    setTimeout(() => {
      toast.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px) scale(0.95)';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  },

  // ===== Confetti Burst =====
  confetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    try {
      const colors = ['#FF6B35', '#FFB627', '#0CA789', '#FF9F1C', '#FFD166'];
      const count = 30;

      for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = x + 'px';
        piece.style.top = y + 'px';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDelay = (Math.random() * 0.2) + 's';
        piece.style.animationDuration = (0.8 + Math.random() * 0.6) + 's';

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const velocity = 100 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 100;

        piece.animate([
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${tx}px, ${ty + 300}px) rotate(${720 * (Math.random() > 0.5 ? 1 : -1)}deg)`, opacity: 0 }
        ], {
          duration: 800 + Math.random() * 600,
          easing: 'cubic-bezier(0.1, 0.5, 0.3, 1)',
          fill: 'forwards'
        });

      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 1500);
    }
    } catch(e) { console.warn('confetti skipped:', e.message); }
  },

  // ===== Page Transition Out =====
  transitionOut(callback) {
    document.body.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateX(-20px) scale(0.98)';
    setTimeout(() => {
      callback();
    }, 250);
  },

  // ===== Smooth Navigate =====
  navigate(url) {
    this.transitionOut(() => {
      window.location.href = url;
    });
  },

  // ===== Ripple Effect on Click =====
  ripple(element, event) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      pointer-events: none;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      animation: rippleExpand 0.5s ease-out;
    `;
    element.style.position = element.style.position || 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 500);
  },

  // ===== Haptic-like vibration feedback =====
  haptic(pattern = 10) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  },

  // ===== Lucide init with retry (fixes CDN race condition) =====
  initLucide(retries = 0) {
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
      return;
    }
    if (retries < 30) {
      setTimeout(() => this.initLucide(retries + 1), 100);
    }
  }
};

// Ripple keyframes (inject once)
if (!document.getElementById('ripple-style')) {
  const style = document.createElement('style');
  style.id = 'ripple-style';
  style.textContent = `
    @keyframes rippleExpand {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== Page Enter Animation =====
window.addEventListener('load', () => {
  document.body.classList.add('animate-page-enter');

  // Auto-init lucide (with retry in case CDN is slow)
  YG.initLucide();

  // Ripple on all buttons
  document.querySelectorAll('a[href], button').forEach(el => {
    el.addEventListener('click', (e) => {
      YG.ripple(el, e);
      YG.haptic(5);
    });
  });
});

// ===== Smooth Page Exit on Link Click =====
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');

  // Skip: external links, new tab, hash links, JS void
  if (!href ||
      href.startsWith('http') ||
      href.startsWith('#') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      e.ctrlKey || e.metaKey || e.shiftKey
  ) return;

  // Intercept internal navigation
  e.preventDefault();
  YG.navigate(href);
});

// Expose globally
window.YG = YG;
