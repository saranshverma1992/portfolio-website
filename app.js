document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // THEME TOGGLE
    // ==========================================================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const mobileThemeToggleBtn = document.getElementById('mobileThemeToggle');
    
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggleBtn) {
        mobileThemeToggleBtn.addEventListener('click', toggleTheme);
    }

    // ==========================================================================
    // MOBILE NAVIGATION TOGGLE
    // ==========================================================================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuToggle && navOverlay) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ==========================================================================
    // CURSOR FOLLOW GLOW & SCROLL PROGRESS
    // ==========================================================================
    const cursorGlow = document.getElementById('cursorGlow');
    const customCursor = document.getElementById('customCursor');
    const scrollProgress = document.getElementById('scrollProgress');

    // Store mouse coordinates
    let mouseX = 0;
    let mouseY = 0;
    
    // Store current position of custom elements
    let glowX = 0;
    let glowY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth lerp (linear interpolation) animation loop for cursor tracking
    function animateCursor() {
        // Different speeds for glow vs dot for a beautiful delayed parallax follow effect
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;

        if (cursorGlow) {
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
        }

        if (customCursor) {
            customCursor.style.left = `${cursorX}px`;
            customCursor.style.top = `${cursorY}px`;
        }

        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${percentage}%`;
        }
    };
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    // ==========================================================================
    // INTERACTIVE PROFILE CARD 3D TILT
    // ==========================================================================
    const profileCard = document.getElementById('profileCard');
    if (profileCard) {
        profileCard.addEventListener('mouseenter', () => {
            if (customCursor) {
                customCursor.classList.add('cursor-active-profile');
            }
        });

        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            const cardX = e.clientX - rect.left;
            const cardY = e.clientY - rect.top;
            
            const percentX = (cardX / rect.width) * 100;
            const percentY = (cardY / rect.height) * 100;
            profileCard.style.setProperty('--tilt-x', `${percentX}%`);
            profileCard.style.setProperty('--tilt-y', `${percentY}%`);
            
            const rotX = ((cardY / rect.height) * 20 - 10).toFixed(1);
            const rotY = ((10 - (cardX / rect.width) * 20)).toFixed(1);
            
            profileCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        profileCard.addEventListener('mouseleave', () => {
            profileCard.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            profileCard.style.setProperty('--tilt-x', '50%');
            profileCard.style.setProperty('--tilt-y', '50%');
            if (customCursor) {
                customCursor.classList.remove('cursor-active-profile');
            }
        });
    }

    // Interactive 3D tilt for Hero Title on hover
    const heroTitle = document.querySelector('.hero-title-new');
    if (heroTitle) {
        heroTitle.addEventListener('mousemove', (e) => {
            const rect = heroTitle.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotX = ((y / rect.height) * 12 - 6).toFixed(1);
            const rotY = ((6 - (x / rect.width) * 12)).toFixed(1);
            
            heroTitle.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
            heroTitle.style.textShadow = `${-rotY * 0.6}px ${rotX * 0.6}px 12px rgba(168, 85, 247, 0.15)`;
        });
        
        heroTitle.addEventListener('mouseleave', () => {
            heroTitle.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            heroTitle.style.textShadow = 'none';
        });
    }

    // ==========================================================================
    // REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // SPOTLIGHT GLOW EFFECT (CARD MOUSE HOVER)
    // ==========================================================================
    const problemCards = document.querySelectorAll('.problem-card');
    
    problemCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Project cards interactive mouse spotlight coordinates
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Mouse spotlight coordinates
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Logo glow parallax coordinate
            const glowX = ((x / rect.width) * 20 - 10).toFixed(1);
            const glowY = ((y / rect.height) * 20 - 10).toFixed(1);
            card.style.setProperty('--p-hover-x', `${glowX}px`);
            card.style.setProperty('--p-hover-y', `${glowY}px`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--p-hover-x', '0px');
            card.style.setProperty('--p-hover-y', '0px');
        });
    });

    // Native download of Saransh-Verma-CV.pdf is handled directly by the anchor tag in index.html.

    // ==========================================================================
    // IMPACT NUMBERS COUNT UP ON SCROLL
    // ==========================================================================
    const counters = document.querySelectorAll('.counter');
    
    const countUp = (counter) => {
        const rawTarget = counter.getAttribute('data-target');
        const isFloat = rawTarget.includes('.');
        const target = parseFloat(rawTarget);
        const current = parseFloat(counter.innerText || '0');
        
        // Calculate step increments
        const step = isFloat ? 0.1 : Math.ceil(target / 40);
        
        if (current < target) {
            const nextValue = Math.min(current + step, target);
            counter.innerText = isFloat ? nextValue.toFixed(1) : Math.floor(nextValue);
            setTimeout(() => countUp(counter), 30);
        } else {
            counter.innerText = isFloat ? target.toFixed(1) : target;
        }
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                countUp(counter);
                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Accordion Items Mouse Spotlight Effect
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Approach Cards Mouse Spotlight Effect
    const approachCards = document.querySelectorAll('.timeline-card');
    approachCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Scroll Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });

    // Workflow Accordion Toggle & Auto-Play Logic
    const accordionContainer = document.querySelector('.workflow-accordion');
    const accordionItemsList = document.querySelectorAll('.workflow-accordion .accordion-item');
    const accordionHeaders = document.querySelectorAll('.workflow-accordion .accordion-header');
    
    let accordionActiveIndex = 0; 
    let accordionTimer = null;
    let isAccordionHovered = false;

    const setActiveAccordionItem = (index) => {
        accordionItemsList.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        accordionActiveIndex = index;
    };

    const startAccordionAutoPlay = () => {
        accordionTimer = setInterval(() => {
            if (isAccordionHovered) return;
            let nextIndex = (accordionActiveIndex + 1) % accordionItemsList.length;
            setActiveAccordionItem(nextIndex);
        }, 4000);
    };

    // Header click logic
    accordionHeaders.forEach((header, index) => {
        header.addEventListener('click', () => {
            setActiveAccordionItem(index);
        });
    });

    // Pause on hover
    if (accordionContainer) {
        accordionContainer.addEventListener('mouseenter', () => {
            isAccordionHovered = true;
        });
        accordionContainer.addEventListener('mouseleave', () => {
            isAccordionHovered = false;
        });
    }

    // Start auto cycle
    startAccordionAutoPlay();

    // Testimonials Track Auto Slider & Drag-to-Scroll
    const testimonialsWrapper = document.querySelector('.testimonials-track-wrapper');
    if (testimonialsWrapper) {
        let isDown = false;
        let startX;
        let scrollLeftVal;
        let isHovered = false;
        let scrollTimer = null;

        // Hover tracking to pause auto-scroll
        testimonialsWrapper.addEventListener('mouseenter', () => { isHovered = true; });
        testimonialsWrapper.addEventListener('mouseleave', () => { isHovered = false; });

        // Mouse Drag to Scroll
        testimonialsWrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            testimonialsWrapper.classList.add('active-grab');
            startX = e.pageX - testimonialsWrapper.offsetLeft;
            scrollLeftVal = testimonialsWrapper.scrollLeft;
        });

        testimonialsWrapper.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialsWrapper.classList.remove('active-grab');
        });

        testimonialsWrapper.addEventListener('mouseup', () => {
            isDown = false;
            testimonialsWrapper.classList.remove('active-grab');
        });

        testimonialsWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsWrapper.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed multiplier
            testimonialsWrapper.scrollLeft = scrollLeftVal - walk;
        });

        // Auto Slider Animation Loop
        const startAutoScrollTestimonials = () => {
            scrollTimer = setInterval(() => {
                if (isHovered || isDown) return;
                const maxScrollLeft = testimonialsWrapper.scrollWidth - testimonialsWrapper.clientWidth;
                if (testimonialsWrapper.scrollLeft >= maxScrollLeft - 10) {
                    testimonialsWrapper.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    const card = testimonialsWrapper.querySelector('.testimonial-card');
                    const step = card ? card.offsetWidth + 32 : 482; // card width + gap
                    testimonialsWrapper.scrollBy({ left: step, behavior: 'smooth' });
                }
            }, 5000);
        };

        startAutoScrollTestimonials();
    }

    // ==========================================================================
    // INTERACTIVE PARTICLE VORTEX BACKGROUND (LIFTOFF ANIMATION)


    // ==========================================================================
    // FULL SCREEN DRAWING CANVAS INTERACTION
    // ==========================================================================
    const drawCanvas = document.getElementById('drawingCanvas');
    if (drawCanvas) {
        const dCtx = drawCanvas.getContext('2d');
        
        const resizeDrawCanvas = () => {
            drawCanvas.width = window.innerWidth;
            drawCanvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeDrawCanvas);
        resizeDrawCanvas();
        
        let isDrawing = false;
        let lastDrawX = 0;
        let lastDrawY = 0;
        let canvasOpacity = 1;
        let fadeInterval = null;
        
        window.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Left click only
            
            // Clear previous content immediately
            dCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
            drawCanvas.style.opacity = '1';
            
            isDrawing = true;
            lastDrawX = e.clientX;
            lastDrawY = e.clientY;
            
            if (customCursor) {
                customCursor.classList.add('drawing');
            }
            
            if (fadeInterval) {
                clearInterval(fadeInterval);
                fadeInterval = null;
            }
            canvasOpacity = 1;
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            dCtx.beginPath();
            dCtx.moveTo(lastDrawX, lastDrawY);
            dCtx.lineTo(e.clientX, e.clientY);
            
            // Glowing neon stroke
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            dCtx.strokeStyle = currentTheme === 'light' ? '#000000' : '#ffffff';
            dCtx.lineWidth = 4;
            dCtx.lineCap = 'round';
            dCtx.lineJoin = 'round';
            dCtx.shadowColor = currentTheme === 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)';
            dCtx.shadowBlur = 8;
            
            dCtx.stroke();
            
            lastDrawX = e.clientX;
            lastDrawY = e.clientY;
        });
        
        const stopDrawing = () => {
            if (!isDrawing) return;
            isDrawing = false;
            
            if (customCursor) {
                customCursor.classList.remove('drawing');
            }
            
            // Smoothly fade out canvas opacity
            if (fadeInterval) clearInterval(fadeInterval);
            fadeInterval = setInterval(() => {
                canvasOpacity -= 0.04;
                if (canvasOpacity <= 0) {
                    clearInterval(fadeInterval);
                    fadeInterval = null;
                    dCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
                } else {
                    drawCanvas.style.opacity = canvasOpacity;
                }
            }, 30);
        };
        
        window.addEventListener('mouseup', stopDrawing);
        window.addEventListener('mouseleave', stopDrawing);
    }

    // ==========================================================================
    // DYNAMIC BACKGROUND GEOMETRIC SHAPE GRID
    // ==========================================================================
    const bgShapeGrid = document.getElementById('bgShapeGrid');
    if (bgShapeGrid) {
        const cellSize = 48;
        let cols, rows, totalCells;
        let cells = [];

        const initGrid = () => {
            bgShapeGrid.innerHTML = '';
            cells = [];
            
            cols = Math.ceil(window.innerWidth / cellSize);
            rows = Math.ceil(window.innerHeight / cellSize);
            totalCells = cols * rows;
            
            const shapes = ['dot', 'star', 'rect', 'triangle'];
            
            for (let i = 0; i < totalCells; i++) {
                const cell = document.createElement('div');
                cell.className = 'grid-shape-cell';
                
                const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
                
                const item = document.createElement('span');
                item.className = `shape-item shape-${shapeType}`;
                
                cell.appendChild(item);
                bgShapeGrid.appendChild(cell);
                cells.push(cell);
            }
        };

        initGrid();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(initGrid, 150);
        });

        // Mouse coordinates map to highlight shapes within a proximity radius of the cursor
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const radius = 110; // Interaction radius in pixels
            const checkRadiusCells = 3; // Cell search window limit
            
            const centerCol = Math.floor(mouseX / cellSize);
            const centerRow = Math.floor(mouseY / cellSize);
            
            // Clear prior states
            cells.forEach(c => c.classList.remove('active'));
            
            // Highlight cells inside proximity sphere
            for (let r = centerRow - checkRadiusCells; r <= centerRow + checkRadiusCells; r++) {
                for (let c = centerCol - checkRadiusCells; c <= centerCol + checkRadiusCells; c++) {
                    if (c >= 0 && c < cols && r >= 0 && r < rows) {
                        const index = r * cols + c;
                        if (index >= 0 && index < cells.length) {
                            const cell = cells[index];
                            const cellX = c * cellSize + cellSize / 2;
                            const cellY = r * cellSize + cellSize / 2;
                            
                            const dx = mouseX - cellX;
                            const dy = mouseY - cellY;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < radius) {
                                cell.classList.add('active');
                            }
                        }
                    }
                }
            }
        });

        // Remove highlights when cursor leaves viewport
        window.addEventListener('mouseleave', () => {
            cells.forEach(c => c.classList.remove('active'));
        });
    }

    // ==========================================================================
    // CUSTOM CURSOR COMPANION SHAPE CYCLE & SECTION TOOLTIPS
    // ==========================================================================
    const cursorShape = document.getElementById('cursorShape');
    if (cursorShape) {
        const shapeClasses = ['shape-circle', 'shape-triangle', 'shape-star'];
        let activeShapeIdx = 0;
        
        setInterval(() => {
            cursorShape.classList.remove(shapeClasses[activeShapeIdx]);
            activeShapeIdx = (activeShapeIdx + 1) % shapeClasses.length;
            cursorShape.classList.add(shapeClasses[activeShapeIdx]);
        }, 1000);
    }

    if (customCursor) {
        const cursorLabel = customCursor.querySelector('.cursor-label');
        const sections = document.querySelectorAll('section, footer, header');
        let typingInterval = null;

        const typeText = (text) => {
            if (typingInterval) clearInterval(typingInterval);
            if (!cursorLabel) return;
            
            let index = 0;
            cursorLabel.textContent = '';
            
            typingInterval = setInterval(() => {
                if (index < text.length) {
                    cursorLabel.textContent = text.slice(0, index + 1) + '|';
                    index++;
                } else {
                    clearInterval(typingInterval);
                    let showCursor = true;
                    typingInterval = setInterval(() => {
                        cursorLabel.textContent = text + (showCursor ? '|' : '');
                        showCursor = !showCursor;
                    }, 500);
                }
            }, 40);
        };
        
        sections.forEach(sec => {
            sec.addEventListener('mouseenter', () => {
                let name = '';
                const id = sec.id || sec.tagName.toLowerCase();
                
                if (id === 'hero') name = 'Saransh Verma';
                else if (id === 'projects') name = 'Work & Case Studies';
                else if (id === 'ai-workflow') name = 'Workflow';
                else if (id === 'approach') name = 'My Process';
                else if (id === 'contact') name = 'Let\'s Connect';
                else if (id === 'header') name = 'Menu';
                else if (id === 'footer') name = 'Footer';
                else name = id.charAt(0).toUpperCase() + id.slice(1);
                
                if (cursorLabel) {
                    typeText(name);
                    customCursor.classList.add('cursor-active-profile');
                }
            });
            
            sec.addEventListener('mouseleave', () => {
                if (cursorLabel) {
                    customCursor.classList.remove('cursor-active-profile');
                    if (typingInterval) {
                        clearInterval(typingInterval);
                        typingInterval = null;
                    }
                }
            });
        });
    }
    // Case study cards stacking scroll fallback for Safari/Firefox
    if (!window.CSS || !CSS.supports || !CSS.supports('animation-timeline', 'view()')) {
        const cards = document.querySelectorAll('.project-card');
        if (cards.length) {
            window.addEventListener('scroll', () => {
                cards.forEach((card, index) => {
                    const nextCard = cards[index + 1];
                    if (nextCard) {
                        const cardRect = card.getBoundingClientRect();
                        const nextRect = nextCard.getBoundingClientRect();
                        
                        // Calculate overlap percentage
                        const overlap = Math.max(0, cardRect.bottom - nextRect.top);
                        const progress = Math.min(1, overlap / cardRect.height);
                        
                        const scaleTo = index === 0 ? 0.90 : (index === 1 ? 0.93 : 0.96);
                        const translateTo = index === 0 ? -30 : (index === 1 ? -20 : -10);
                        
                        const currentScale = 1 - (1 - scaleTo) * progress;
                        const currentTranslate = translateTo * progress;
                        const currentBrightness = 1 - 0.6 * progress;
                        
                        if (overlap > 0) {
                            card.style.transform = `scale(${currentScale}) translateY(${currentTranslate}px)`;
                            card.style.filter = `brightness(${currentBrightness})`;
                        } else {
                            card.style.transform = '';
                            card.style.filter = '';
                        }
                    }
                });
            });
        }
    }

});

