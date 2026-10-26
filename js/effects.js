// solar-system-3d — glow ring + shooting-star effects (extracted from app.js 2026-10-26)

let glowRingEl = null;
let shootingStarInterval = null;

function createGlowRing() {
    glowRingEl = document.createElement('div');
    glowRingEl.className = 'planet-glow-ring hidden';
    document.body.appendChild(glowRingEl);
}

function updateGlowRing() {
    if (!glowRingEl || !hoveredPlanet) {
        if (glowRingEl) glowRingEl.classList.add('hidden');
        return;
    }

    const planet = planets[hoveredPlanet];
    if (!planet) { glowRingEl.classList.add('hidden'); return; }

    const pos = new THREE.Vector3();
    pos.copy(planet.mesh.position);
    pos.project(camera);

    if (pos.z >= 1) { glowRingEl.classList.add('hidden'); return; }

    const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;

    const worldPos = new THREE.Vector3(planet.mesh.position.x, 0, planet.mesh.position.z);
    const camDist = camera.position.distanceTo(worldPos);
    const size = Math.max(20, 300 / camDist * planet.data.radius * 60);

    glowRingEl.classList.remove('hidden');
    glowRingEl.style.left = (x - size / 2) + 'px';
    glowRingEl.style.top = (y - size / 2) + 'px';
    glowRingEl.style.width = size + 'px';
    glowRingEl.style.height = size + 'px';
}

// ============ SEARCH ============

function launchShootingStar() {
    const el = document.createElement('div');
    el.className = 'shooting-star';
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight * 0.4;
    const angle = Math.PI / 4 + Math.random() * Math.PI / 4;
    const dist = 200 + Math.random() * 300;
    const duration = 1 + Math.random() * 1.5;
    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    el.style.animationDuration = duration + 's';
    el.style.width = (1 + Math.random() * 2) + 'px';
    el.style.height = (1 + Math.random() * 2) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
}

function startShootingStars() {
    shootingStarInterval = setInterval(() => {
        if (Math.random() > 0.6) launchShootingStar();
    }, 4000);
}

// ============ SUN ============
