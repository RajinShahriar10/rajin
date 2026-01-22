// Real Cloud Storage - Actually saves to GitHub for cross-device sync
class RealCloudStorage {
    constructor() {
        this.repo = 'RajinShahriar10/rajin';
        this.branch = 'main';
        this.githubToken = localStorage.getItem('github_token') || null;
        this.init();
    }

    init() {
        console.log('🌐 Real Cloud Storage initialized');
        console.log('📝 GitHub token available:', !!this.githubToken);
        
        if (!this.githubToken) {
            console.log('⚠️ No GitHub token - using localStorage only');
            console.log('💡 To enable online saving: Add GitHub token in admin panel');
        }
    }

    async saveData(dataType, data) {
        try {
            console.log(`🌐 Saving ${dataType} to real cloud storage...`);
            
            // Always save to localStorage first (immediate)
            localStorage.setItem(`portfolio${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`, JSON.stringify(data));
            console.log(`✅ ${dataType} saved to localStorage`);
            
            // Try to save to GitHub (real online storage)
            if (this.githubToken) {
                const success = await this.saveToGitHub(dataType, data);
                if (success) {
                    console.log(`🌐 ${dataType} saved to GitHub - will sync across devices!`);
                    return true;
                } else {
                    console.log(`⚠️ GitHub save failed, but local save worked`);
                    return false;
                }
            } else {
                console.log(`⚠️ No GitHub token - ${dataType} saved locally only`);
                console.log('💡 Add GitHub token in admin panel to enable online saving');
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Error saving ${dataType}:`, error);
            return false;
        }
    }

    async saveToGitHub(dataType, data) {
        try {
            console.log(`🌐 Attempting to save ${dataType} to GitHub...`);
            console.log(`📝 Repository: ${this.repo}`);
            console.log(`🔑 Token available: ${!!this.githubToken}`);
            
            const filePath = `content/${dataType}/${dataType}.json`;
            const content = JSON.stringify(data, null, 2);
            console.log(`📁 File path: ${filePath}`);
            
            // Get current file info
            const sha = await this.getFileSHA(filePath);
            console.log(`🔍 File SHA: ${sha || 'new file'}`);
            
            // Update or create file
            const response = await fetch(`https://api.github.com/repos/${this.repo}/contents/${filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Update ${dataType} from admin panel - ${new Date().toISOString()}`,
                    content: btoa(unescape(encodeURIComponent(content))),
                    sha: sha,
                    branch: this.branch
                })
            });

            console.log(`📡 GitHub API Response Status: ${response.status}`);
            
            if (response.ok) {
                const result = await response.json();
                console.log(`✅ ${dataType} saved to GitHub:`, result.content.html_url);
                
                // Trigger website rebuild (for GitHub Pages)
                await this.triggerRebuild();
                
                return true;
            } else {
                const error = await response.json();
                console.log(`❌ GitHub API Error:`, error);
                console.log(`❌ Error details:`, error.message);
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Error saving to GitHub:`, error);
            console.log(`❌ Error stack:`, error.stack);
            return false;
        }
    }

    async getFileSHA(filePath) {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.repo}/contents/${filePath}?ref=${this.branch}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                }
            });

            if (response.ok) {
                const file = await response.json();
                return file.sha;
            } else if (response.status === 404) {
                return null; // File doesn't exist
            } else {
                console.log(`⚠️ GitHub API Error getting SHA:`, response.status);
                return null;
            }
        } catch (error) {
            console.log(`❌ Error getting file SHA:`, error);
            return null;
        }
    }

    async triggerRebuild() {
        try {
            // GitHub Pages rebuilds automatically when files are pushed
            console.log('🔄 GitHub Pages will rebuild automatically...');
            
            // Optional: Create a commit to trigger rebuild
            const timestamp = new Date().toISOString();
            console.log(`⏰ Rebuild triggered at: ${timestamp}`);
            
        } catch (error) {
            console.log(`⚠️ Could not trigger rebuild:`, error);
        }
    }

    async loadData(dataType) {
        try {
            console.log(`🌐 Loading ${dataType} from real cloud storage...`);
            
            // Try GitHub first (latest online data)
            if (this.githubToken) {
                const data = await this.loadFromGitHub(dataType);
                if (data) {
                    console.log(`✅ ${dataType} loaded from GitHub`);
                    return data;
                }
            }
            
            // Fallback to localStorage
            const localData = localStorage.getItem(`portfolio${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`);
            if (localData) {
                console.log(`💾 ${dataType} loaded from localStorage`);
                return JSON.parse(localData);
            }
            
            // Default data
            console.log(`🔧 Using default ${dataType} data`);
            return this.getDefaultData(dataType);
            
        } catch (error) {
            console.log(`❌ Error loading ${dataType}:`, error);
            return this.getDefaultData(dataType);
        }
    }

    async loadFromGitHub(dataType) {
        try {
            const filePath = `content/${dataType}/${dataType}.json`;
            const response = await fetch(`https://api.github.com/repos/${this.repo}/contents/${filePath}?ref=${this.branch}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                }
            });

            if (response.ok) {
                const file = await response.json();
                const content = atob(file.content);
                const data = JSON.parse(content);
                console.log(`📁 ${dataType} loaded from GitHub:`, data.length || Object.keys(data).length, 'items');
                return data;
            } else if (response.status === 404) {
                console.log(`⚠️ ${dataType} file not found on GitHub`);
                return null;
            } else {
                console.log(`⚠️ GitHub API Error loading ${dataType}:`, response.status);
                return null;
            }
            
        } catch (error) {
            console.log(`❌ Error loading ${dataType} from GitHub:`, error);
            return null;
        }
    }

    getDefaultData(dataType) {
        switch(dataType) {
            case 'projects':
                return [
                    {
                        id: 1,
                        title: "E-Commerce Platform",
                        description: "A modern e-commerce platform with real-time inventory and secure payments",
                        image: "https://picsum.photos/seed/ecommerce/500/300.jpg",
                        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                        liveUrl: "https://example.com",
                        githubUrl: "https://github.com"
                    }
                ];
            case 'skills':
                return [
                    {
                        id: 1,
                        name: "JavaScript",
                        icon: "fab fa-js",
                        level: 90,
                        color: "#F7DF1E",
                        category: "Frontend"
                    }
                ];
            case 'about':
                return {
                    name: "MD. RAJIN SHAHRIAR",
                    tagline: "Passionate Web Developer & Tech Entrepreneur",
                    image: "https://via.placeholder.com/400x500/667eea/ffffff?text=MD.+RAJIN+SHAHRIAR",
                    description: "Building modern, responsive, and user-friendly web experiences",
                    info: [
                        { icon: "fa-graduation-cap", title: "Education", content: "BSc in Computer Science & Engineering" },
                        { icon: "fa-briefcase", title: "Professional", content: "Founder & CEO at Devlify App" }
                    ]
                };
            case 'settings':
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
            default:
                return null;
        }
    }

    // Public methods
    async save(dataType, data) {
        return await this.saveData(dataType, data);
    }

    async load(dataType) {
        return await this.loadData(dataType);
    }

    // Setup GitHub token
    setupGitHubToken(token) {
        this.githubToken = token;
        localStorage.setItem('github_token', token);
        console.log('✅ GitHub token saved - online saving enabled!');
    }

    // Check if online saving is available
    isOnlineSavingAvailable() {
        return !!this.githubToken;
    }
}

// Initialize real cloud storage
window.realCloudStorage = new RealCloudStorage();

// Export for admin panel
window.saveToRealCloud = (dataType, data) => {
    if (window.realCloudStorage) {
        return window.realCloudStorage.save(dataType, data);
    }
};

window.loadFromRealCloud = (dataType) => {
    if (window.realCloudStorage) {
        return window.realCloudStorage.load(dataType);
    }
};

window.setupGitHubToken = (token) => {
    if (window.realCloudStorage) {
        return window.realCloudStorage.setupGitHubToken(token);
    }
};
