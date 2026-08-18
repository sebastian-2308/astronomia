// =============================================
// CABINA DE NAVE ESPACIAL - JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initNavigation();
    initPlanetSelector();
    initWeightCalculator();
    initAgeCalculator();
    initDistanceConverter();
    initGravitySimulator();
    initFactsCarousel();
    initScrollAnimations();
    initClock();
    initConsoleButtons();
    initHUDAnimation();
    initRealData();
});

// =============================================
// 1. CANVAS DE ESTRELLAS
// =============================================
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    const stars = [];
    const numStars = 250;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    class Star {
        constructor() {
            this.reset();
            this.trail = [];
            this.maxTrail = 5;
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speed = Math.random() * 0.8 + 0.1;
            this.opacity = Math.random();
            this.fadeSpeed = Math.random() * 0.02 + 0.005;
            this.fading = Math.random() > 0.5;
            this.color = Math.random() > 0.8 ? '200, 240, 255' : '255, 255, 255';
        }
        
        update() {
            this.trail.push({ x: this.x, y: this.y, opacity: this.opacity * 0.3 });
            if (this.trail.length > this.maxTrail) {
                this.trail.shift();
            }
            
            this.y -= this.speed;
            
            if (this.fading) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 1) this.fading = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0.2) this.fading = true;
            }
            
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
                this.trail = [];
            }
        }
        
        draw() {
            this.trail.forEach((pos, index) => {
                const trailOpacity = (index / this.trail.length) * pos.opacity * 0.5;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${trailOpacity})`;
                ctx.fill();
            });
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
            
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.2})`;
                ctx.fill();
            }
        }
    }
    
    function init() {
        resize();
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(5, 8, 16, 0.3)';
        ctx.fillRect(0, 0, width, height);
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resize);
    init();
    animate();
}

// =============================================
// 2. RELOJ EN TIEMPO REAL
// =============================================
function initClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// =============================================
// 3. (REEMPLAZADO POR initRealData - coords GPS reales)
// =============================================

