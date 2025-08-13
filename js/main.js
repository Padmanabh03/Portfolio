// Main JavaScript for Computer Vision Portfolio
class PortfolioApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.initNavigation();
        this.initSmoothScrolling();
        this.initMobileMenu();
        this.initSkillInteractions();
        this.initProjectFilters();
        this.initContactForm();
        this.initPerformanceOptimizations();
    }
    
    // Navigation functionality
    initNavigation() {
        const nav = document.querySelector('.nav');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-70px 0px -70px 0px'
        };
        
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navLink = document.querySelector(`[href="#${entry.target.id}"]`);
                
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        }, observerOptions);
        
        sections.forEach(section => navObserver.observe(section));
        
        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed nav
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Mobile menu functionality
    initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }
    
    // Skill interactions and animations
    initSkillInteractions() {
        const neurons = document.querySelectorAll('.neuron');
        
        neurons.forEach(neuron => {
            neuron.addEventListener('mouseenter', () => {
                const skillName = neuron.dataset.skill;
                const activationLevel = neuron.querySelector('.activation-level');
                
                // Show activation level
                if (activationLevel) {
                    activationLevel.textContent = activationLevel.dataset.level + '%';
                }
                
                // Highlight connected neurons
                this.highlightConnectedNeurons(neuron);
                
                // Show skill description tooltip
                this.showSkillTooltip(neuron, skillName);
            });
            
            neuron.addEventListener('mouseleave', () => {
                this.hideSkillTooltip();
                this.clearNeuronHighlights();
            });
        });
    }
    
    highlightConnectedNeurons(activeNeuron) {
        const connections = document.querySelectorAll('.connection-line');
        connections.forEach(connection => {
            connection.style.stroke = '#64ffda';
            connection.style.opacity = '0.6';
        });
    }
    
    clearNeuronHighlights() {
        const connections = document.querySelectorAll('.connection-line');
        connections.forEach(connection => {
            connection.style.stroke = '#0f4c75';
            connection.style.opacity = '0.3';
        });
    }
    
    showSkillTooltip(neuron, skillName) {
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.innerHTML = this.getSkillDescription(skillName);
        
        const rect = neuron.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.right + 10 + 'px';
        tooltip.style.top = rect.top + 'px';
        tooltip.style.background = 'var(--processing-blue)';
        tooltip.style.color = 'var(--output-white)';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '0.9rem';
        tooltip.style.maxWidth = '200px';
        tooltip.style.zIndex = '1000';
        tooltip.style.border = '1px solid var(--accent-green)';
        
        document.body.appendChild(tooltip);
    }
    
    hideSkillTooltip() {
        const tooltip = document.querySelector('.skill-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    getSkillDescription(skillName) {
        const descriptions = {
            'Python': 'Primary language for ML/AI development, data analysis, and computer vision applications.',
            'PyTorch': 'Deep learning framework used for neural network development and research.',
            'TensorFlow': 'End-to-end ML platform for building and deploying models at scale.',
            'OpenCV': 'Computer vision library for image processing and analysis.',
            'TensorRT': 'High-performance inference optimizer for deep learning models.',
            'YOLOv8': 'State-of-the-art object detection architecture.',
            'MONAI': 'Medical imaging framework for healthcare AI applications.',
            'C++': 'High-performance computing for optimized CV algorithms.',
            'JavaScript': 'Full-stack development and web-based ML applications.',
            'AWS': 'Cloud computing platform for scalable ML deployments.',
            'Docker': 'Containerization for reproducible ML environments.',
            'Git': 'Version control for collaborative development.'
        };
        
        return descriptions[skillName] || 'Advanced proficiency in ' + skillName;
    }
    
    // Project filtering and interactions
    initProjectFilters() {
        const projectCards = document.querySelectorAll('.project-card');
        
        // Add hover effects for project cards
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateProjectCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateProjectCard(card, 'leave');
            });
        });
        
        // Project category filtering (if needed)
        const categories = ['all', '3d-vision', 'medical', 'industrial'];
        this.createProjectFilters(categories);
    }
    
    animateProjectCard(card, action) {
        const metrics = card.querySelectorAll('.metric-value');
        
        if (action === 'enter') {
            // Animate metrics on hover
            metrics.forEach((metric, index) => {
                setTimeout(() => {
                    metric.style.color = 'var(--activation-orange)';
                    metric.style.transform = 'scale(1.1)';
                }, index * 100);
            });
            
            // Add processing effect
            this.addProcessingEffect(card);
        } else {
            metrics.forEach(metric => {
                metric.style.color = 'var(--accent-green)';
                metric.style.transform = 'scale(1)';
            });
            
            this.removeProcessingEffect(card);
        }
    }
    
    addProcessingEffect(card) {
        const processingBar = document.createElement('div');
        processingBar.className = 'processing-indicator';
        processingBar.innerHTML = '<div class="processing-fill"></div>';
        processingBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255,255,255,0.1);
            overflow: hidden;
        `;
        
        const fill = processingBar.querySelector('.processing-fill');
        fill.style.cssText = `
            width: 0;
            height: 100%;
            background: linear-gradient(90deg, var(--accent-green), var(--activation-orange));
            animation: loadingBar 1s ease-in-out;
        `;
        
        card.style.position = 'relative';
        card.appendChild(processingBar);
    }
    
    removeProcessingEffect(card) {
        const indicator = card.querySelector('.processing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    createProjectFilters(categories) {
        // This could be expanded for project filtering functionality
        // For now, we'll just add the structure
        console.log('Project filters initialized for categories:', categories);
    }
    
    // Contact form functionality
    initContactForm() {
        const contactMethods = document.querySelectorAll('.contact-method');
        
        contactMethods.forEach(method => {
            method.addEventListener('click', (e) => {
                // Add click animation
                method.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    method.style.transform = 'scale(1)';
                }, 150);
                
                // Track contact method usage
                const methodType = method.querySelector('.method-label').textContent;
                this.trackContactInteraction(methodType);
            });
        });
    }
    
    trackContactInteraction(methodType) {
        // Analytics tracking (placeholder)
        console.log(`Contact method used: ${methodType}`);
    }
    
    // Performance optimizations
    initPerformanceOptimizations() {
        // Lazy loading for images
        this.initLazyLoading();
        
        // Debounced resize handler
        const debouncedResize = this.debounce(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', debouncedResize);
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Optimize animations for performance
        this.optimizeAnimations();
    }
    
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    handleResize() {
        // Recalculate neural network connections
        if (window.cvPipeline) {
            window.cvPipeline.initNeuralNetworkConnections();
        }
        
        // Adjust particle system
        if (window.pointCloudSystem) {
            window.pointCloudSystem.resize();
        }
    }
    
    preloadCriticalResources() {
        // Preload fonts
        const fonts = [
            'JetBrains Mono',
            'Space Grotesk'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-animations');
        }
        
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('paused-animations');
            } else {
                document.body.classList.remove('paused-animations');
            }
        });
    }
    
    // Utility functions
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
}

// Global utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Store reference for global access
    window.portfolioApp = app;
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Handle page load performance
window.addEventListener('load', () => {
    // Hide loading indicators
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => el.style.display = 'none');
    
    // Start performance monitoring
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
    // Could send to analytics service
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, scrollToSection };
}
