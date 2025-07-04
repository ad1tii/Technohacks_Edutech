class ProductCard {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.addToCartBtn = document.getElementById('add-to-cart');
    this.productCard = document.querySelector('.product-card');
    
    this.init();
  }
  
  init() {
    this.setupTheme();
    this.setupEventListeners();
    this.detectSystemPreference();
  }
  
  setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemPreference;
    
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  detectSystemPreference() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
      }
    });
  }
  
  setupEventListeners() {
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.addToCartBtn.addEventListener('click', () => this.addToCart());
    
    // Add keyboard accessibility
    this.themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
    
    this.addToCartBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.addToCart();
      }
    });
  }
  
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add bounce animation to theme toggle
    this.themeToggle.classList.add('bounce');
    setTimeout(() => {
      this.themeToggle.classList.remove('bounce');
    }, 600);
  }
  
  async addToCart() {
    if (this.addToCartBtn.classList.contains('loading')) {
      return;
    }
    
    // Add loading state
    this.addToCartBtn.classList.add('loading');
    this.addToCartBtn.disabled = true;
    
    try {
      // Simulate API call
      await this.simulateAddToCart();
      
      // Success state
      this.addToCartBtn.classList.remove('loading');
      this.addToCartBtn.classList.add('success');
      this.addToCartBtn.innerHTML = `
        <svg class="cart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
        <span class="btn-text">Added to Cart!</span>
      `;
      
      // Add card bounce animation
      this.productCard.classList.add('bounce');
      
      // Reset button after 2 seconds
      setTimeout(() => {
        this.resetButton();
      }, 2000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.addToCartBtn.classList.remove('loading');
      this.addToCartBtn.disabled = false;
    }
  }
  
  simulateAddToCart() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }
  
  resetButton() {
    this.addToCartBtn.classList.remove('success');
    this.addToCartBtn.disabled = false;
    this.addToCartBtn.innerHTML = `
      <svg class="cart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4.01"></path>
      </svg>
      <span class="btn-text">Add to Cart</span>
    `;
    
    this.productCard.classList.remove('bounce');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProductCard();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Refresh theme on page focus
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }
});

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Any responsive adjustments can go here
    document.body.style.minHeight = window.innerHeight + 'px';
  }, 250);
});