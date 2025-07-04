// Mobile menu functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchIcon = document.querySelector('.search-icon');

searchInput.addEventListener('focus', () => {
    searchInput.style.width = '220px';
});

searchInput.addEventListener('blur', () => {
    if (searchInput.value === '') {
        searchInput.style.width = '180px';
    }
});

// Product card interactions
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Color dot interactions
const colorDots = document.querySelectorAll('.color-dot');

colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove active class from siblings
        const siblings = dot.parentNode.querySelectorAll('.color-dot');
        siblings.forEach(sibling => sibling.classList.remove('active'));
        
        // Add active class to clicked dot
        dot.classList.add('active');
        
        // Update product image (simulated)
        const productCard = dot.closest('.product-card');
        const productImage = productCard.querySelector('.product-image img');
        
        // Simulate color change with opacity animation
        productImage.style.opacity = '0.7';
        setTimeout(() => {
            productImage.style.opacity = '1';
        }, 150);
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
const newsletterInput = document.querySelector('.newsletter-input');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = newsletterInput.value.trim();
    
    if (email && isValidEmail(email)) {
        // Simulate successful subscription
        showNotification('Thank you for subscribing!', 'success');
        newsletterInput.value = '';
    } else {
        showNotification('Please enter a valid email address.', 'error');
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll('.product-card, .category-card, .section-title');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Header scroll effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Quick shop functionality
const quickShopButtons = document.querySelectorAll('.product-overlay .btn');

quickShopButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        
        // Simulate quick shop action
        button.textContent = 'Added!';
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = 'Quick Shop';
            button.style.background = '#111';
        }, 2000);
        
        showNotification(`${productName} added to cart!`, 'success');
    });
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Add lazy loading to images
const images = document.querySelectorAll('img');
images.forEach(img => {
    imageObserver.observe(img);
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(() => {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Nike clone website loaded successfully!');
    
    // Add any initialization code here
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.animation = 'fadeInUp 1s ease-out';
    }
});