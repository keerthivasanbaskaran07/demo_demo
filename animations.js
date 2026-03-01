// GSAP Animations and Page Transitions

// Preloader Animation
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const percentage = document.getElementById('percentage');
    const progressBar = document.getElementById('progress-bar');

    if (!preloader) return;

    // Counter animation from 0 to 100
    const progress = { value: 0 };

    gsap.to(progress, {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: function () {
            const val = Math.round(progress.value);
            if (percentage) percentage.textContent = val + '%';
            if (progressBar) progressBar.style.width = val + '%';
        },
        onComplete: function () {
            // Fade out preloader
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: function () {
                    preloader.style.display = 'none';
                    // Animate main content in
                    animatePageEntry();
                }
            });
        }
    });
}

// Page Entry Animation
function animatePageEntry() {
    // Ensure all elements are visible first
    gsap.set('.feature-card, .stats-card, .post-card, .hero-section, .navbar', { clearProps: 'all' });

    // Fade in navbar
    gsap.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    // Animate hero section or main content
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        gsap.from(heroSection, {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.3
        });
    }

    // Animate cards with stagger - ensure they're visible
    const cards = document.querySelectorAll('.feature-card, .stats-card, .post-card');
    if (cards.length > 0) {
        // Set initial visibility
        gsap.set(cards, { opacity: 1 });
        gsap.from(cards, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.5,
            clearProps: 'opacity'
        });
    }

    // Animate login/register cards
    const authCard = document.querySelector('.login-card, .register-card');
    if (authCard) {
        gsap.from(authCard, {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)"
        });
    }

    // Animate form card
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        gsap.from(formCard, {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    }
}

// Page Transition with Square Particles
function initPageTransitions() {
    // Create transition container if it doesn't exist
    if (!document.getElementById('page-transition')) {
        const transitionContainer = document.createElement('div');
        transitionContainer.id = 'page-transition';
        transitionContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
        `;
        document.body.appendChild(transitionContainer);
    }

    // Event delegation for all internal link transitions
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            // Only add transition to internal links (HTML files) excluding current page anchors
            if (href && href.endsWith('.html') && !href.startsWith('#') && !link.hasAttribute('target')) {
                e.preventDefault();
                transitionToPage(href);
            }
        }
    });

    // Handle back/forward cache (bfcache) to prevent stuck transition overlay
    window.addEventListener('pageshow', function (event) {
        const container = document.getElementById('page-transition');
        if (container) {
            container.style.opacity = '0';
            container.style.pointerEvents = 'none';
            container.innerHTML = '';
        }
    });
}

function createSquareParticles(initialState = {}) {
    const container = document.getElementById('page-transition');
    if (!container) return [];

    container.innerHTML = ''; // Clear previous particles

    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const isDark = currentTheme === 'dark';

    // Theme-aware colors
    const particleColor = '#00E699'; // Bright green accent

    // Calculate grid size for cinematic wipe effect
    const squareSize = 30;
    const cols = Math.ceil(window.innerWidth / squareSize) + 1;
    const rows = Math.ceil(window.innerHeight / squareSize) + 1;
    const totalSquares = cols * rows;

    const initialOpacity = initialState.opacity !== undefined ? initialState.opacity : 0;
    const initialScale = initialState.scale !== undefined ? initialState.scale : 0;

    // Create particles
    const particles = [];
    for (let i = 0; i < totalSquares; i++) {
        const particle = document.createElement('div');
        const col = i % cols;
        const row = Math.floor(i / cols);

        particle.style.cssText = `
            position: absolute;
            left: ${col * squareSize}px;
            top: ${row * squareSize}px;
            width: ${squareSize}px;
            height: ${squareSize}px;
            background: ${particleColor};
            opacity: ${initialOpacity};
            transform: scale(${initialScale});
        `;

        container.appendChild(particle);
        particles.push(particle);
    }

    return particles;
}

function transitionToPage(url) {
    const container = document.getElementById('page-transition');
    if (!container) return;

    container.style.pointerEvents = 'all';
    container.style.opacity = '1';

    // Set flag for next page load
    sessionStorage.setItem('isTransitioning', 'true');

    // Create square particles for cinematic wipe effect
    const particles = createSquareParticles({ opacity: 0, scale: 0 });

    // Calculate grid dimensions
    const squareSize = 30;
    const cols = Math.ceil(window.innerWidth / squareSize) + 1;
    const rows = Math.ceil(window.innerHeight / squareSize) + 1;

    // Animate particles in with left-to-right cinematic wipe effect
    gsap.to(particles, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: {
            each: 0.005,
            from: "left",
            grid: [rows, cols],
            axis: "x"
        },
        onComplete: function () {
            window.location.href = url;
        }
    });
}

function animatePageOut() {
    const container = document.getElementById('page-transition');
    if (!container) return;

    const particles = container.children;
    if (particles.length === 0) return;

    // Calculate grid dimensions for stagger
    const squareSize = 30;
    const cols = Math.ceil(window.innerWidth / squareSize) + 1;
    const rows = Math.ceil(window.innerHeight / squareSize) + 1;

    // Animate particles out with reverse cinematic effect (Wipe Off)
    gsap.to(particles, {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power2.inOut",
        stagger: {
            each: 0.005,
            from: "left", // Wipe off in same direction (or "right" for reverse)
            grid: [rows, cols],
            axis: "x"
        },
        onComplete: function () {
            container.style.opacity = '0';
            container.style.pointerEvents = 'none';
            container.innerHTML = '';
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-scroll]');

    scrollElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
}

// Button Hover Animations
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function () {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', function () {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Sign In Button Transition
    const signinBtn = document.getElementById('signin-btn');
    if (signinBtn) {
        signinBtn.addEventListener('click', function (e) {
            e.preventDefault();
            transitionToPage('index.html');
        });
    }
}

// Initialize all animations when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Initialize page transitions container first
    initPageTransitions();

    const isTransitioning = sessionStorage.getItem('isTransitioning') === 'true';
    if (isTransitioning) sessionStorage.removeItem('isTransitioning'); // Consume flag

    if (document.getElementById('preloader')) {
        // Case 1: Page has preloader (Index). Always use Preloader for entry.
        // Ensure Page Transition overlay is cleared
        const container = document.getElementById('page-transition');
        if (container) {
            container.style.opacity = '0';
            container.style.pointerEvents = 'none';
            container.innerHTML = '';
        }
        initPreloader();
    } else if (isTransitioning) {
        // Case 2: No preloader + Transitioning (Dashboard, etc). Use Green Wipe Reveal.
        const container = document.getElementById('page-transition');
        container.style.opacity = '1';
        container.style.pointerEvents = 'all';

        // Recreate particles in fully visible state
        createSquareParticles({ opacity: 1, scale: 1 });

        // Animate the reveal (Wipe Out)
        requestAnimationFrame(() => {
            animatePageOut();
            setTimeout(animatePageEntry, 400);
        });
    } else {
        // Case 3: No preloader + No transition (Direct refresh). Use Standard Fade In.
        animatePageEntry();
    }

    // Initialize scroll animations if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initScrollAnimations();
    }

    // Initialize button animations
    initButtonAnimations();
});

// Add spinning animation for transition icon
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
<<<<<<< HEAD
document.head.appendChild(style);
=======
>>>>>>> c3ceececc6dd903802820ea5ff1882b31db1f327