// =============================================
// 4. BOTONES DE CONSOLA ACTIVOS AL SCROLL
// =============================================
function initConsoleButtons() {
    const buttons = document.querySelectorAll('.console-btn');
    const sections = document.querySelectorAll('section[id]');
    
    // Click en botón
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Detectar sección visible
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.section === sectionId) {
                        btn.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// =============================================
// 5. HUD DE VIDEOJUEGO - RADAR, ENERGÍA, ALTITUD
// =============================================
function initHUDAnimation() {
    // Barra de energía fluctúa suavemente
    const powerFill = document.querySelector('.powerbar-fill');
    const powerValue = document.getElementById('power-value');
    if (powerFill && powerValue) {
        let power = 68;
        setInterval(() => {
            power += (Math.random() - 0.5) * 6;
            power = Math.max(45, Math.min(95, power));
            powerFill.style.width = power + '%';
            powerValue.textContent = Math.round(power) + '%';
        }, 800);
    }
    
    // Altitud cambia suavemente
    const altitudeValue = document.getElementById('altitude-value');
    const altitudeFill = document.querySelector('.altitude-fill');
    if (altitudeValue && altitudeFill) {
        let alt = 0;
        setInterval(() => {
            alt += 100 + Math.random() * 300;
            if (alt > 25000) alt = 0;
            altitudeValue.textContent = Math.round(alt).toLocaleString('es-ES') + ' M';
            altitudeFill.style.height = (alt / 25000 * 100) + '%';
        }, 900);
    }
}

// =============================================
// 6. DATOS REALES SEGÚN UBICACIÓN (GEOLOCALIZACIÓN + CLIMA)
// =============================================
function initRealData() {
    const statusCoords = document.getElementById('status-coords');
    const statusTemp = document.getElementById('status-temp');
    
    if (!navigator.geolocation) {
        if (statusTemp) statusTemp.textContent = 'TEMP: --°C';
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const coordsText = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
            
            // Actualizar coordenadas en el panel superior
            if (statusCoords) statusCoords.textContent = `COORD: ${coordsText}`;
            
            // Obtener clima actual (API gratuita sin llave)
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
                .then(r => r.json())
                .then(data => {
                    const weather = data.current_weather;
                    if (!weather) return;
                    if (statusTemp) statusTemp.textContent = `TEMP: ${Math.round(weather.temperature)}°C`;
                })
                .catch(() => {
                    if (statusTemp) statusTemp.textContent = 'TEMP: --°C';
                });
        },
        (err) => {
            if (statusTemp) statusTemp.textContent = 'TEMP: --°C';
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
}

// =============================================
// 7. NAVEGACIÓN RESPONSIVE
// =============================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// =============================================
// 8. SELECTOR DE PLANETAS
// =============================================
function initPlanetSelector() {
    const planetData = {
        sun: {
            name: 'El Sol',
            type: 'Estrella (G2V)',
            diameter: '1.392.700 km',
            temperature: '5.500 °C (superficie)',
            mass: '1.989 × 10³⁰ kg',
            age: '4.600 millones años',
            gravity: '274 m/s²',
            description: 'El Sol es la estrella en el centro de nuestro sistema solar. Es una esfera de plasma caliente que proporciona la energía necesaria para la vida en la Tierra. Representa el 99.86% de la masa total del sistema solar.',
            className: 'sun-sphere'
        },
        mercury: {
            name: 'Mercurio',
            type: 'Planeta rocoso',
            diameter: '4.879 km',
            temperature: '-173 °C a 427 °C',
            mass: '3.285 × 10²³ kg',
            age: '4.500 millones años',
            gravity: '3.7 m/s²',
            description: 'El planeta más cercano al Sol y el más pequeño del sistema solar. No tiene atmósfera significativa.',
            className: 'mercury-sphere'
        },
        venus: {
            name: 'Venus',
            type: 'Planeta rocoso',
            diameter: '12.104 km',
            temperature: '462 °C (superficie)',
            mass: '4.867 × 10²⁴ kg',
            age: '4.500 millones años',
            gravity: '8.87 m/s²',
            description: 'El planeta más caliente del sistema solar debido al efecto invernadero extremo de su atmósfera densa de CO₂.',
            className: 'venus-sphere'
        },
        earth: {
            name: 'La Tierra',
            type: 'Planeta rocoso',
            diameter: '12.742 km',
            temperature: '15 °C (promedio)',
            mass: '5.972 × 10²⁴ kg',
            age: '4.540 millones años',
            gravity: '9.807 m/s²',
            description: 'Nuestro hogar. El único planeta conocido con vida. Tiene agua líquida en su superficie.',
            className: 'earth-sphere'
        },
        mars: {
            name: 'Marte',
            type: 'Planeta rocoso',
            diameter: '6.779 km',
            temperature: '-63 °C (promedio)',
            mass: '6.39 × 10²³ kg',
            age: '4.600 millones años',
            gravity: '3.71 m/s²',
            description: 'El planeta rojo. Tiene el volcán más grande del sistema solar (Olympus Mons).',
            className: 'mars-sphere'
        },
        jupiter: {
            name: 'Júpiter',
            type: 'Planeta gaseoso',
            diameter: '139.820 km',
            temperature: '-108 °C (promedio)',
            mass: '1.898 × 10²⁷ kg',
            age: '4.500 millones años',
            gravity: '24.79 m/s²',
            description: 'El planeta más grande del sistema solar. Tiene 95 lunas conocidas.',
            className: 'jupiter-sphere'
        },
        saturn: {
            name: 'Saturno',
            type: 'Planeta gaseoso',
            diameter: '116.460 km',
            temperature: '-139 °C (promedio)',
            mass: '5.683 × 10²⁶ kg',
            age: '4.500 millones años',
            gravity: '10.44 m/s²',
            description: 'Famoso por sus anillos de hielo. Tiene 146 lunas conocidas.',
            className: 'saturn-sphere'
        },
        uranus: {
            name: 'Urano',
            type: 'Planeta gaseoso (hielo)',
            diameter: '50.724 km',
            temperature: '-197 °C (promedio)',
            mass: '8.681 × 10²⁵ kg',
            age: '4.500 millones años',
            gravity: '8.69 m/s²',
            description: 'Gigante de hielo con eje inclinado 98°. Color azul verdoso por metano.',
            className: 'uranus-sphere'
        },
        neptune: {
            name: 'Neptuno',
            type: 'Planeta gaseoso (hielo)',
            diameter: '49.244 km',
            temperature: '-201 °C (promedio)',
            mass: '1.024 × 10²⁶ kg',
            age: '4.500 millones años',
            gravity: '11.15 m/s²',
            description: 'El planeta más ventoso. Vientos de hasta 2,100 km/h.',
            className: 'neptune-sphere'
        }
    };
    
    const buttons = document.querySelectorAll('.planet-btn');
    const visual = document.getElementById('planet-visual');
    const info = document.getElementById('planet-info');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const planet = planetData[btn.dataset.planet];
            
            visual.style.opacity = '0';
            info.style.opacity = '0';
            
            setTimeout(() => {
                visual.innerHTML = `<div class="planet-sphere ${planet.className}"></div>`;
                
                info.innerHTML = `
                    <h3>${planet.name}</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Tipo</span>
                            <span class="info-value">${planet.type}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Diámetro</span>
                            <span class="info-value">${planet.diameter}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Temperatura</span>
                            <span class="info-value">${planet.temperature}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Masa</span>
                            <span class="info-value">${planet.mass}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Edad</span>
                            <span class="info-value">${planet.age}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Gravedad</span>
                            <span class="info-value">${planet.gravity}</span>
                        </div>
                    </div>
                    <p class="planet-description">${planet.description}</p>
                `;
                
                visual.style.opacity = '1';
                info.style.opacity = '1';
            }, 300);
        });
    });
}

