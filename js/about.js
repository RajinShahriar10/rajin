// About Me Section - Load data from admin localStorage
document.addEventListener('DOMContentLoaded', function() {
    loadAboutData();
});

function loadAboutData() {
    try {
        // Load about data from localStorage (saved by admin panel)
        const aboutData = JSON.parse(localStorage.getItem('portfolioAbout'));
        
        if (aboutData) {
            console.log('✅ Loading About data from admin:', aboutData);
            
            // Update profile image
            const profileImg = document.getElementById('aboutProfileImg');
            if (profileImg && aboutData.image) {
                profileImg.src = aboutData.image;
            }
            
            // Update overlay text
            const overlayName = document.getElementById('aboutOverlayName');
            const overlayTitle = document.getElementById('aboutOverlayTitle');
            if (overlayName && aboutData.name) {
                overlayName.textContent = aboutData.name;
            }
            if (overlayTitle) {
                overlayTitle.textContent = 'Full Stack Developer'; // Keep this static or make it configurable
            }
            
            // Update main name and tagline
            const displayName = document.getElementById('aboutDisplayName');
            const displayTagline = document.getElementById('aboutDisplayTagline');
            if (displayName && aboutData.name) {
                displayName.textContent = aboutData.name;
            }
            if (displayTagline && aboutData.tagline) {
                displayTagline.textContent = aboutData.tagline;
            }
            
            // Update info items
            const infoList = document.getElementById('aboutInfoList');
            if (infoList && aboutData.info && aboutData.info.length > 0) {
                infoList.innerHTML = '';
                aboutData.info.forEach(item => {
                    const infoItem = createInfoItem(item);
                    infoList.appendChild(infoItem);
                });
            }
            
            // Update page title if name is available
            if (aboutData.name) {
                document.title = `${aboutData.name} - Portfolio`;
            }
            
        } else {
            console.log('📦 No About data found, using default content');
        }
    } catch (error) {
        console.error('❌ Error loading About data:', error);
    }
}

function createInfoItem(item) {
    const infoItem = document.createElement('div');
    infoItem.className = 'info-item';
    
    const icon = document.createElement('i');
    icon.className = `fas ${item.icon}`;
    
    const content = document.createElement('div');
    content.className = 'info-content';
    
    const title = document.createElement('h4');
    title.textContent = item.title;
    
    const text = document.createElement('p');
    text.textContent = item.content;
    
    content.appendChild(title);
    content.appendChild(text);
    
    infoItem.appendChild(icon);
    infoItem.appendChild(content);
    
    return infoItem;
}
