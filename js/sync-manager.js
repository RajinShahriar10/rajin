// Real-time Cross-Device Sync Manager
class SyncManager {
    constructor() {
        this.syncInterval = null;
        this.lastSyncTime = localStorage.getItem('lastSyncTime') || 0;
        this.init();
    }

    init() {
        console.log('🔄 Sync Manager initialized');
        this.startAutoSync();
        this.setupVisibilityListener();
    }

    startAutoSync() {
        // Check for updates every 30 seconds
        this.syncInterval = setInterval(() => {
            this.checkForUpdates();
        }, 30000);

        // Also check immediately on load
        setTimeout(() => this.checkForUpdates(), 1000);
    }

    setupVisibilityListener() {
        // Check for updates when tab becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkForUpdates();
            }
        });
    }

    async checkForUpdates() {
        try {
            console.log('🔍 Checking for project updates...');
            
            // Check if admin panel was used recently
            const adminUpdateTime = localStorage.getItem('adminUpdateTime');
            if (adminUpdateTime && adminUpdateTime > this.lastSyncTime) {
                console.log('📝 Admin panel updated, refreshing projects...');
                await this.refreshProjects();
                this.lastSyncTime = Date.now();
                localStorage.setItem('lastSyncTime', this.lastSyncTime);
            }

            // Also check GitHub for remote updates
            await this.checkGitHubUpdates();
            
        } catch (error) {
            console.log('❌ Error checking for updates:', error);
        }
    }

    async checkGitHubUpdates() {
        try {
            // Get the last commit info
            const response = await fetch('https://api.github.com/repos/RajinShahriar10/rajin/commits/main');
            if (response.ok) {
                const commits = await response.json();
                const lastCommit = commits[0];
                const commitTime = new Date(lastCommit.commit.committer.date).getTime();
                
                if (commitTime > this.lastSyncTime) {
                    console.log('🌐 New GitHub commit detected, refreshing...');
                    await this.refreshProjects();
                    this.lastSyncTime = Date.now();
                    localStorage.setItem('lastSyncTime', this.lastSyncTime);
                }
            }
        } catch (error) {
            console.log('⚠️ Could not check GitHub updates:', error);
        }
    }

    async refreshProjects() {
        try {
            console.log('🔄 Refreshing projects from latest data...');
            
            // Force reload carousel projects
            if (window.carousel) {
                await window.carousel.loadProjects();
                console.log('✅ Projects refreshed successfully');
            }

            // Also refresh other components if they exist
            if (window.skillsManager) {
                await window.skillsManager.loadSkills();
            }

            if (window.aboutManager) {
                await window.aboutManager.loadAboutData();
            }

            // Show update notification
            this.showUpdateNotification();
            
        } catch (error) {
            console.log('❌ Error refreshing projects:', error);
        }
    }

    showUpdateNotification() {
        // Create a subtle notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = '✅ Content updated from latest changes';
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Call this when admin makes changes
    notifyUpdate() {
        console.log('📢 Admin update notification received');
        const now = Date.now();
        localStorage.setItem('adminUpdateTime', now);
        this.lastSyncTime = now;
        this.checkForUpdates();
    }

    destroy() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize sync manager
window.syncManager = new SyncManager();

// Export for admin panel
window.notifyContentUpdate = () => {
    if (window.syncManager) {
        window.syncManager.notifyUpdate();
    }
};
