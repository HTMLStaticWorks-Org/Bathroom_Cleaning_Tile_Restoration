document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle & Icon Switcher
    const darkModeToggle = document.getElementById('darkModeToggle');
    const updateDarkIcon = (isDark) => {
        if (!darkModeToggle) return;
        if (isDark) {
            darkModeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
            darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            darkModeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
            darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    };

    if (darkModeToggle) {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            updateDarkIcon(true);
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            updateDarkIcon(isDarkMode);
        });
    }

    // RTL Toggle
    const rtlToggle = document.getElementById('rtlToggle');
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const html = document.documentElement;
            if (html.getAttribute('dir') === 'rtl') {
                html.setAttribute('dir', 'ltr');
                localStorage.setItem('rtlMode', 'false');
            } else {
                html.setAttribute('dir', 'rtl');
                localStorage.setItem('rtlMode', 'true');
            }
        });

        // Check local storage for RTL
        if (localStorage.getItem('rtlMode') === 'true') {
            document.documentElement.setAttribute('dir', 'rtl');
        }
    }

    // Scroll reveal animation with IntersectionObserver & Staggered Cascade
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        const revealOnScroll = () => {
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 100;
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add('active');
                }
            }
        };
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();
    }

    // Number Counter Animation on Scroll
    const counters = document.querySelectorAll('.counter-num');
    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetStr = counter.getAttribute('data-target') || counter.innerText;
                    const targetNum = parseFloat(targetStr.replace(/[^0-9.]/g, ''));
                    const prefix = targetStr.match(/^[^\d]*/)[0] || '';
                    const suffix = targetStr.replace(/^[^\d]*[\d.]+/, '') || '';
                    
                    if (!isNaN(targetNum)) {
                        let current = 0;
                        const duration = 1500;
                        const stepTime = 25;
                        const steps = duration / stepTime;
                        const increment = targetNum / steps;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= targetNum) {
                                current = targetNum;
                                clearInterval(timer);
                            }
                            const formatted = Number.isInteger(targetNum) ? Math.floor(current) : current.toFixed(1);
                            counter.innerText = `${prefix}${formatted}${suffix}`;
                        }, stepTime);
                    }
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(c => counterObserver.observe(c));
    }

    // Back to Top functionality
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile Menu Toggle & Dynamic Drawer Flow
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (mobileMenuBtn) {
        // Ensure standard hamburger bars
        const svg = mobileMenuBtn.querySelector('svg');
        if (svg) {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.toggle('menu-open');
        });
    }

    // Dynamic Mobile Drawer Setup:
    // Move Book Now below the links, then Theme & RTL buttons below Book Now
    function setupMobileMenuActions() {
        if (!navLinks || !navActions) return;

        const darkModeBtn = document.getElementById('darkModeToggle');
        const rtlBtn = document.getElementById('rtlToggle');
        const bookBtn = navActions.querySelector('.btn-nav-book') || 
                        navActions.querySelector('.btn-primary') || 
                        navLinks.querySelector('.mobile-drawer-book-btn');

        if (window.innerWidth <= 1024) {
            // Mobile/Tablet Header: Insert SINGLE clean close header at top of nav-links drawer
            let drawerHeader = navLinks.querySelector('.mobile-drawer-header');
            if (!drawerHeader) {
                drawerHeader = document.createElement('li');
                drawerHeader.className = 'mobile-drawer-header';
                drawerHeader.innerHTML = `
                    <span class="drawer-brand">PURE<span class="drawer-brand-accent">TILE</span></span>
                    <button class="mobile-drawer-close-btn" aria-label="Close Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                `;
                const closeBtn = drawerHeader.querySelector('.mobile-drawer-close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        document.body.classList.remove('menu-open');
                    });
                }
                navLinks.insertBefore(drawerHeader, navLinks.firstChild);
            }

            // Mobile/Tablet Footer: Place inside nav-links drawer
            let drawerContainer = navLinks.querySelector('.mobile-drawer-footer');
            if (!drawerContainer) {
                drawerContainer = document.createElement('li');
                drawerContainer.className = 'mobile-drawer-footer';

                // 1. Book Now button first (moved below the menu links)
                if (bookBtn) {
                    bookBtn.classList.add('mobile-drawer-book-btn');
                    drawerContainer.appendChild(bookBtn);
                }

                // 2. Toggles row below Book Now (Theme button, and RTL button below that)
                const togglesRow = document.createElement('div');
                togglesRow.className = 'mobile-drawer-toggles';
                if (darkModeBtn) togglesRow.appendChild(darkModeBtn);
                if (rtlBtn) togglesRow.appendChild(rtlBtn);

                drawerContainer.appendChild(togglesRow);
                navLinks.appendChild(drawerContainer);
            }
        } else {
            // Desktop: Restore actions to navActions in standard desktop order
            const drawerHeader = navLinks.querySelector('.mobile-drawer-header');
            if (drawerHeader) {
                drawerHeader.remove();
            }

            const drawerContainer = navLinks.querySelector('.mobile-drawer-footer');
            if (drawerContainer) {
                const menuBtn = navActions.querySelector('.mobile-menu-btn');
                if (darkModeBtn) navActions.insertBefore(darkModeBtn, menuBtn);
                if (rtlBtn) navActions.insertBefore(rtlBtn, menuBtn);
                if (bookBtn) {
                    bookBtn.classList.remove('mobile-drawer-book-btn');
                    if (menuBtn) navActions.insertBefore(bookBtn, menuBtn);
                    else navActions.appendChild(bookBtn);
                }
                drawerContainer.remove();
            }
            document.body.classList.remove('menu-open');
        }
    }

    setupMobileMenuActions();
    window.addEventListener('resize', setupMobileMenuActions);

    // Close menu when clicking a link or outside or escape key
    document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-links a')) {
            document.body.classList.remove('menu-open');
        } else if (document.body.classList.contains('menu-open')) {
            if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
                document.body.classList.remove('menu-open');
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
        }
    });
});