// =============================================
// 9. CALCULADORA DE PESO
// =============================================
function initWeightCalculator() {
    const input = document.getElementById('weight-input');
    const gravityFactors = {
        mercury: 0.378,
        venus: 0.907,
        moon: 0.166,
        mars: 0.377,
        jupiter: 2.528,
        saturn: 1.064,
        uranus: 0.889,
        neptune: 1.125,
        pluto: 0.063,
        sun: 27.9
    };
    
    function calculate() {
        const earthWeight = parseFloat(input.value) || 0;
        
        Object.keys(gravityFactors).forEach(planet => {
            const element = document.getElementById(`weight-${planet}`);
            if (element) {
                const weight = (earthWeight * gravityFactors[planet]).toFixed(1);
                element.textContent = `${weight} kg`;
            }
        });
    }
    
    input.addEventListener('input', calculate);
    calculate();
}

// =============================================
// 10. CALCULADORA DE EDAD
// =============================================
function initAgeCalculator() {
    const input = document.getElementById('age-input');
    const yearLengths = {
        mercury: 87.97,
        venus: 224.7,
        mars: 686.98,
        jupiter: 4332.82,
        saturn: 10755.7,
        uranus: 30688.5,
        neptune: 60182,
        pluto: 90560
    };
    
    function calculate() {
        const earthAge = parseFloat(input.value) || 0;
        const earthDays = earthAge * 365.25;
        
        Object.keys(yearLengths).forEach(planet => {
            const element = document.getElementById(`age-${planet}`);
            if (element) {
                const planetAge = (earthDays / yearLengths[planet]).toFixed(1);
                element.textContent = `${planetAge} años`;
            }
        });
    }
    
    input.addEventListener('input', calculate);
    calculate();
}

