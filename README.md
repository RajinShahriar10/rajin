# Modern Portfolio Website

A professional, dark-themed portfolio website for web developers with a dynamic admin dashboard powered by Decap CMS.

## 🚀 Features

- **Dark Futuristic Theme**: Modern glassmorphism design with electric blue and neon purple gradients
- **Animated Hero Section**: Interactive tech background with particle effects and circuit patterns
- **Cinematic Carousel**: Infinite project carousel with smooth transitions and touch support
- **Dynamic Skills Section**: Circular progress loaders with viewport-triggered animations
- **Admin Dashboard**: Full content management with Decap CMS
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **SEO Optimized**: Meta tags, semantic HTML, and performance optimizations
- **100% Free Stack**: No paid services or region-restricted storage

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **CMS**: Decap CMS (Netlify CMS)
- **Hosting**: Netlify (Free)
- **Authentication**: Netlify Identity
- **Content Storage**: GitHub + Markdown/YAML
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)

## 📁 Project Structure

```
portfolio/
├── admin/                  # Admin dashboard
│   └── index.html         # Decap CMS configuration
├── assets/
│   └── images/            # Project images and media
├── content/
│   ├── projects/          # Project content
│   │   └── projects.json
│   ├── skills/            # Skills data
│   │   └── skills.json
│   └── settings/          # Site settings
│       ├── general.json
│       └── social.json
├── css/
│   ├── style.css          # Main styles
│   └── animations.css     # Animation classes
├── js/
│   ├── main.js            # Main functionality
│   ├── carousel.js        # Project carousel
│   ├── skills.js          # Skills animations
│   ├── animations.js      # Animation controller
│   └── contact.js         # Contact form handler
├── index.html             # Main page
├── netlify.toml           # Netlify configuration
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- GitHub account
- Netlify account
- Basic knowledge of Git

### Installation

1. **Clone or Fork the Repository**
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. **Set Up Netlify**
   - Go to [Netlify](https://netlify.com) and sign up
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the repository
   - Build settings will be auto-configured

3. **Configure Netlify Identity**
   - In Netlify dashboard, go to Site settings → Identity
   - Enable Identity service
   - Enable registration and invite-only (recommended)
   - Set your preferred authentication methods

4. **Update Admin Configuration**
   - Edit `admin/index.html`
   - Replace the following placeholders:
     - `your-username/your-repo` with your GitHub repository
     - `your-site.netlify.app` with your Netlify domain
     - Update the auth endpoint with your Netlify Identity URL

5. **Deploy the Site**
   - Commit and push your changes to GitHub
   - Netlify will automatically deploy your site
   - Visit `/admin` to access the dashboard

### Content Management

1. **Access Admin Panel**
   - Go to `https://your-site.netlify.app/admin`
   - Sign up or log in with Netlify Identity
   - Start managing your content

2. **Managing Projects**
   - Add new projects with images
   - Edit existing projects
   - Upload images via drag & drop
   - Set project order and featured status

3. **Managing Skills**
   - Add new skills with proficiency levels
   - Update skill icons and colors
   - Organize by categories

4. **Site Settings**
   - Update site title and description
   - Configure contact information
   - Set social media links

## 🎨 Customization

### Colors and Theme

Edit the CSS variables in `css/style.css`:

```css
:root {
    --bg-primary: #0a0a0a;           /* Main background */
    --bg-secondary: #1a1a1a;         /* Secondary background */
    --accent-blue: #667eea;          /* Primary accent */
    --accent-purple: #764ba2;        /* Secondary accent */
    --accent-cyan: #00d4ff;          /* Cyan highlights */
    /* ... more variables */
}
```

### Animations

- Modify animation speeds in `css/animations.css`
- Adjust intersection observer thresholds in `js/animations.js`
- Customize particle effects in `js/main.js`

### Content Structure

- Projects are stored in `content/projects/projects.json`
- Skills are stored in `content/skills/skills.json`
- Settings are in `content/settings/`

## 🔧 Advanced Configuration

### Custom Domains

1. In Netlify dashboard, go to Domain settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update `netlify.toml` with your domain

### Form Handling

The contact form includes a simulation for demo purposes. To enable real form submissions:

1. Use Netlify Forms (built-in)
2. Or integrate with services like Formspree, Getform, or EmailJS

### Analytics

Add your preferred analytics:

1. Google Analytics
2. Plausible Analytics
3. Fathom Analytics

## 📱 Mobile Optimization

The site is fully responsive with:

- Touch-friendly navigation
- Optimized carousel for mobile
- Responsive grid layouts
- Mobile-first approach

## 🚀 Performance

- Optimized images with lazy loading
- Minified CSS and JavaScript
- GPU-accelerated animations
- Efficient intersection observers
- Optimized for Core Web Vitals

## 🛡️ Security

- Content Security Policy headers
- XSS protection
- Secure authentication with Netlify Identity
- HTTPS enforcement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Netlify documentation](https://docs.netlify.com/)
2. Review [Decap CMS documentation](https://decapcms.org/docs/)
3. Open an issue in this repository

## 🌟 Features Showcase

### Hero Section
- Animated particle background
- Interactive mouse effects
- Smooth fade-in animations
- Gradient text effects

### Project Carousel
- Infinite loop behavior
- Touch and swipe support
- Keyboard navigation
- Smooth cinematic transitions
- Auto-play with pause on hover

### Skills Section
- Circular progress loaders
- Viewport-triggered animations
- Custom colors and icons
- Glow effects on completion

### Admin Dashboard
- Drag & drop image uploads
- Real-time content updates
- User-friendly interface
- Secure authentication

---

**Built with ❤️ using modern web technologies**
