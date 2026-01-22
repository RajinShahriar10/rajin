// Animation Controller
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupTextAnimations();
    }

    setupScrollAnimations() {
        // General fade-in animations
        const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up, .fade-in-down');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add stagger effect for multiple items
                    const parent = entry.target.parentElement;
                    if (parent && parent.classList.contains('stagger-container')) {
                        const children = parent.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => fadeObserver.observe(el));
        this.observers.set('fade', fadeObserver);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', this.throttle(handleParallax, 10));
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    setupTextAnimations() {
        // Typewriter effect
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.dataset.typewriter;
            const speed = parseInt(element.dataset.speed) || 100;
            
            element.textContent = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    typeWriter();
                    observer.disconnect();
                }
            });
            
            observer.observe(element);
        });

        // Text scramble effect
        const scrambleElements = document.querySelectorAll('[data-scramble]');
        
        scrambleElements.forEach(element => {
            const originalText = element.textContent;
            const chars = '!<>-_\\/[]{}—=+*^?#________';
            
            element.addEventListener('mouseenter', () => {
                this.scrambleText(element, originalText, chars);
            });
        });
    }

    scrambleText(element, finalText, chars) {
        const iterations = 10;
        let iteration = 0;
        
        const interval = setInterval(() => {
            element.textContent = finalText
                .split('')
                .map((letter, index) => {
                    if (index < iteration) {
                        return finalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iteration >= finalText.length) {
                clearInterval(interval);
            }
            
            iteration += 1 / 3;
        }, 30);
    }

    // Utility functions
    throttle(func, limit) {
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

    debounce(func, wait) {
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

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Reveal animations on scroll
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(element => revealObserver.observe(element));
}

// Floating elements animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating');
    
    floatingElements.forEach((element, index) => {
        const duration = 3 + (index * 0.5);
        const delay = index * 0.2;
        
        element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
}

// Mouse follower effect
function initMouseFollower() {
    const follower = document.createElement('div');
    follower.className = 'mouse-follower';
    document.body.appendChild(follower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateFollower = () => {
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;
        
        followerX += dx * 0.1;
        followerY += dy * 0.1;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    };

    animateFollower();

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            follower.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            follower.classList.remove('hover');
        });
    });
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new AnimationController();
    revealOnScroll();
    initFloatingElements();
    
    // Initialize mouse follower only on desktop
    if (window.innerWidth > 768) {
        initMouseFollower();
    }
});

// Add CSS for mouse follower
const mouseFollowerStyles = `
    .mouse-follower {
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
    }

    .mouse-follower.hover {
        transform: translate(-50%, -50%) scale(2);
        background: radial-gradient(circle, rgba(0, 212, 255, 0.8), transparent);
    }

    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .reveal.active {
        opacity: 1;
        transform: translateY(0);
    }

    .stagger-container > * {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .stagger-container > .visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mouseFollowerStyles;
document.head.appendChild(styleSheet);