// =============================================
// 11. CONVERSOR DE DISTANCIAS
// =============================================
function initDistanceConverter() {
    const valueInput = document.getElementById('distance-value');
    const fromSelect = document.getElementById('distance-from');
    const toSelect = document.getElementById('distance-to');
    const convertBtn = document.getElementById('convert-distance');
    const resultBox = document.getElementById('distance-result');
    const contextInfo = document.getElementById('distance-context');
    
    const units = {
        km: 1,
        au: 149597870.7,
        ly: 9460730472580.8,
        pc: 30856775814913.7
    };
    
    const contextData = {
        km: [
            { threshold: 384400, text: 'Distancia a la Luna: 384,400 km' },
            { threshold: 149600000, text: 'Distancia al Sol: 149.6M km' },
            { threshold: 5900000000, text: 'Distancia a Plutón (promedio): 5.9B km' }
        ],
        au: [
            { threshold: 0.0026, text: 'Distancia a la Luna: 0.0026 UA' },
            { threshold: 1, text: 'Distancia al Sol: 1 UA' },
            { threshold: 39.5, text: 'Distancia a Plutón: ~39.5 UA' }
        ],
        ly: [
            { threshold: 0.00004, text: 'Distancia al Sol: 0.0000158 años luz' },
            { threshold: 4.24, text: 'Proxima Centauri: 4.24 años luz' },
            { threshold: 1000, text: 'Nebulosa de Orión: ~1,344 años luz' }
        ],
        pc: [
            { threshold: 0.000005, text: 'Distancia al Sol: ~0.000005 pársecs' },
            { threshold: 1.3, text: 'Proxima Centauri: 1.3 pársecs' },
            { threshold: 8000, text: 'Centro de la galaxia: ~8,000 pársecs' }
        ]
    };
    
    function convert() {
        const value = parseFloat(valueInput.value) || 0;
        const from = fromSelect.value;
        const to = toSelect.value;
        
        const inKm = value * units[from];
        const result = inKm / units[to];
        
        let formatted;
        if (result < 0.0001) {
            formatted = result.toExponential(4);
        } else if (result < 1) {
            formatted = result.toFixed(6);
        } else if (result < 1000) {
            formatted = result.toFixed(2);
        } else {
            formatted = result.toLocaleString('es-ES', { maximumFractionDigits: 0 });
        }
        
        resultBox.innerHTML = `
            <span class="result-number">${formatted}</span>
            <span class="result-unit">${to.toUpperCase()}</span>
        `;
        
        const contexts = contextData[to];
        let contextText = '';
        for (const ctx of contexts) {
            if (result >= ctx.threshold) {
                contextText = ctx.text;
                break;
            }
        }
        if (!contextText && contexts.length > 0) {
            contextText = contexts[0].text;
        }
        contextInfo.textContent = contextText;
    }
    
    convertBtn.addEventListener('click', convert);
    valueInput.addEventListener('input', convert);
    fromSelect.addEventListener('change', convert);
    toSelect.addEventListener('change', convert);
    
    // Botones de preset
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value;
            const unit = btn.dataset.unit;
            valueInput.value = value;
            fromSelect.value = unit;
            convert();
        });
    });
}

// =============================================
// 12. SIMULADOR DE GRAVEDAD
// =============================================
function initGravitySimulator() {
    const m1Slider = document.getElementById('gravity-m1');
    const m2Slider = document.getElementById('gravity-m2');
    const rSlider = document.getElementById('gravity-r');
    const m1Val = document.getElementById('gravity-m1-val');
    const m2Val = document.getElementById('gravity-m2-val');
    const rVal = document.getElementById('gravity-r-val');
    const result = document.getElementById('gravity-result');
    const mass1Circle = document.querySelector('#mass1 .mass-circle');
    const mass2Circle = document.querySelector('#mass2 .mass-circle');
    
    const G = 6.67430e-11;
    
    function update() {
        const m1 = parseFloat(m1Slider.value);
        const m2 = parseFloat(m2Slider.value);
        const r = parseFloat(rSlider.value);
        
        m1Val.textContent = `${m1} kg`;
        m2Val.textContent = `${m2} kg`;
        rVal.textContent = `${r} m`;
        
        const size1 = Math.max(30, Math.min(100, m1 / 10));
        const size2 = Math.max(30, Math.min(100, m2 / 10));
        mass1Circle.style.setProperty('--size', `${size1}px`);
        mass2Circle.style.setProperty('--size', `${size2}px`);
        mass1Circle.style.width = `${size1}px`;
        mass1Circle.style.height = `${size1}px`;
        mass2Circle.style.width = `${size2}px`;
        mass2Circle.style.height = `${size2}px`;
        
        const force = (G * m1 * m2) / (r * r);
        
        let formatted;
        if (force < 0.001) {
            formatted = force.toExponential(2);
        } else {
            formatted = force.toFixed(6);
        }
        
        result.textContent = `F = ${formatted} N`;
    }
    
    m1Slider.addEventListener('input', update);
    m2Slider.addEventListener('input', update);
    rSlider.addEventListener('input', update);
    update();
}

// =============================================
// 13. CARRUSEL DE DATOS CURIOSOS
// =============================================
function initFactsCarousel() {
    const slides = document.querySelectorAll('.fact-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-fact');
    const nextBtn = document.getElementById('next-fact');
    let currentSlide = 0;
    let autoPlayInterval;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }
    
    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }
    
    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    startAutoPlay();
}

// =============================================
// 14. ANIMACIONES AL SCROLL
// =============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.astronomer-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    document.querySelectorAll('.tool-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    document.querySelectorAll('.fact-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}
