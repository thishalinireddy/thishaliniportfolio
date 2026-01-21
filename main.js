/**
 * Portfolio Website - Main JavaScript
 * Handles mobile navigation, smooth scrolling, and interactive features
 */

// ==========================================================================
// MOBILE NAVIGATION MENU
// ==========================================================================

const menuIcon = document.getElementById('menuIcon');
const nav = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav a');

/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
  const isOpen = nav.classList.contains('show');
  
  // Toggle menu visibility
  nav.classList.toggle('show');
  
  // Update ARIA attributes for accessibility
  menuIcon.setAttribute('aria-expanded', !isOpen);
  
  // Animate hamburger icon
  menuIcon.classList.toggle('active');
  
  // Prevent body scroll when menu is open on mobile
  if (!isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

/**
 * Close mobile menu when clicking a navigation link
 */
function closeMobileMenu() {
  if (window.innerWidth <= 768 && nav.classList.contains('show')) {
    nav.classList.remove('show');
    menuIcon.classList.remove('active');
    menuIcon.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

// Event Listeners
if (menuIcon) {
  menuIcon.addEventListener('click', toggleMenu);
}

// Close menu when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
  const isClickInsideNav = nav.contains(event.target);
  const isClickOnMenuIcon = menuIcon.contains(event.target);
  
  if (!isClickInsideNav && !isClickOnMenuIcon && nav.classList.contains('show')) {
    closeMobileMenu();
  }
});

// Close menu on window resize (to prevent layout issues)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768 && nav.classList.contains('show')) {
      closeMobileMenu();
    }
  }, 250);
});

// ==========================================================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ==========================================================================

/**
 * Smooth scroll to section with offset for fixed navbar
 */
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Only handle internal anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Calculate offset for fixed navbar
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, href);
      }
    }
  });
});

// ==========================================================================
// NAVBAR SCROLL EFFECT (Optional Enhancement)
// ==========================================================================

/**
 * Add shadow/background to navbar on scroll
 */
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add 'scrolled' class when scrolled down
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ==========================================================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ==========================================================================

/**
 * Highlight the active navigation link based on scroll position
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.pageYOffset + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      // Remove active class from all links
      navLinks.forEach(link => {
        link.classList.remove('active');
      });
      
      // Add active class to current link
      const activeLink = document.querySelector(`.nav a[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}

// Throttle scroll event for better performance
let scrollTimer;
window.addEventListener('scroll', () => {
  if (scrollTimer) {
    window.cancelAnimationFrame(scrollTimer);
  }
  
  scrollTimer = window.requestAnimationFrame(() => {
    updateActiveNavLink();
  });
});

// ==========================================================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ==========================================================================

/**
 * Observe elements and trigger animations when they enter viewport
 */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optionally unobserve after animation to improve performance
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll('.fade-in-left, .fade-in-right, .skill-box, .project, .education-item, .timeline-item');
animatedElements.forEach(el => observer.observe(el));

// ==========================================================================
// LAZY LOADING IMAGES (Optional Enhancement)
// ==========================================================================

/**
 * Lazy load images for better performance
 */
if ('loading' in HTMLImageElement.prototype) {
  // Browser supports native lazy loading
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback for browsers that don't support native lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// ==========================================================================
// KEYBOARD ACCESSIBILITY IMPROVEMENTS
// ==========================================================================

/**
 * Close mobile menu with Escape key
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('show')) {
    closeMobileMenu();
    menuIcon.focus(); // Return focus to menu button
  }
});

/**
 * Trap focus within mobile menu when open
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// Apply focus trap to mobile menu
if (nav) {
  trapFocus(nav);
}

// ==========================================================================
// PERFORMANCE OPTIMIZATION
// ==========================================================================

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
  // Preload fonts if using custom fonts
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.as = 'font';
  fontPreload.crossOrigin = 'anonymous';
  // Uncomment and modify if you're using custom fonts:
  // fontPreload.href = 'path/to/your/font.woff2';
  // document.head.appendChild(fontPreload);
}

// Call on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preloadCriticalResources);
} else {
  preloadCriticalResources();
}

// ==========================================================================
// CONSOLE MESSAGE (Optional - Remove in Production)
// ==========================================================================

console.log('%c👋 Welcome to my portfolio!', 'color: #4169E1; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out my GitHub!', 'color: #555; font-size: 14px;');
console.log('%chttps://github.com/thishalinireddy', 'color: #1a73e8; font-size: 14px;');
