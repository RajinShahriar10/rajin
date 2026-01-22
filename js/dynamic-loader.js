// Dynamic Content Loader - Makes entire website data-driven from admin panel
class DynamicLoader {
    constructor() {
        this.data = {
            projects: [],
            skills: [],
            about: {},
            settings: {}
        };
        this.init();
    }

    init() {
        console.log('🚀 Dynamic Loader initialized');
        this.loadAllData();
        this.setupDataRefresh();
    }

    async loadAllData() {
        console.log('📦 Loading all dynamic data...');
        
        try {
            // Load projects
            await this.loadProjects();
            
            // Load skills
            await this.loadSkills();
            
            // Load about data
            await this.loadAboutData();
            
            // Load settings
            await this.loadSettings();
            
            // Apply all data to website
            this.applyAllData();
            
            console.log('✅ All dynamic data loaded and applied');
            
        } catch (error) {
            console.error('❌ Error loading dynamic data:', error);
            this.applyFallbackData();
        }
    }

    async loadProjects() {
        try {
            // Try admin data first
            const adminProjects = localStorage.getItem('portfolioProjects');
            if (adminProjects) {
                this.data.projects = JSON.parse(adminProjects);
                console.log('📦 Loaded projects from admin:', this.data.projects.length);
                return;
            }

            // Fallback to JSON file
            const response = await fetch('content/projects/projects.json');
            if (response.ok) {
                this.data.projects = await response.json();
                console.log('📁 Loaded projects from JSON:', this.data.projects.length);
                return;
            }

            // Final fallback
            this.data.projects = this.getSampleProjects();
            console.log('🔧 Using sample projects');
            
        } catch (error) {
            console.log('❌ Error loading projects:', error);
            this.data.projects = this.getSampleProjects();
        }
    }

    async loadSkills() {
        try {
            // Try admin data first
            const adminSkills = localStorage.getItem('portfolioSkills');
            if (adminSkills) {
                this.data.skills = JSON.parse(adminSkills);
                console.log('📦 Loaded skills from admin:', this.data.skills.length);
                return;
            }

            // Fallback to JSON file
            const response = await fetch('content/skills/skills.json');
            if (response.ok) {
                this.data.skills = await response.json();
                console.log('📁 Loaded skills from JSON:', this.data.skills.length);
                return;
            }

            // Final fallback
            this.data.skills = this.getSampleSkills();
            console.log('🔧 Using sample skills');
            
        } catch (error) {
            console.log('❌ Error loading skills:', error);
            this.data.skills = this.getSampleSkills();
        }
    }

    async loadAboutData() {
        try {
            // Try admin data first
            const adminAbout = localStorage.getItem('portfolioAbout');
            if (adminAbout) {
                this.data.about = JSON.parse(adminAbout);
                console.log('📦 Loaded about data from admin');
                return;
            }

            // Fallback to JSON file
            const response = await fetch('content/about/about.json');
            if (response.ok) {
                this.data.about = await response.json();
                console.log('📁 Loaded about data from JSON');
                return;
            }

            // Final fallback
            this.data.about = this.getSampleAbout();
            console.log('🔧 Using sample about data');
            
        } catch (error) {
            console.log('❌ Error loading about data:', error);
            this.data.about = this.getSampleAbout();
        }
    }

    async loadSettings() {
        try {
            // Try admin data first
            const adminSettings = localStorage.getItem('portfolioSettings');
            if (adminSettings) {
                this.data.settings = JSON.parse(adminSettings);
                console.log('📦 Loaded settings from admin');
                return;
            }

            // Fallback to JSON file
            const response = await fetch('content/settings/settings.json');
            if (response.ok) {
                this.data.settings = await response.json();
                console.log('📁 Loaded settings from JSON');
                return;
            }

            // Final fallback
            this.data.settings = this.getSampleSettings();
            console.log('🔧 Using sample settings');
            
        } catch (error) {
            console.log('❌ Error loading settings:', error);
            this.data.settings = this.getSampleSettings();
        }
    }

    applyAllData() {
        console.log('🎨 Applying all dynamic data to website...');
        
        // Apply settings
        this.applySettings();
        
        // Apply about data
        this.applyAboutData();
        
        // Apply projects
        this.applyProjects();
        
        // Apply skills
        this.applySkills();
        
        // Apply contact info
        this.applyContactInfo();
    }

    applySettings() {
        const settings = this.data.settings;
        
        // Update page title
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = settings.siteTitle;
        }
        
        // Update meta description
        if (settings.siteDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = settings.siteDescription;
            
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.content = settings.siteDescription;
        }
        
        // Update author
        if (settings.authorName) {
            const metaAuthor = document.querySelector('meta[name="author"]');
            if (metaAuthor) metaAuthor.content = settings.authorName;
        }
        
        // Update hero section
        if (settings.heroTitle) {
            const heroTitle = document.querySelector('.hero-title .gradient-text');
            if (heroTitle) heroTitle.textContent = settings.heroTitle;
        }
        
