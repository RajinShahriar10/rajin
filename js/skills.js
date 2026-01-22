// Skills Section with Circular Progress Loaders
class SkillsManager {
    constructor() {
        this.skills = [];
        this.animatedSkills = new Set();
        this.intersectionObserver = null;
        this.init();
    }

    init() {
        this.loadSkills();
        this.setupIntersectionObserver();
    }

    async loadSkills() {
        try {
            // Try to load from data file
            const response = await fetch('content/skills/skills.json');
            if (response.ok) {
                this.skills = await response.json();
            } else {
                // Fallback to sample skills
                this.skills = this.getSampleSkills();
            }
        } catch (error) {
            console.log('Using sample skills:', error);
            this.skills = this.getSampleSkills();
        }
        
        this.renderSkills();
    }

    getSampleSkills() {
        return [
            {
                name: "HTML5",
                icon: "fab fa-html5",
                level: 95,
                color: "#E34C26"
            },
            {
                name: "CSS3",
                icon: "fab fa-css3-alt",
                level: 90,
                color: "#1572B6"
            },
            {
                name: "JavaScript",
                icon: "fab fa-js",
                level: 88,
                color: "#F7DF1E"
            },
            {
                name: "React",
                icon: "fab fa-react",
                level: 85,
                color: "#61DAFB"
            },
            {
                name: "Node.js",
                icon: "fab fa-node-js",
                level: 82,
                color: "#339933"
            },
            {
                name: "Python",
                icon: "fab fa-python",
                level: 78,
                color: "#3776AB"
            },
            {
                name: "Git",
                icon: "fab fa-git-alt",
                level: 92,
                color: "#F05032"
            },
            {
                name: "Docker",
                icon: "fab fa-docker",
                level: 75,
                color: "#2496ED"
            }
        ];
    }

    renderSkills() {
        const skillsGrid = document.getElementById('skills-grid');
        if (!skillsGrid) return;

        skillsGrid.innerHTML = '';
        
        this.skills.forEach((skill, index) => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item fade-in-up stagger-item';
            skillItem.style.transitionDelay = `${index * 0.1}s`;
            skillItem.setAttribute('data-skill-id', index);
            
            skillItem.innerHTML = `
                <div class="skill-icon">
                    <svg class="skill-progress" width="80" height="80" viewBox="0 0 80 80">
                        <defs>
                            <linearGradient id="gradient-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:${skill.color};stop-opacity:1" />
                                <stop offset="100%" style="stop-color:${this.lightenColor(skill.color, 20)};stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <circle class="bg" cx="40" cy="40" r="36"></circle>
                        <circle class="progress" cx="40" cy="40" r="36" 
                                data-level="${skill.level}"
                                data-skill-id="${index}"
                                stroke="url(#gradient-${index})"></circle>
                    </svg>
                    <i class="${skill.icon}" style="color: ${skill.color}"></i>
                </div>
                <h3 class="skill-name">${skill.name}</h3>
            `;
            
            skillsGrid.appendChild(skillItem);
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillItem = entry.target;
                    const skillId = skillItem.getAttribute('data-skill-id');
                    
                    if (!this.animatedSkills.has(skillId)) {
                        this.animateSkill(skillItem);
                        this.animatedSkills.add(skillId);
                    }
                }
            });
        }, options);

        // Observe all skill items after a short delay to ensure DOM is ready
        setTimeout(() => {
            const skillItems = document.querySelectorAll('.skill-item');
            skillItems.forEach(item => this.intersectionObserver.observe(item));
        }, 100);
    }

    animateSkill(skillItem) {
        const progressCircle = skillItem.querySelector('.progress');
        const skillIcon = skillItem.querySelector('.skill-icon');
        const skillId = progressCircle.getAttribute('data-skill-id');
        
        if (!progressCircle) return;

        const level = parseInt(progressCircle.getAttribute('data-level'));
        const circumference = 2 * Math.PI * 36; // radius = 36
        const offset = circumference - (level / 100) * circumference;

        // Set initial state
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference;
        progressCircle.style.strokeLinecap = 'round';

        // Add entrance animation
        skillItem.style.opacity = '0';
        skillItem.style.transform = 'translateY(30px) scale(0.8)';
        
        setTimeout(() => {
            skillItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            skillItem.style.opacity = '1';
            skillItem.style.transform = 'translateY(0) scale(1)';
        }, 100);

        // Trigger circular progress animation
        setTimeout(() => {
            progressCircle.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)';
            progressCircle.style.strokeDashoffset = offset;
            
            // Add glow effect when animation completes
            setTimeout(() => {
                this.addGlowEffect(skillIcon, skillId);
            }, 2000);
        }, 500);
    }

    addGlowEffect(skillIcon, skillId) {
        const skill = this.skills[skillId];
        if (!skill) return;

        // Create glow effect
        skillIcon.style.transition = 'all 0.3s ease';
        skillIcon.style.transform = 'scale(1.1)';
        skillIcon.style.filter = `drop-shadow(0 0 20px ${skill.color})`;
        
        // Add pulse animation
        skillIcon.classList.add('skill-glow');
        
        // Remove glow after a moment
        setTimeout(() => {
            skillIcon.style.transform = 'scale(1)';
            skillIcon.style.filter = '';
            skillIcon.classList.remove('skill-glow');
        }, 1000);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    // Cleanup method
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
    }
}

