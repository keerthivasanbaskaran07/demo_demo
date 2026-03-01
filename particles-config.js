// Particles.js Configuration for Interactive Particle System

function initParticles() {
    // Check if particles container exists
    if (!document.getElementById('particles-js')) {
        const particlesDiv = document.createElement('div');
        particlesDiv.id = 'particles-js';
        particlesDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        `;
        document.body.insertBefore(particlesDiv, document.body.firstChild);
    }

    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const isDark = currentTheme === 'dark';

    // Theme-aware particle configuration
    const particleColor = '#00E699';
    const particleOpacity = isDark ? 0.8 : 0.9;  // Brighter in both modes
    const lineOpacity = isDark ? 0.6 : 0.7;     // More visible lines

    // Initialize particles with interactive configuration
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: particleColor
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 2,
                    color: particleColor
                }
            },
            opacity: {
                value: particleOpacity,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: isDark ? 0.3 : 0.4,
                    sync: false
                }
            },
            size: {
                value: 4,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.5,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: particleColor,
                opacity: lineOpacity,
                width: 2
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'window',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 200,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                },
                repulse: {
                    distance: 100,
                    duration: 0.4
                }
            }
        },
        retina_detect: true
    });

    // Ensure canvas is interactive
    setTimeout(function () {
        const canvas = document.querySelector('#particles-js canvas');
        if (canvas) {
            canvas.style.pointerEvents = 'auto';
        }
    }, 100);
}

// Reinitialize particles when theme changes
function updateParticlesTheme() {
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        initParticles();
    }
}

// Initialize particles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}