        if (settings.heroSubtitle) {
            const heroSubtitle = document.querySelector('.hero-subtitle');
            if (heroSubtitle) heroSubtitle.textContent = settings.heroSubtitle;
        }
    }

    applyAboutData() {
        const about = this.data.about;
        
        // Update profile image
        if (about.image) {
            const profileImg = document.getElementById('aboutProfileImg');
            if (profileImg) profileImg.src = about.image;
        }
        
        // Update name
        if (about.name) {
            const displayName = document.getElementById('aboutDisplayName');
            const overlayName = document.getElementById('aboutOverlayName');
            if (displayName) displayName.textContent = about.name;
            if (overlayName) overlayName.textContent = about.name;
        }
        
        // Update tagline
        if (about.tagline) {
            const displayTagline = document.getElementById('aboutDisplayTagline');
            if (displayTagline) displayTagline.textContent = about.tagline;
        }
        
        // Update info items
        if (about.info && Array.isArray(about.info)) {
            const infoList = document.getElementById('aboutInfoList');
            if (infoList) {
                infoList.innerHTML = '';
                about.info.forEach(item => {
                    const infoItem = this.createInfoItem(item);
                    infoList.appendChild(infoItem);
                });
            }
        }
    }

    applyProjects() {
        if (window.carousel && this.data.projects.length > 0) {
            // Update carousel data directly
            window.carousel.projects = this.data.projects;
            window.carousel.renderProjects();
            window.carousel.renderIndicators();
            window.carousel.updateCarousel();
        }
    }

    applySkills() {
        if (this.data.skills.length > 0) {
            const skillsGrid = document.getElementById('skills-grid');
            if (skillsGrid) {
                skillsGrid.innerHTML = '';
                this.data.skills.forEach(skill => {
                    const skillCard = this.createSkillCard(skill);
                    skillsGrid.appendChild(skillCard);
                });
            }
        }
    }

    applyContactInfo() {
        const settings = this.data.settings;
        
        // Update email
        if (settings.email) {
            const emailElements = document.querySelectorAll('.contact-card p');
            emailElements.forEach(el => {
                if (el.textContent.includes('@') || el.textContent.includes('example.com')) {
                    el.textContent = settings.email;
                }
            });
        }
        
        // Update phone
        if (settings.phone) {
            const phoneElements = document.querySelectorAll('.contact-card p');
            phoneElements.forEach(el => {
                if (el.textContent.includes('+') || el.textContent.includes('555')) {
                    el.textContent = settings.phone;
                }
            });
        }
        
        // Update location
        if (settings.location) {
            const locationElements = document.querySelectorAll('.contact-card p');
            locationElements.forEach(el => {
                if (el.textContent.includes('San Francisco') || el.textContent.includes('CA')) {
                    el.textContent = settings.location;
                }
            });
        }
    }

    createInfoItem(item) {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        infoItem.innerHTML = `
            <i class="fas ${item.icon}"></i>
            <div class="info-content">
                <h4>${item.title}</h4>
                <p>${item.content}</p>
            </div>
        `;
        return infoItem;
    }

    createSkillCard(skill) {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `
            <div class="skill-icon">
                <i class="${skill.icon}"></i>
            </div>
            <div class="skill-info">
                <h3>${skill.name}</h3>
                <div class="skill-level">
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                    <span class="skill-percentage">${skill.level}%</span>
                </div>
            </div>
        `;
        return skillCard;
    }

    setupDataRefresh() {
        // Listen for admin updates
        window.addEventListener('storage', (e) => {
            if (e.key === 'adminUpdateTime') {
                console.log('🔄 Admin update detected, refreshing data...');
                setTimeout(() => this.loadAllData(), 1000);
            }
        });

        // Listen for sync manager updates
        if (window.syncManager) {
            window.syncManager.onUpdate = () => {
                console.log('🔄 Sync manager update detected...');
                this.loadAllData();
            };
        }
    }

    // Sample data fallbacks
    getSampleProjects() {
        return [
            {
                id: 1,
                title: "E-Commerce Platform",
                description: "A modern e-commerce platform with real-time inventory and secure payments.",
                image: "https://picsum.photos/seed/ecommerce/500/300.jpg",
                technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                liveUrl: "https://example.com",
                githubUrl: "https://github.com"
            }
        ];
    }

    getSampleSkills() {
        return [
            {
                id: 1,
                name: "JavaScript",
                icon: "fab fa-js",
                level: 90,
                color: "#F7DF1E"
            }
        ];
    }

    getSampleAbout() {
        return {
            name: "MD. RAJIN SHAHRIAR",
            tagline: "Passionate Web Developer & Tech Entrepreneur",
            image: "https://via.placeholder.com/400x500/667eea/ffffff?text=MD.+RAJIN+SHAHRIAR",
            info: [
                { icon: "fa-graduation-cap", title: "Education", content: "BSc in Computer Science & Engineering" },
                { icon: "fa-briefcase", title: "Professional", content: "Founder & CEO at Devlify App" }
            ]
        };
    }

    getSampleSettings() {
        return {
            siteTitle: "Rajin's Portfolio",
            siteDescription: "Professional web developer portfolio showcasing modern web development projects",
            authorName: "MD. RAJIN SHAHRIAR",
            heroTitle: "RAJIN SHAHRIAR",
            heroSubtitle: "Building modern, responsive, and user-friendly web experiences",
            email: "hello@example.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA"
        };
    }

    applyFallbackData() {
        console.log('🔧 Applying fallback data...');
        this.data.projects = this.getSampleProjects();
        this.data.skills = this.getSampleSkills();
        this.data.about = this.getSampleAbout();
        this.data.settings = this.getSampleSettings();
        this.applyAllData();
    }

    // Public method to refresh specific data type
    async refreshData(dataType) {
        console.log(`🔄 Refreshing ${dataType} data...`);
        
        switch(dataType) {
            case 'projects':
                await this.loadProjects();
                this.applyProjects();
                break;
            case 'skills':
                await this.loadSkills();
                this.applySkills();
                break;
            case 'about':
                await this.loadAboutData();
                this.applyAboutData();
                break;
            case 'settings':
                await this.loadSettings();
                this.applySettings();
                this.applyContactInfo();
                break;
            default:
                await this.loadAllData();
        }
    }
}

// Initialize dynamic loader
window.dynamicLoader = new DynamicLoader();

// Export for manual refresh
window.refreshWebsiteData = (dataType) => {
    if (window.dynamicLoader) {
        window.dynamicLoader.refreshData(dataType || 'all');
    }
};
