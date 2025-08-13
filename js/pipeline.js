// Computer Vision Pipeline Animations
class CVPipelineAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.initScrollAnimations();
        this.initNeuralNetworkConnections();
        this.initAttentionMaps();
        this.initFeatureDetection();
        this.initTerminalAnimation();
    }
    
    // Scroll-triggered animations using Intersection Observer
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Trigger specific animations based on section
                    const sectionId = entry.target.id;
                    switch(sectionId) {
                        case 'skills':
                            this.animateNeuralNetwork();
                            break;
                        case 'projects':
                            this.animateProjectCards();
                            break;
                        case 'contact':
                            this.animateTerminal();
                            break;
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections and animated elements
        document.querySelectorAll('section, .animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Neural Network Connection Lines
    initNeuralNetworkConnections() {
        const svg = document.querySelector('.connections-svg');
        if (!svg) return;
        
        const drawConnections = () => {
            const layers = document.querySelectorAll('.network-layer');
            if (layers.length < 2) return;
            
            svg.innerHTML = ''; // Clear existing connections
            
            // Get neuron positions
            const getNeuronPositions = (layer) => {
                const neurons = layer.querySelectorAll('.neuron');
                const positions = [];
                
                neurons.forEach(neuron => {
                    const rect = neuron.getBoundingClientRect();
                    const svgRect = svg.getBoundingClientRect();
                    positions.push({
                        x: rect.left + rect.width / 2 - svgRect.left,
                        y: rect.top + rect.height / 2 - svgRect.top
                    });
                });
                
                return positions;
            };
            
            // Draw connections between layers
            for (let i = 0; i < layers.length - 1; i++) {
                const currentPositions = getNeuronPositions(layers[i]);
                const nextPositions = getNeuronPositions(layers[i + 1]);
                
                currentPositions.forEach((startPos, startIdx) => {
                    nextPositions.forEach((endPos, endIdx) => {
                        // Create connection line
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', startPos.x);
                        line.setAttribute('y1', startPos.y);
                        line.setAttribute('x2', endPos.x);
                        line.setAttribute('y2', endPos.y);
                        line.setAttribute('stroke', '#64ffda');
                        line.setAttribute('stroke-width', '1');
                        line.setAttribute('opacity', '0.4');
                        line.classList.add('connection-line');
                        
                        // Add animation delay
                        const delay = (startIdx + endIdx) * 0.1;
                        line.style.animationDelay = `${delay}s`;
                        
                        svg.appendChild(line);
                    });
                });
            }
        };
        
        // Draw connections after layout is complete
        setTimeout(drawConnections, 100);
        window.addEventListener('resize', () => setTimeout(drawConnections, 100));
    }
    
    // Animate neural network on scroll
    animateNeuralNetwork() {
        const neurons = document.querySelectorAll('.neuron');
        const connections = document.querySelectorAll('.connection-line');
        
        // Animate neurons
        neurons.forEach((neuron, index) => {
            setTimeout(() => {
                neuron.style.transform = 'scale(1.1)';
                neuron.style.transition = 'transform 0.3s ease';
                
                setTimeout(() => {
                    neuron.style.transform = 'scale(1)';
                }, 300);
            }, index * 100);
        });
        
        // Animate connections
        connections.forEach((connection, index) => {
            setTimeout(() => {
                connection.style.stroke = '#64ffda';
                connection.style.opacity = '0.8';
                connection.style.strokeWidth = '1';
                
                setTimeout(() => {
                    connection.style.stroke = '#0f4c75';
                    connection.style.opacity = '0.3';
                    connection.style.strokeWidth = '0.5';
                }, 500);
            }, index * 50);
        });
    }
    
    // Attention Maps - Mouse following effect
    initAttentionMaps() {
        const attentionMap = document.createElement('div');
        attentionMap.className = 'attention-map';
        document.body.appendChild(attentionMap);
        
        let mouseX = 0, mouseY = 0;
        let isVisible = false;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Show attention map on interactive elements
            const target = e.target;
            const isInteractive = target.matches('.neuron, .project-card, .contact-method, .nav-link');
            
            if (isInteractive && !isVisible) {
                attentionMap.style.left = mouseX + 'px';
                attentionMap.style.top = mouseY + 'px';
                attentionMap.classList.add('active');
                isVisible = true;
            } else if (!isInteractive && isVisible) {
                attentionMap.classList.remove('active');
                isVisible = false;
            }
            
            if (isVisible) {
                attentionMap.style.left = mouseX + 'px';
                attentionMap.style.top = mouseY + 'px';
            }
        });
    }
    
    // Feature Detection Points Animation
    initFeatureDetection() {
        const imageContainer = document.querySelector('.image-container');
        if (!imageContainer) return;
        
        const createFeaturePoint = (x, y) => {
            const point = document.createElement('div');
            point.className = 'feature-point';
            point.style.left = x + '%';
            point.style.top = y + '%';
            return point;
        };
        
        // Add feature points to image
        const featurePoints = [
            { x: 20, y: 25 },
            { x: 75, y: 30 },
            { x: 45, y: 60 },
            { x: 80, y: 70 },
            { x: 15, y: 80 }
        ];
        
        featurePoints.forEach((point, index) => {
            setTimeout(() => {
                const featurePoint = createFeaturePoint(point.x, point.y);
                imageContainer.appendChild(featurePoint);
            }, index * 500);
        });
    }
    
    // Terminal Animation
    initTerminalAnimation() {
        const terminalLines = document.querySelectorAll('.terminal-line');
        
        terminalLines.forEach((line, index) => {
            const command = line.querySelector('.command');
            if (command) {
                this.typewriterEffect(command, command.textContent, index * 1000);
            }
        });
    }
    
    animateTerminal() {
        const terminal = document.querySelector('.contact-terminal');
        if (!terminal) return;
        
        terminal.style.transform = 'scale(1.02)';
        terminal.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            terminal.style.transform = 'scale(1)';
        }, 300);
        
        // Add blinking cursor effect
        const commands = terminal.querySelectorAll('.command');
        commands.forEach(command => {
            command.style.borderRight = '2px solid #64ffda';
            command.style.animation = 'typewriterCursor 1s infinite';
        });
    }
    
    // Typewriter Effect
    typewriterEffect(element, text, delay = 0) {
        element.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                element.textContent += text[i];
                i++;
                
                if (i >= text.length) {
                    clearInterval(timer);
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, 50);
        }, delay);
    }
    
    // Project Cards Animation
    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(100, 255, 218, 0.2)';
                
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = 'none';
                }, 500);
            }, index * 200);
        });
    }
    
    // Data Processing Animation
    createDataProcessingEffect(container) {
        const dataStreams = [];
        
        for (let i = 0; i < 5; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.left = (20 * i) + '%';
            stream.style.animationDelay = (i * 0.5) + 's';
            container.appendChild(stream);
            dataStreams.push(stream);
        }
        
        return dataStreams;
    }
    
    // Scan Line Effect
    createScanLineEffect() {
        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        document.body.appendChild(scanLine);
        
        return scanLine;
    }
    
    // Performance Metrics Animation
    animateMetrics() {
        const metrics = document.querySelectorAll('.metric-value');
        
        metrics.forEach(metric => {
            const finalValue = metric.textContent;
            const isNumeric = !isNaN(parseFloat(finalValue));
            
            if (isNumeric) {
                const targetValue = parseFloat(finalValue);
                let currentValue = 0;
                const increment = targetValue / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    
                    if (currentValue >= targetValue) {
                        currentValue = targetValue;
                        clearInterval(timer);
                    }
                    
                    metric.textContent = currentValue.toFixed(1) + (finalValue.includes('%') ? '%' : '');
                }, 50);
            }
        });
    }
    
    // Glitch Effect for Hover
    addGlitchEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'glitch 0.3s ease-in-out';
        });
        
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        });
    }
}

// Utility Functions
class CVUtils {
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    static debounce(func, wait) {
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
    
    static throttle(func, limit) {
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

// Initialize CV Pipeline Animations
document.addEventListener('DOMContentLoaded', () => {
    const cvPipeline = new CVPipelineAnimations();
    
    // Add scan line effect
    cvPipeline.createScanLineEffect();
    
    // Add glitch effects to interactive elements
    document.querySelectorAll('.project-title, .hero-name').forEach(element => {
        cvPipeline.addGlitchEffect(element);
    });
    
    // Animate metrics when they come into view
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cvPipeline.animateMetrics();
                metricsObserver.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.project-metrics').forEach(metrics => {
        metricsObserver.observe(metrics);
    });
    
    // Store reference for global access
    window.cvPipeline = cvPipeline;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CVPipelineAnimations, CVUtils };
}
