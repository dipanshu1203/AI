/**
 * Dipanshu Gupta - Portfolio Website JavaScript (CV Specialization)
 * Smooth micro-interactions, theme switching, and scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // === Theme Toggle Setup ===
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Set default theme from localStorage or system preference
  const currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  // Apply initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Toggle action
  themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let targetTheme = 'dark';
    
    if (theme === 'dark') {
      targetTheme = 'light';
    }
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
  });

  // === Sticky Header Navigation ===
  const headerNav = document.querySelector('.header-nav');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initially in case page loaded scrolled

  // === Scroll-Driven Fade-in Animations (Intersection Observer) ===
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    threshold: 0.15, // trigger when 15% of section is visible
    rootMargin: '0px'
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger skill progress bars specifically inside the section
        if (entry.target.id === 'skills-section') {
          const bars = entry.target.querySelectorAll('.skill-bar-fill');
          bars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.setProperty('--progress', progress);
          });
        }
        observer.unobserve(entry.target); // Animates once
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // === Interactive Copy Email Clipboard Feature ===
  const emailBox = document.getElementById('email-copy-box');
  if (emailBox) {
    emailBox.addEventListener('click', async () => {
      const emailText = emailBox.querySelector('.email-text').innerText;
      
      try {
        await navigator.clipboard.writeText(emailText);
        
        // Add visual confirmation classes
        emailBox.classList.add('copied');
        
        // Reset confirmation after 2.5 seconds
        setTimeout(() => {
          emailBox.classList.remove('copied');
        }, 2500);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  }

  // === Auto Active Navigation Link Highlighting ===
  const navLinks = document.querySelectorAll('.nav-item a');
  
  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    root: null,
    threshold: 0.4, // Highlight link when section takes 40% viewport
    rootMargin: '-10% 0px -40% 0px'
  });

  sections.forEach(section => {
    activeLinkObserver.observe(section);
  });
});
