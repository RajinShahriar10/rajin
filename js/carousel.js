// Cinematic Infinite Carousel
class CinematicCarousel {
    constructor() {
        this.currentIndex = 0;
        this.projects = [];
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupEventListeners();
        this.startAutoplay();
    }

    async loadProjects() {
        try {
            // First try to load from admin localStorage
            const adminProjects = localStorage.getItem('portfolioProjects');
            if (adminProjects) {
                this.projects = JSON.parse(adminProjects);
                console.log('📦 Loaded projects from admin panel:', this.projects.length);
            } else {
                // Fallback to data file
                const response = await fetch('content/projects/projects.json');
                if (response.ok) {
                    this.projects = await response.json();
                    console.log('📁 Loaded projects from JSON file');
                } else {
                    // Final fallback to sample projects
                    this.projects = this.getSampleProjects();
                    console.log('🔧 Using sample projects');
                }
            }
        } catch (error) {
            console.log('⚠️ Using sample projects:', error);
            this.projects = this.getSampleProjects();
        }
        
        this.renderProjects();
        this.renderIndicators();
        this.updateCarousel();
    }

    getSampleProjects() {
        return [
            {
                id: 1,
                title: "E-Commerce Platform",
                description: "A modern e-commerce platform built with React and Node.js, featuring real-time inventory management, secure payment processing, and responsive design.",
                image: "assets/images/project1.jpg",
                technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                liveUrl: "https://example.com",
                githubUrl: "https://github.com"
            },
            {
                id: 2,
                title: "Task Management App",
                description: "Collaborative task management application with drag-and-drop functionality, real-time updates, and team collaboration features.",
                image: "assets/images/project2.jpg",
                technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
                liveUrl: "https://example.com",
                githubUrl: "https://github.com"
            },
            {
                id: 3,
                title: "Weather Dashboard",
                description: "Interactive weather dashboard with location-based forecasts, historical data visualization, and severe weather alerts.",
                image: "assets/images/project3.jpg",
                technologies: ["JavaScript", "Chart.js", "OpenWeather API"],
                liveUrl: "https://example.com",
                githubUrl: "https://github.com"
            },
            {
                id: 4,
                title: "Social Media Analytics",
                description: "Comprehensive analytics dashboard for social media metrics with data visualization and reporting features.",
                image: "assets/images/project4.jpg",
                technologies: ["Python", "Django", "D3.js", "PostgreSQL"],
                liveUrl: "https://example.com",
                githubUrl: "https://github.com"
            },
            {
                id: 5,
                title: "Portfolio Website",
                description: "Modern portfolio website with dynamic content management, optimized performance, and stunning visual effects.",
                image: "assets/images/project5.jpg",
                technologies: ["HTML5", "CSS3", "JavaScript", "Netlify CMS"],
                liveUrl: "https://example.com",
                githubUrl: "https://github.com"
            }
        ];
    }

    renderProjects() {
        const track = document.getElementById('carousel-track');
        if (!track) return;

        track.innerHTML = '';
        
        this.projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.src='https://picsum.photos/seed/project${project.id}/500/300.jpg'">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-buttons">
                    <a href="${project.liveUrl}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i> View Project
                    </a>
                    <a href="${project.githubUrl}" target="_blank" class="btn btn-secondary">
                        <i class="fab fa-github"></i> Code
                    </a>
                </div>
            `;
            track.appendChild(projectCard);
        });
    }

    renderIndicators() {
        const indicatorsContainer = document.getElementById('carousel-indicators');
        if (!indicatorsContainer) return;

        indicatorsContainer.innerHTML = '';
        
        this.projects.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === this.currentIndex ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }

    updateCarousel() {
        const track = document.getElementById('carousel-track');
        const indicators = document.querySelectorAll('.indicator');
        
        if (!track) return;

        // Calculate the transform position
        const slideWidth = 100; // percentage
        const offset = -this.currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}%)`;

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        // Add animation classes to current slide
        const allCards = document.querySelectorAll('.project-card');
        allCards.forEach((card, index) => {
            card.style.opacity = index === this.currentIndex ? '1' : '0.3';
            card.style.transform = index === this.currentIndex ? 'scale(1)' : 'scale(0.95)';
        });
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentIndex = (this.currentIndex + 1) % this.projects.length;
        this.updateCarousel();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
        this.updateCarousel();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        this.updateCarousel();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    setupEventListeners() {
        // Button controls
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch/Swipe support
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            carouselContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        }

        // Pause autoplay on hover
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => this.stopAutoplay());
            carouselWrapper.addEventListener('mouseleave', () => this.startAutoplay());
        }

        // Visibility change - pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoplay();
            } else {
                this.startAutoplay();
            }
        });
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide(); // Swipe left
            } else {
                this.prevSlide(); // Swipe right
            }
        }
    }

    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new CinematicCarousel();
});

// Add CSS for project cards if not already present
const carouselStyles = `
    .project-technologies {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 1rem 0;
        justify-content: center;
    }

    .tech-tag {
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
        color: var(--accent-cyan);
        transition: var(--transition-fast);
    }

    .tech-tag:hover {
        background: var(--accent-cyan);
        color: var(--bg-primary);
        transform: translateY(-2px);
    }

    .project-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
        flex-wrap: wrap;
    }

    .project-buttons .btn {
        padding: 0.75rem 1.5rem;
        font-size: 0.875rem;
    }

    @media (max-width: 768px) {
        .project-buttons {
            flex-direction: column;
            align-items: center;
        }

        .project-buttons .btn {
            width: 100%;
            max-width: 200px;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = carouselStyles;
document.head.appendChild(styleSheet);