// Initialize skills when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new SkillsManager();
});

// Add CSS for enhanced skills animations
const enhancedSkillsStyles = `
    .skill-item {
        opacity: 0;
        transform: translateY(30px) scale(0.8);
        transition: opacity 0.6s ease, transform 0.6s ease;
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        padding: 1.5rem;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .skill-item.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .skill-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
        transition: left 0.5s;
    }

    .skill-item:hover::before {
        left: 100%;
    }

    .skill-icon {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        position: relative;
        z-index: 2;
    }

    .skill-icon i {
        font-size: 2.5rem;
        z-index: 2;
        position: relative;
        transition: all 0.3s ease;
    }

    .skill-progress {
        position: absolute;
        top: 0;
        left: 0;
        transform: rotate(-90deg);
        z-index: 1;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .skill-progress circle {
        fill: none;
        stroke-width: 4;
        transition: all 0.3s ease;
    }

    .skill-progress .bg {
        stroke: var(--glass-border);
        opacity: 0.3;
    }

    .skill-progress .progress {
        stroke-linecap: round;
        filter: drop-shadow(0 0 3px currentColor);
    }

    .skill-name {
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
        font-size: 0.875rem;
        letter-spacing: 0.5px;
    }

    .skill-glow {
        animation: skill-pulse 1s ease-in-out;
    }

    @keyframes skill-pulse {
        0% {
            box-shadow: 0 0 5px currentColor;
        }
        50% {
            box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
        }
        100% {
            box-shadow: 0 0 5px currentColor;
        }
    }

    .skill-item:hover .skill-icon i {
        transform: scale(1.1);
    }

    .skill-item:hover .skill-progress .progress {
        stroke-width: 5;
        filter: drop-shadow(0 0 8px currentColor);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .skills-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 1rem;
        }

        .skill-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 0.75rem;
        }

        .skill-icon i {
            font-size: 2rem;
        }

        .skill-progress {
            width: 60px;
            height: 60px;
        }

        .skill-progress circle {
            cx: 30;
            cy: 30;
            r: 26;
        }

        .skill-item {
            padding: 1rem;
        }
    }

    @media (max-width: 480px) {
        .skills-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
        }

        .skill-icon {
            width: 50px;
            height: 50px;
        }

        .skill-icon i {
            font-size: 1.5rem;
        }

        .skill-progress {
            width: 50px;
            height: 50px;
        }

        .skill-progress circle {
            cx: 25;
            cy: 25;
            r: 22;
        }
    }
`;

// Inject enhanced styles
const enhancedStyleSheet = document.createElement('style');
enhancedStyleSheet.textContent = enhancedSkillsStyles;
document.head.appendChild(enhancedStyleSheet);
