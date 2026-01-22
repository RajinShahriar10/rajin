// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initLoadingScreen();
    initScrollEffects();
    initTechBackground();
    initSmoothScroll();
    initFloatingLogos();
    loadSiteSettings();
});

// Load site settings from admin data
function loadSiteSettings() {
    try {
        const adminSettings = localStorage.getItem('portfolioSettings');
        if (adminSettings) {
            const settings = JSON.parse(adminSettings);
            console.log('⚙️ Loaded site settings from admin panel');
            
            // Update page title
            if (settings.siteTitle) {
                document.title = settings.siteTitle + ' - Modern & Professional';
                document.querySelector('meta[property="og:title"]').content = settings.siteTitle;
            }
            
            // Update meta description
            if (settings.siteDescription) {
                document.querySelector('meta[name="description"]').content = settings.siteDescription;
                document.querySelector('meta[property="og:description"]').content = settings.siteDescription;
            }
            
            // Update author
            if (settings.authorName) {
                document.querySelector('meta[name="author"]').content = settings.authorName;
            }
            
            // Update hero section
            const heroTitle = document.querySelector('.hero-title .gradient-text');
            if (heroTitle && settings.heroTitle) {
                heroTitle.textContent = settings.heroTitle;
            }
            
            const heroSubtitle = document.querySelector('.hero-subtitle');
            if (heroSubtitle && settings.heroSubtitle) {
                heroSubtitle.textContent = settings.heroSubtitle;
            }
            
            // Update footer copyright
            const footerCopyright = document.querySelector('.footer-bottom p');
            if (footerCopyright) {
                footerCopyright.textContent = `© 2024 ${settings.siteTitle || 'Web Developer Portfolio'}. All rights reserved.`;
            }
            
            // Update contact information
            updateContactInfo(settings);
        }
    } catch (error) {
        console.log('⚠️ Using default site settings:', error);
    }
}

// Update contact information in the footer
function updateContactInfo(settings) {
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        const emailLink = contactInfo.querySelector('a[href^="mailto:"]');
        const phoneLink = contactInfo.querySelector('a[href^="tel:"]');
        const locationText = contactInfo.querySelector('.contact-item:nth-child(3) span');
        
        if (emailLink && settings.email) {
            emailLink.href = `mailto:${settings.email}`;
            emailLink.innerHTML = `<i class="fas fa-envelope"></i> ${settings.email}`;
        }
        
        if (phoneLink && settings.phone) {
            phoneLink.href = `tel:${settings.phone}`;
            phoneLink.innerHTML = `<i class="fas fa-phone"></i> ${settings.phone}`;
        }
        
        if (locationText && settings.location) {
            locationText.textContent = settings.location;
        }
    }
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link highlighting based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Loading screen
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1000);
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up, .fade-in-down, .scale-in, .scale-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Animated tech background for hero section
function initTechBackground() {
    const canvas = document.getElementById('tech-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let connections = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Mouse position tracking
    window.addEventListener('mousemove', function(e) {
        mouse.x = e.x;
        mouse.y = e.y;
        updateFloatingLogos(e.x, e.y);
    });

    window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const forceX = (dx / distance) * force * 2;
                    const forceY = (dy / distance) * force * 2;
                    this.x -= forceX;
                    this.y -= forceY;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    function createParticles() {
        particles = [];
        const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections between particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    // Recreate particles on resize
    window.addEventListener('resize', createParticles);
}

// Floating logos interaction
function updateFloatingLogos(mouseX, mouseY) {
    const techLogos = document.querySelectorAll('.tech-logo');
    
    techLogos.forEach(logo => {
        const rect = logo.getBoundingClientRect();
        const logoX = rect.left + rect.width / 2;
        const logoY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(mouseX - logoX, 2) + Math.pow(mouseY - logoY, 2)
        );
        
        // React to mouse proximity
        if (distance < 150) {
            const force = (150 - distance) / 150;
            const moveX = (logoX - mouseX) * force * 0.1;
            const moveY = (logoY - mouseY) * force * 0.1;
            
            logo.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.3})`;
            logo.style.opacity = 0.3 + force * 0.5;
        } else {
            logo.style.transform = '';
            logo.style.opacity = '';
        }
    });
}

// Initialize floating logos animation
function initFloatingLogos() {
    const techLogos = document.querySelectorAll('.tech-logo');
    
    techLogos.forEach((logo, index) => {
        // Add random initial rotation
        const randomRotation = Math.random() * 360;
        logo.style.transform = `rotate(${randomRotation}deg)`;
        
        // Add pulse effect on load
        setTimeout(() => {
            logo.style.transition = 'all 0.3s ease';
            logo.style.transform = 'rotate(0deg) scale(1.1)';
            
            setTimeout(() => {
                logo.style.transform = 'rotate(0deg) scale(1)';
            }, 300);
        }, index * 100);
    });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Parallax effect for hero section
function initParallax() {
    const heroContent = document.querySelector('.hero-content');
    const particles = document.querySelector('.particles');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
        
        if (particles) {
            particles.style.transform = `translateY(${scrolled * parallaxSpeed * 0.3}px)`;
        }
    }, 10));
}

// Initialize parallax when DOM is ready
document.addEventListener('DOMContentLoaded', initParallax);
