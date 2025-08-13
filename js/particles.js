// Point Cloud Particle System for Computer Vision Theme
class PointCloudSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.config = {
            particleCount: 150,
            maxDistance: 120,
            particleSpeed: 0.5,
            mouseRadius: 150,
            colors: {
                particle: '#64ffda',
                connection: '#0f4c75',
                highlight: '#e94560'
            }
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                originalOpacity: Math.random() * 0.5 + 0.3,
                pulsePhase: Math.random() * Math.PI * 2,
                isHighlighted: false
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Update pulse animation
            particle.pulsePhase += 0.02;
            
            // Check mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseRadius) {
                particle.isHighlighted = true;
                particle.opacity = Math.min(1, particle.originalOpacity + 0.5);
                
                // Slight repulsion from mouse
                const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                particle.vx -= (dx / distance) * force * 0.01;
                particle.vy -= (dy / distance) * force * 0.01;
            } else {
                particle.isHighlighted = false;
                particle.opacity = particle.originalOpacity;
            }
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    drawConnections() {
        this.ctx.strokeStyle = this.config.colors.connection;
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    const opacity = (1 - distance / this.config.maxDistance) * 0.3;
                    
                    // Highlight connections near mouse
                    let connectionColor = this.config.colors.connection;
                    if (this.particles[i].isHighlighted || this.particles[j].isHighlighted) {
                        connectionColor = this.config.colors.highlight;
                    }
                    
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = connectionColor;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const pulseSize = particle.size + Math.sin(particle.pulsePhase) * 0.5;
            
            // Particle glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, pulseSize * 3
            );
            
            if (particle.isHighlighted) {
                gradient.addColorStop(0, this.config.colors.highlight);
                gradient.addColorStop(0.5, this.config.colors.particle + '80');
                gradient.addColorStop(1, 'transparent');
            } else {
                gradient.addColorStop(0, this.config.colors.particle);
                gradient.addColorStop(0.5, this.config.colors.particle + '40');
                gradient.addColorStop(1, 'transparent');
            }
            
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseSize * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core particle
            this.ctx.fillStyle = particle.isHighlighted ? 
                this.config.colors.highlight : 
                this.config.colors.particle;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    drawDataStreams() {
        // Add flowing data streams
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 5; i++) {
            const x = (this.canvas.width / 6) * (i + 1);
            const streamHeight = 30;
            const y = (Math.sin(time + i) * 50) + this.canvas.height / 2;
            
            const gradient = this.ctx.createLinearGradient(x, y - streamHeight, x, y + streamHeight);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.5, this.config.colors.particle + '60');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x - 1, y - streamHeight, 2, streamHeight * 2);
        }
    }
    
    drawScanLines() {
        const time = Date.now() * 0.002;
        const scanY = (Math.sin(time) * 0.5 + 0.5) * this.canvas.height;
        
        const gradient = this.ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, this.config.colors.particle + '40');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, scanY - 1, this.canvas.width, 2);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawDataStreams();
        this.drawScanLines();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resize);
    }
}

// Matrix Rain Effect
class MatrixRain {
    constructor(container) {
        this.container = container;
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.drops = [];
        this.init();
    }
    
    init() {
        this.createDrops();
        this.animate();
    }
    
    createDrops() {
        const dropCount = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < dropCount; i++) {
            this.drops.push({
                x: i * 20,
                y: Math.random() * -1000,
                speed: Math.random() * 2 + 1,
                chars: []
            });
        }
    }
    
    animate() {
        // Clear old characters
        const oldChars = this.container.querySelectorAll('.matrix-char');
        oldChars.forEach(char => {
            if (parseInt(char.style.top) > window.innerHeight) {
                char.remove();
            }
        });
        
        this.drops.forEach(drop => {
            if (Math.random() < 0.1) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = this.characters[Math.floor(Math.random() * this.characters.length)];
                char.style.left = drop.x + 'px';
                char.style.top = drop.y + 'px';
                char.style.animationDuration = (3 + Math.random() * 2) + 's';
                this.container.appendChild(char);
            }
            
            drop.y += drop.speed;
            
            if (drop.y > window.innerHeight + 100) {
                drop.y = Math.random() * -100;
            }
        });
        
        setTimeout(() => this.animate(), 100);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pointCloud');
    if (canvas) {
        const pointCloud = new PointCloudSystem(canvas);
        
        // Store reference for cleanup
        window.pointCloudSystem = pointCloud;
    }
    
    // Initialize matrix rain effect
    const matrixContainer = document.querySelector('.matrix-rain');
    if (matrixContainer) {
        new MatrixRain(matrixContainer);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.pointCloudSystem) {
        window.pointCloudSystem.destroy();
    }
});
