// ===================================
// SMOOTH SCROLLING & PAGE INTERACTIONS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormHandlers();
    initializeClickHandlers();
    initializeFilterButtons();
    initializeTrendingCards();
    createHeroCanvasAnimation();
    addScrollToTopButton();
});

// ===================================
// CANVAS HERO ANIMATION
// ===================================

function createHeroCanvasAnimation() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = ['#ffd700', '#ffffff', '#667eea'][Math.floor(Math.random() * 3)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let particle of particles) {
            particle.update();
            particle.draw();
        }
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(255, 215, 0, ${0.2 * (1 - distance / 100)})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });
}

// ===================================
// FILTER BUTTONS
// ===================================

function initializeFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            blogCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===================================
// TRENDING CARDS
// ===================================

function initializeTrendingCards() {
    const trendingCards = document.querySelectorAll('.trending-card');
    
    trendingCards.forEach(card => {
        card.addEventListener('click', function() {
            const blogId = this.getAttribute('data-blog');
            window.location.href = `blog-detail.html?id=${blogId}`;
        });
    });
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            const element = document.querySelector(target);
            
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.style.display = 'none';
                }
            }
        });
    });

    // Mobile hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            if (navMenu.style.display === 'flex') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'flex';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.flexDirection = 'column';
                navMenu.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                navMenu.style.padding = '20px';
                navMenu.style.gap = '15px';
            }
        });
    }

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
        }
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = getAnimationForElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.blog-card, .category-card, .featured-blog').forEach(el => {
        observer.observe(el);
    });
}

function getAnimationForElement(element) {
    if (element.classList.contains('blog-card')) {
        return 'fadeInUp 0.6s ease-out forwards';
    }
    if (element.classList.contains('category-card')) {
        return 'fadeInUp 0.6s ease-out forwards';
    }
    return 'fadeInUp 0.8s ease-out forwards';
}

// ===================================
// FORM HANDLERS
// ===================================

function initializeFormHandlers() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (validateEmail(email)) {
                showNotification('Successfully subscribed to our newsletter!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.color = 'white';
    notification.style.fontWeight = '600';
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideInRight 0.3s ease-out';
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===================================
// CLICK HANDLERS
// ===================================

function initializeClickHandlers() {
    // CTA Button
    const ctaButton = document.querySelector('.cta-button.primary');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            document.getElementById('blogs').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const ctaButtonSecondary = document.querySelector('.cta-button.secondary');
    if (ctaButtonSecondary) {
        ctaButtonSecondary.addEventListener('click', function() {
            window.location.href = 'categories.html';
        });
    }

    // Blog card click handlers
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showNotification(`Opening: ${title}`, 'success');
            // Here you could navigate to a full article page
        });
    });

    // Read more links
    document.querySelectorAll('.read-more, .read-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Loading article...', 'success');
        });
    });

    // Category card click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            showNotification(`Viewing ${category}`, 'success');
        });
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Add scroll to top button functionality
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });

    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Initialize scroll to top button
addScrollToTopButton();

// ===================================
// ADD MISSING ANIMATIONS TO STYLESHEET
// ===================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    .scroll-to-top:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
`;
document.head.appendChild(style);

// ===================================
// DYNAMIC CONTENT LOADING SIMULATION
// ===================================

// Simulate lazy loading images
function lazyLoadImages() {
    const images = document.querySelectorAll('[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

lazyLoadImages();

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
    // Keyboard shortcuts
    if (e.key === '/') {
        e.preventDefault();
        document.querySelector('.newsletter-form input').focus();
    }
    
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        }
    }
});

console.log('TechVision AI Blog - Script loaded successfully! 🚀');