// Old Parallax Effect removed - using parallax.js instead
// Parallax Effect for Ultra-Premium Hero Section
document.addEventListener('DOMContentLoaded', () => {
    const heroShowcase = document.getElementById('heroShowcase');
    const hero = document.getElementById('homeHero');
    
    if (heroShowcase && hero && window.innerWidth > 1024) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            const panelFront = hero.querySelector('.panel-front');
            const panelMid = hero.querySelector('.panel-mid');
            const panelBack = hero.querySelector('.panel-back');
            const bgImage = hero.querySelector('.parallax-bg');
            
            if (panelFront) panelFront.style.transform = `translate(${x * 5}px, ${y * 5}px) translateZ(80px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
            if (panelMid) panelMid.style.transform = `translate(calc(45% + ${x * -10}px), calc(15% + ${y * -10}px)) translateZ(-80px) rotateY(${12 + x * 5}deg) rotateX(${-y * 5}deg)`;
            if (panelBack) panelBack.style.transform = `translate(calc(-45% + ${x * -10}px), calc(-15% + ${y * -10}px)) translateZ(-80px) rotateY(${-12 + x * 5}deg) rotateX(${-y * 5}deg)`;
            if (bgImage) bgImage.style.transform = `scale(1.05) translate(${x * -10}px, ${y * -10}px)`;
        });
        
        // Reset on mouse leave
        hero.addEventListener('mouseleave', () => {
            const panelFront = hero.querySelector('.panel-front');
            const panelMid = hero.querySelector('.panel-mid');
            const panelBack = hero.querySelector('.panel-back');
            const bgImage = hero.querySelector('.parallax-bg');
            
            if (panelFront) panelFront.style.transform = `translate(0, 0) translateZ(80px) rotateY(0deg)`;
            if (panelMid) panelMid.style.transform = `translate(45%, 15%) translateZ(-80px) rotateY(12deg)`;
            if (panelBack) panelBack.style.transform = `translate(-45%, -15%) translateZ(-80px) rotateY(-12deg)`;
            if (bgImage) bgImage.style.transform = `scale(1.05)`;
        });

        // Click to Swap Panels in 3D Space
        const panels = hero.querySelectorAll('.glass-layer');

        panels.forEach(panel => {
            panel.addEventListener('click', function() {
                // If the clicked panel is already in front, do nothing
                if (this.classList.contains('panel-front')) return;

                const currentFront = hero.querySelector('.panel-front');
                
                // Find what class the clicked panel currently has
                let clickedClass = '';
                if (this.classList.contains('panel-mid')) clickedClass = 'panel-mid';
                if (this.classList.contains('panel-back')) clickedClass = 'panel-back';

                // Swap classes
                if (currentFront && clickedClass) {
                    currentFront.classList.remove('panel-front');
                    currentFront.classList.add(clickedClass);

                    this.classList.remove(clickedClass);
                    this.classList.add('panel-front');

                    // Crucial: Clear inline transform styles left over from mousemove
                    // so the CSS class transforms and transitions take over instantly!
                    currentFront.style.transform = '';
                    this.style.transform = '';
                }
            });
        });
    }
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other accordions
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                if(otherItem.querySelector('.faq-answer')) {
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            if (!isOpen) {
                item.classList.add('active');
                if(answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });

    // Home Hero Before/After Interactive Comparison
    const comparisonCard = document.getElementById('heroComparison');
    const sliderHandle = document.getElementById('sliderHandle');
    const sliderLine = document.getElementById('sliderLine');
    const seeDifferenceBtn = document.getElementById('seeDifferenceBtn');

    if (comparisonCard && sliderHandle && sliderLine) {
        let isSliding = false;

        const updateSliderPos = (clientX) => {
            const rect = comparisonCard.getBoundingClientRect();
            let offsetX = clientX - rect.left;
            let percent = (offsetX / rect.width) * 100;
            // Bound between 15% and 85%
            percent = Math.max(15, Math.min(85, percent));
            
            sliderHandle.style.left = `${percent}%`;
            sliderLine.style.left = `${percent}%`;
        };

        comparisonCard.addEventListener('mousedown', (e) => {
            isSliding = true;
            updateSliderPos(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isSliding) return;
            updateSliderPos(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            if (isSliding) {
                isSliding = false;
            }
        });

        // Touch support
        comparisonCard.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                isSliding = true;
                updateSliderPos(e.touches[0].clientX);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isSliding || e.touches.length === 0) return;
            updateSliderPos(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isSliding = false;
        });

        // "See the Difference" button interaction
        if (seeDifferenceBtn) {
            seeDifferenceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sliderHandle.style.transition = 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                sliderLine.style.transition = 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                
                sliderHandle.style.left = '35%';
                sliderLine.style.left = '35%';
                
                setTimeout(() => {
                    sliderHandle.style.left = '65%';
                    sliderLine.style.left = '65%';
                    
                    setTimeout(() => {
                        sliderHandle.style.left = '50%';
                        sliderLine.style.left = '50%';
                        
                        setTimeout(() => {
                            sliderHandle.style.transition = '';
                            sliderLine.style.transition = '';
                        }, 400);
                    }, 400);
                }, 400);
            });
        }
    }
});
