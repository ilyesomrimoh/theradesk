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

    // Pricing Logic
    const pricingData = {
        starter: {
            sessions: {
                40: { monthly: 43.20, yearly: 36.00 },
                80: { monthly: 62.40, yearly: 52.00 },
                120: { monthly: 81.60, yearly: 68.00 }
            },
            visio: {
                0: { monthly: 0, yearly: 0 },
                10: { monthly: 15.12, yearly: 12.60 },
                20: { monthly: 30.24, yearly: 25.20 },
                50: { monthly: 75.60, yearly: 63.00 }
            }
        },
        expert: {
            sessions: {
                40: { monthly: 90.00, yearly: 75.00 },
                80: { monthly: 162.00, yearly: 135.00 },
                120: { monthly: 234.00, yearly: 195.00 }
            },
            visio: {
                0: { monthly: 0, yearly: 0 },
                10: { monthly: 20.16, yearly: 16.80 },
                20: { monthly: 40.32, yearly: 33.60 },
                50: { monthly: 100.80, yearly: 84.00 }
            }
        }
    };

    const visioMap = [0, 10, 20, 50]; // Maps slider values 0-3 to actual hours

    const pricingToggleBtns = document.querySelectorAll('.pricing-toggle .toggle-btn');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    // Default State
    let billingPeriod = 'monthly'; 

    function calculatePrice(card, type) {
        if (!pricingData[type]) return; // Skip if not starter or expert

        const sessionInput = card.querySelector('.session-range');
        const visioInput = card.querySelector('.visio-range');

        const sessionVal = parseInt(sessionInput.value);
        const visioStep = parseInt(visioInput.value);
        const visioVal = visioMap[visioStep];

        // Get Base Price
        const basePrice = pricingData[type].sessions[sessionVal][billingPeriod];
        
        // Get Visio Add-on Price
        const visioPrice = pricingData[type].visio[visioVal][billingPeriod];

        const totalPrice = (basePrice + visioPrice).toFixed(2);

        // Update Price Display
        const amountDisplay = card.querySelector('.amount');
        amountDisplay.textContent = '€' + totalPrice;
        
        // Update Period Display
        const periodDisplay = card.querySelector('.period');
        periodDisplay.textContent = billingPeriod === 'yearly' ? 'Par mois (facturé annuellement)' : 'Par mois';

        return { sessionVal, visioVal, totalPrice };
    }

    function updateAllPrices() {
        pricingCards.forEach((card, index) => {
            let type = '';
            if (index === 0) type = 'starter';
            else if (index === 1) type = 'expert';
            
            if (type) {
                calculatePrice(card, type);
            }
        });
    }

    // Toggle Monthly/Yearly
    pricingToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            pricingToggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            billingPeriod = this.id === 'yearlyBtn' ? 'yearly' : 'monthly';
            updateAllPrices();
        });
    });

    // Sliders Functionality
    const pricingRanges = document.querySelectorAll('.pricing-range');
    
    function updateSliderVisuals(range) {
        // Update value text
        const group = range.closest('.slider-group');
        const valueDisplay = group.querySelector('.slider-value p') || group.querySelector('.slider-value');
        
        let displayValue = range.value;
        let unit = '';

        if (range.classList.contains('visio-range')) {
           displayValue = visioMap[range.value];
           unit = ' heures';
        } else {
           unit = ' séances';
        }

        if (valueDisplay) {
             // Handle specific HTML structure (img + p or just text)
             if (valueDisplay.tagName === 'DIV') {
                 // It has an image and text
                 const p = valueDisplay.querySelector('p');
                 if(p) p.textContent = displayValue + unit;
                 else if (valueDisplay.childNodes.length > 1) {
                     // Try to find the text node after the image
                     // This is a bit brittle, assumes img is first child
                     let textNode = valueDisplay.childNodes[1]; 
                     if(textNode.nodeType === 3) textNode.textContent = " " + displayValue + unit;
                     else valueDisplay.lastChild.textContent = " " + displayValue + unit;
                 }
            } else if (valueDisplay.tagName === 'P') {
                 valueDisplay.textContent = displayValue + unit;
            }
        }

        // Update background gradient
        const min = range.min ? parseFloat(range.min) : 0;
        const max = range.max ? parseFloat(range.max) : 100;
        const val = parseFloat(range.value);
        const percentage = ((val - min) / (max - min)) * 100;
        
        range.style.backgroundImage = 'linear-gradient(90deg, #7BB3DF 0%, #5C97D5 100%)';
        range.style.backgroundSize = `${percentage}% 100%`;
        range.style.backgroundRepeat = 'no-repeat';
    }

    pricingRanges.forEach(range => {
        // Initialize visuals
        updateSliderVisuals(range);

        range.addEventListener('input', function() {
            updateSliderVisuals(this);
            
            // Trigger price update if it's a pricing card slider
            const card = this.closest('.pricing-card');
            if (card) {
                let type = '';
                if (card.querySelector('.card-header h3').textContent.includes('Starter')) type = 'starter';
                else if (card.querySelector('.card-header h3').textContent.includes('Expert')) type = 'expert';
                
                if (type) calculatePrice(card, type);
            }
        });
    });

    // Initialize prices on load
    updateAllPrices();
});

