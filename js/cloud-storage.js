// Cloud Storage Manager - Free online storage for cross-device sync
class CloudStorage {
    constructor() {
        this.apiEndpoint = 'https://api.jsonbin.io/v3/b';
        this.binId = localStorage.getItem('portfolioCloudBinId') || null;
        this.masterKey = '$2a$10$YourMasterKeyHere'; // In production, use environment variable
        this.init();
    }

    init() {
        console.log('☁️ Cloud Storage initialized');
        this.setupBin();
    }

    async setupBin() {
        if (!this.binId) {
            // Create a new bin for this portfolio
            await this.createBin();
        }
    }

    async createBin() {
        try {
            const initialData = {
                projects: [],
                skills: [],
                about: {},
                settings: {},
                lastUpdated: new Date().toISOString()
            };

            const response = await fetch('https://api.jsonbin.io/v3/b', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.masterKey,
                    'X-Bin-Private': 'false',
                    'X-Bin-Name': 'portfolio-data'
                },
                body: JSON.stringify(initialData)
            });

            if (response.ok) {
                const result = await response.json();
                this.binId = result.id;
                localStorage.setItem('portfolioCloudBinId', this.binId);
                console.log('✅ Created cloud storage bin:', this.binId);
            } else {
                console.log('⚠️ Could not create cloud bin, using fallback');
            }
        } catch (error) {
            console.log('❌ Error creating cloud bin:', error);
        }
    }

    async saveData(dataType, data) {
        try {
            console.log(`☁️ Saving ${dataType} to cloud storage...`);
            
            // Get current data from cloud
            const currentData = await this.loadData();
            
            // Update specific data type
            currentData[dataType] = data;
            currentData.lastUpdated = new Date().toISOString();
            
            // Save to cloud
            const response = await fetch(`${this.apiEndpoint}/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.masterKey
                },
                body: JSON.stringify(currentData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`✅ ${dataType} saved to cloud storage:`, result);
                return result;
            } else {
                throw new Error(`Cloud save failed: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Error saving ${dataType} to cloud:`, error);
            // Fallback to localStorage
            this.saveToLocalStorage(dataType, data);
        }
    }

    async loadData() {
        try {
            if (!this.binId) {
                console.log('⚠️ No cloud bin ID, using localStorage');
                return this.getFromLocalStorage();
            }

            const response = await fetch(`${this.apiEndpoint}/${this.binId}/latest`, {
                headers: {
                    'X-Master-Key': this.masterKey
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Loaded data from cloud storage');
                return result.record;
            } else {
                throw new Error(`Cloud load failed: ${response.status}`);
            }
        } catch (error) {
            console.log('⚠️ Could not load from cloud, using localStorage:', error);
            return this.getFromLocalStorage();
        }
    }

    async loadDataType(dataType) {
        try {
            const allData = await this.loadData();
            return allData[dataType] || this.getDefaultData(dataType);
        } catch (error) {
            console.log(`⚠️ Could not load ${dataType} from cloud:`, error);
            return this.getFromLocalStorage(dataType);
        }
    }

    saveToLocalStorage(dataType, data) {
        localStorage.setItem(`portfolio${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`, JSON.stringify(data));
        console.log(`💾 ${dataType} saved to localStorage as fallback`);
    }

    getFromLocalStorage(dataType) {
        if (dataType) {
            const data = localStorage.getItem(`portfolio${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`);
            return data ? JSON.parse(data) : this.getDefaultData(dataType);
        }
        
        // Return all data from localStorage
        return {
            projects: JSON.parse(localStorage.getItem('portfolioProjects') || '[]'),
            skills: JSON.parse(localStorage.getItem('portfolioSkills') || '[]'),
            about: JSON.parse(localStorage.getItem('portfolioAbout') || '{}'),
            settings: JSON.parse(localStorage.getItem('portfolioSettings') || '{}'),
            lastUpdated: new Date().toISOString()
        };
    }

    getDefaultData(dataType) {
        switch(dataType) {
            case 'projects':
                return [
                    {
                        id: 1,
                        title: "E-Commerce Platform",
                        description: "A modern e-commerce platform built with React and Node.js",
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
                return {};
        }
    }

    // Alternative: Use GitHub Gist for free storage
    async saveToGist(dataType, data) {
        try {
            const gistId = localStorage.getItem('portfolioGistId');
            const token = localStorage.getItem('github_token');
            
            if (!token) {
                console.log('⚠️ No GitHub token for Gist storage');
                return false;
            }

            const gistData = {
                description: `Portfolio ${dataType} data`,
                public: false,
                files: {
                    [`${dataType}.json`]: {
                        content: JSON.stringify(data, null, 2)
                    }
                }
            };

            const url = gistId 
                ? `https://api.github.com/gists/${gistId}`
                : 'https://api.github.com/gists';

            const method = gistId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gistData)
            });

            if (response.ok) {
                const result = await response.json();
                if (!gistId) {
                    localStorage.setItem('portfolioGistId', result.id);
                }
                console.log(`✅ ${dataType} saved to GitHub Gist:`, result.id);
                return result;
            } else {
                throw new Error(`Gist save failed: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Error saving ${dataType} to Gist:`, error);
            return false;
        }
    }

    async loadFromGist(dataType) {
        try {
            const gistId = localStorage.getItem('portfolioGistId');
            const token = localStorage.getItem('github_token');
            
            if (!gistId || !token) {
                console.log('⚠️ No Gist ID or GitHub token');
                return null;
            }

            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    'Authorization': `token ${token}`
                }
            });

            if (response.ok) {
                const gist = await response.json();
                const fileContent = gist.files[`${dataType}.json`];
                if (fileContent) {
                    return JSON.parse(fileContent.content);
                }
            }
            
            return null;
        } catch (error) {
            console.log(`❌ Error loading ${dataType} from Gist:`, error);
            return null;
        }
    }

    // Main save method that tries multiple storage options
    async save(dataType, data) {
        console.log(`☁️ Attempting to save ${dataType} to multiple storage options...`);
        
        // Try cloud storage first
        try {
            await this.saveData(dataType, data);
            console.log(`✅ ${dataType} saved to cloud storage`);
        } catch (error) {
            console.log(`⚠️ Cloud storage failed, trying GitHub Gist...`);
            
            // Try GitHub Gist
            const gistResult = await this.saveToGist(dataType, data);
            if (gistResult) {
                console.log(`✅ ${dataType} saved to GitHub Gist`);
            } else {
                console.log(`⚠️ All cloud storage failed, using localStorage only`);
            }
        }
        
        // Always save to localStorage as backup
        this.saveToLocalStorage(dataType, data);
    }

    // Main load method that tries multiple storage options
    async load(dataType) {
        console.log(`☁️ Loading ${dataType} from storage options...`);
        
        // Try cloud storage first
        try {
            const data = await this.loadDataType(dataType);
            if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
                console.log(`✅ ${dataType} loaded from cloud storage`);
                return data;
            }
        } catch (error) {
            console.log(`⚠️ Cloud storage failed, trying GitHub Gist...`);
        }
        
        // Try GitHub Gist
        try {
            const gistData = await this.loadFromGist(dataType);
            if (gistData) {
                console.log(`✅ ${dataType} loaded from GitHub Gist`);
                return gistData;
            }
        } catch (error) {
            console.log(`⚠️ GitHub Gist failed, using localStorage...`);
        }
        
        // Fallback to localStorage
        const localData = this.getFromLocalStorage(dataType);
        console.log(`💾 ${dataType} loaded from localStorage`);
        return localData;
    }
}

// Initialize cloud storage
window.cloudStorage = new CloudStorage();

// Export for admin panel
window.saveToCloud = (dataType, data) => {
    if (window.cloudStorage) {
        return window.cloudStorage.save(dataType, data);
    }
};

window.loadFromCloud = (dataType) => {
    if (window.cloudStorage) {
        return window.cloudStorage.load(dataType);
    }
};
