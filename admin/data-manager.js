// Data Manager - Handles saving/loading data to GitHub for persistence
class DataManager {
    constructor() {
        this.githubToken = null;
        this.repo = 'RajinShahriar10/rajin';
        this.branch = 'main';
        this.init();
    }

    init() {
        // Try to get GitHub token from localStorage or prompt user
        this.githubToken = localStorage.getItem('github_token') || this.promptForToken();
    }

    promptForToken() {
        const token = prompt('Please enter your GitHub Personal Access Token:\n\n' +
            '1. Go to GitHub → Settings → Developer settings → Personal access tokens\n' +
            '2. Generate new token (classic) with repo permissions\n' +
            '3. Copy and paste the token here\n\n' +
            'This token will be stored locally for future use.');
        
        if (token) {
            localStorage.setItem('github_token', token);
            return token;
        }
        return null;
    }

    async saveData(dataType, data) {
        if (!this.githubToken) {
            throw new Error('GitHub token required');
        }

        const filePath = `content/${dataType}/${dataType}.json`;
        const content = JSON.stringify(data, null, 2);
        
        try {
            // Get current file info
            const currentFile = await this.getFile(filePath);
            const sha = currentFile ? currentFile.sha : null;
            
            // Update or create file
            const response = await fetch(`https://api.github.com/repos/${this.repo}/contents/${filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Update ${dataType} data via admin panel`,
                    content: btoa(unescape(encodeURIComponent(content))),
                    sha: sha,
                    branch: this.branch
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`GitHub API Error: ${error.message}`);
            }

            const result = await response.json();
            console.log(`✅ ${dataType} saved to GitHub:`, result);
            
            // Also save to localStorage as backup
            localStorage.setItem(`portfolio${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`, JSON.stringify(data));
            
            return result;
        } catch (error) {
            console.error(`❌ Failed to save ${dataType}:`, error);
            throw error;
        }
    }

    async loadData(dataType) {
        // First try localStorage for immediate loading
        const localData = localStorage.getItem(`portfolio${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`);
        if (localData) {
            console.log(`📦 Loaded ${dataType} from localStorage`);
            return JSON.parse(localData);
        }

        // Then try GitHub
        if (!this.githubToken) {
            console.log(`⚠️ No GitHub token, using fallback data`);
            return this.getFallbackData(dataType);
        }

        try {
            const file = await this.getFile(`content/${dataType}/${dataType}.json`);
            if (file) {
                const content = atob(file.content);
                const data = JSON.parse(content);
                console.log(`📁 Loaded ${dataType} from GitHub`);
                
                // Cache in localStorage
                localStorage.setItem(`portfolio${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`, JSON.stringify(data));
                
                return data;
            }
        } catch (error) {
            console.log(`⚠️ GitHub load failed for ${dataType}:`, error);
        }

        // Fallback to sample data
        return this.getFallbackData(dataType);
    }

    async getFile(filePath) {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.repo}/contents/${filePath}?ref=${this.branch}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                }
            });

            if (response.ok) {
                return await response.json();
            } else if (response.status === 404) {
                return null; // File doesn't exist
            } else {
                throw new Error(`GitHub API Error: ${response.statusText}`);
            }
        } catch (error) {
            console.error('GitHub API fetch error:', error);
            return null;
        }
    }

    getFallbackData(dataType) {
        if (dataType === 'projects') {
            return [
                {
                    id: 1,
                    title: "E-Commerce Platform",
                    description: "A modern e-commerce platform built with React and Node.js, featuring real-time inventory management, secure payment processing, and responsive design.",
                    image: "https://via.placeholder.com/400x200/667eea/ffffff?text=E-Commerce",
                    technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT", "Tailwind CSS"],
                    liveUrl: "https://example-ecommerce.com",
                    githubUrl: "https://github.com/example/ecommerce"
                },
                {
                    id: 2,
                    title: "Task Management App",
                    description: "Collaborative task management application with drag-and-drop functionality, real-time updates, and team collaboration features.",
                    image: "https://via.placeholder.com/400x200/22c55e/ffffff?text=Task+App",
                    technologies: ["Vue.js", "Firebase", "Tailwind CSS", "Vuex", "Socket.io"],
                    liveUrl: "https://example-tasks.com",
                    githubUrl: "https://github.com/example/tasks"
                }
            ];
        } else if (dataType === 'skills') {
            return [
                {
                    id: 1,
                    name: "JavaScript",
                    icon: "fab fa-js",
                    level: 88,
                    color: "#F7DF1E",
                    category: "Frontend"
                },
                {
                    id: 2,
                    name: "React",
                    icon: "fab fa-react",
                    level: 85,
                    color: "#61DAFB",
                    category: "Frontend"
                },
                {
                    id: 3,
                    name: "Node.js",
                    icon: "fab fa-node-js",
                    level: 82,
                    color: "#339933",
                    category: "Backend"
                }
            ];
        } else if (dataType === 'settings') {
            return {
                siteTitle: "Web Developer Portfolio",
                siteDescription: "Professional web developer portfolio showcasing modern web development projects",
                authorName: "Web Developer",
                email: "hello@example.com",
                phone: "+1 (555) 123-4567",
                location: "San Francisco, CA"
            };
        }
        return [];
    }

    async uploadImage(file) {
        // For now, return a data URL (in production, use GitHub releases or image hosting)
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }
}

// Export for use in dashboard
window.DataManager = DataManager;
