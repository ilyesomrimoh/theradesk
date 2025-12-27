document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // For stagger items, add delays
            const staggerItems = entry.target.querySelectorAll('.stagger-item');
            staggerItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, index * 100);
            });
        }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.scroll-animate, .fade-in, .slide-left, .slide-right, .scale-up'
    );
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu after clicking a link
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
            }
        }
        });
    });
    
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
        const isClickInside = hamburger.contains(event.target) || navMenu.contains(event.target);
        if (!isClickInside && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
        });
    }

    // FAQ Accordion functionality
    const accordionHeaders = document.querySelectorAll(
        ".faq-accordion-header"
    );

    accordionHeaders.forEach((header) => {
        header.addEventListener("click", function () {
        const item = this.parentElement;
        const isActive = item.classList.contains("active");

        // Close all items
        document.querySelectorAll(".faq-accordion-item").forEach((i) => {
            i.classList.remove("active");
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add("active");
        }
        });
    });

    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // Remove active class from all buttons and panes
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        this.classList.add('active');
        document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });

    // Service Image Swap Functionality
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceImages = document.querySelectorAll('.service-image');

    if(serviceItems.length > 0 && serviceImages.length > 0) {
        // Use a separate observer for service item visibility
        const serviceObserverOptions = {
            threshold: 0.5, // Trigger when 50% of the item is visible
            rootMargin: "0px 0px -20% 0px" 
        };

        const serviceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const serviceId = entry.target.getAttribute('data-service');
                    
                    // Activate corresponding image
                    serviceImages.forEach(img => {
                        if(img.getAttribute('data-service') === serviceId) {
                            img.classList.add('active');
                        } else {
                            img.classList.remove('active');
                        }
                    });
                }
            });
        }, serviceObserverOptions);

        serviceItems.forEach(item => serviceObserver.observe(item));
    }

    // Pricing Toggle Functionality
    const pricingToggleBtns = document.querySelectorAll('.pricing-toggle .toggle-btn');
    const starterPrice = document.querySelector('.pricing-card:nth-child(1) .amount');
    const expertPrice = document.querySelector('.pricing-card:nth-child(2) .amount');
    
    // Original prices
    const prices = {
        monthly: { starter: '$40', expert: '$50' },
        yearly: { starter: '$32', expert: '$40' } // 20% discount
    };

    pricingToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            pricingToggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const isYearly = this.id === 'yearlyBtn';
            if (isYearly) {
                starterPrice.textContent = prices.yearly.starter;
                expertPrice.textContent = prices.yearly.expert;
            } else {
                starterPrice.textContent = prices.monthly.starter;
                expertPrice.textContent = prices.monthly.expert;
            }
        });
    });

    // Pricing Sliders Functionality
    const pricingRanges = document.querySelectorAll('.pricing-range');
    
    function updateSlider(range) {
        // Update value text
        const group = range.closest('.slider-group');
        const valueDisplay = group.querySelector('.slider-value p') || group.querySelector('.slider-value');
        if (valueDisplay) {
            let unit = '';
            // Check original text to decide unit, or check slider max
            // Simple heuristic based on max value or context
            if (range.max == "120") unit = ' séances';
            else if (range.max == "30") unit = ' heures';
            
            // Handle specific HTML structure (img + p or just text)
            if (valueDisplay.tagName === 'DIV') {
                 // It has an image and text, simpler to just find the text node or p
                 const p = valueDisplay.querySelector('p');
                 if(p) p.textContent = range.value + unit;
                 else valueDisplay.childNodes[1].textContent = " " + range.value + unit; // Fallback for text node
            } else if (valueDisplay.tagName === 'P') {
                 valueDisplay.textContent = range.value + unit;
            }
        }

        // Update background gradient for fill effect
        const min = range.min ? range.min : 0;
        const max = range.max ? range.max : 100;
        const val = range.value;
        const percentage = ((val - min) / (max - min)) * 100;
        
        range.style.backgroundImage = 'linear-gradient(90deg, #7BB3DF 0%, #5C97D5 100%)';
        range.style.backgroundSize = `${percentage}% 100%`;
        range.style.backgroundRepeat = 'no-repeat';
    }

    pricingRanges.forEach(range => {
        // Initialize
        updateSlider(range);

        range.addEventListener('input', function() {
            updateSlider(this);
        });
    });
});

