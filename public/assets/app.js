/* ===================================
   YUKgas.in — Shared Interactions
   Toast, Confetti, Page Transitions
   =================================== */

// ===== Toast Notification System =====
const YG = {
  toastContainer: null,

  init() {
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.className = 'toast-container';
      document.body.appendChild(this.toastContainer);
    }
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

    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px) scale(0.95)';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  },

  // ===== Confetti Burst =====
  confetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
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

      piece.style.animate = piece.animate([
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
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('animate-page-enter');

  // Auto-init lucide
  if (window.lucide) lucide.createIcons();

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
