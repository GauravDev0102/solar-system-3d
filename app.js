// solar-system-3d — scene init, planet/belt creation, events, render loop (app core)
/**
 * 3D Solar System Explorer - Enhanced Edition
 * Features: NASA-quality texture maps, asteroid belt, planet moons, axial tilt,
 * camera fly-to, animated sun surface, multi-layer rings, and detailed planet data.
 * Textures: Solar System Scope (CC-BY 4.0) - https://www.solarsystemscope.com/textures
 */

// ============ ENHANCED PLANET DATA ============
let scene, camera, renderer, controls;
let sun, sunGlow1, sunGlow2, sunCorona;
let planets = {};
let orbitLines = {};
let asteroidBelt;
let raycaster, mouse;
let isPlaying = true;
let elapsedTime = 0;
let speedMultiplier = 1.0;
let showOrbits = true;
let showLabels = true;
let selectedPlanet = null;
let hoveredPlanet = null;
let cameraTarget = null;
let cameraTransitioning = false;

const canvas = document.getElementById('solarCanvas');
const minimapCanvas = document.getElementById('minimapCanvas');
const minimapCtx = minimapCanvas.getContext('2d');

// ============ PREMIUM FEATURES ============

// ============ TEXTURE LOADER ============
const textureLoader = new THREE.TextureLoader();
const TEXTURE_EXISTS = {
    mercury: true, venus: true, earth: true, mars: true,
    jupiter: true, saturn: false, uranus: true, neptune: true,
    moon: true, earth_clouds: true, saturn_ring: true
};

function getPlanetTexture(key, config) {
    if (TEXTURE_EXISTS[key]) {
        return textureLoader.load('textures/' + key + '.jpg');
    }
    return createProceduralTexture(1024, 512, config, key);
}

// ============ PROCEDURAL TEXTURE GENERATOR (FALLBACK) ============
function createProceduralTexture(width, height, config, planetKey) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Base color fill
    const r = (config.base >> 16) & 255;
    const g = (config.base >> 8) & 255;
    const b = config.base & 255;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, width, height);

    // Add noise/grain
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 30;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    // Planet-specific surface features
    if (planetKey === 'earth') {
        // Continents
        const spotR = (config.spots >> 16) & 255;
        const spotG = (config.spots >> 8) & 255;
        const spotB = config.spots & 255;
        ctx.fillStyle = `rgb(${spotR},${spotG},${spotB})`;
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.ellipse(x, y, 20 + Math.random() * 40, 15 + Math.random() * 30, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
        // Ice caps
        ctx.fillStyle = `rgb(${(config.highlight >> 16) & 255},${(config.highlight >> 8) & 255},${config.highlight & 255})`;
        ctx.fillRect(0, 0, width, 15);
        ctx.fillRect(0, height - 15, width, 15);
        // Clouds
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.ellipse(x, y, 30 + Math.random() * 50, 8 + Math.random() * 12, Math.random() * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (planetKey === 'jupiter') {
        // bands
        const spotR = (config.spots >> 16) & 255;
        const spotG = (config.spots >> 8) & 255;
        const spotB = config.spots & 255;
        for (let y = 0; y < height; y += 12) {
            ctx.fillStyle = Math.random() > 0.5 ? `rgba(${spotR},${spotG},${spotB},0.4)` : `rgba(200,160,80,0.3)`;
            ctx.fillRect(0, y, width, 6 + Math.random() * 8);
        }
        // Great Red Spot
        ctx.fillStyle = 'rgba(180,60,20,0.7)';
        ctx.beginPath();
        ctx.ellipse(width * 0.65, height * 0.55, 25, 15, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (planetKey === 'saturn') {
        // Base gradient from equator to poles
        for (let y = 0; y < height; y++) {
            const lat = y / height;
            const eqDist = Math.abs(lat - 0.5) * 2;
            const r = 210 - 50 * eqDist + (Math.random() - 0.5) * 12;
            const g = 190 - 40 * eqDist + (Math.random() - 0.5) * 12;
            const b = 155 - 35 * eqDist + (Math.random() - 0.5) * 10;
            ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
            ctx.fillRect(0, y, width, 1);
        }
        // Atmospheric bands with varying colors
        const bandColors = [
            [225, 205, 170], [240, 225, 195], [200, 180, 145],
            [215, 195, 160], [185, 165, 130], [235, 215, 180],
            [210, 190, 155], [220, 205, 175], [195, 175, 140],
            [245, 230, 200], [205, 185, 150], [230, 210, 170]
        ];
        for (let i = 0; i < 60; i++) {
            const y = Math.random() * height;
            const band = bandColors[i % bandColors.length];
            const bw = 3 + Math.random() * 10;
            const alpha = 0.2 + Math.random() * 0.3;
            ctx.fillStyle = `rgba(${band[0]},${band[1]},${band[2]},${alpha})`;
            ctx.fillRect(0, y, width, bw);
        }
        // Polar hazes
        const poleGrad = ctx.createLinearGradient(0, 0, 0, height * 0.12);
        poleGrad.addColorStop(0, 'rgba(160,140,110,0.5)');
        poleGrad.addColorStop(1, 'rgba(160,140,110,0)');
        ctx.fillStyle = poleGrad;
        ctx.fillRect(0, 0, width, height * 0.12);
        ctx.save();
        ctx.translate(0, height);
        ctx.scale(1, -1);
        ctx.fillStyle = poleGrad;
        ctx.fillRect(0, 0, width, height * 0.12);
        ctx.restore();
    } else if (planetKey === 'mars') {
        // Surface features (craters, canyons)
        const spotR = (config.spots >> 16) & 255;
        const spotG = (config.spots >> 8) & 255;
        const spotB = config.spots & 255;
        ctx.fillStyle = `rgba(${spotR},${spotG},${spotB},0.5)`;
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 3 + Math.random() * 15;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        // Polar ice caps
        ctx.fillStyle = `rgba(220,200,180,0.6)`;
        ctx.fillRect(0, 0, width, 8);
        ctx.fillRect(0, height - 8, width, 8);
    } else if (planetKey === 'venus') {
        // Thick swirling clouds
        ctx.fillStyle = 'rgba(255,240,200,0.3)';
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.ellipse(x, y, 40 + Math.random() * 60, 10 + Math.random() * 15, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (planetKey === 'mercury') {
        // Heavy cratering
        ctx.fillStyle = 'rgba(60,60,60,0.4)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 2 + Math.random() * 8;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(180,170,150,0.3)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    } else if (planetKey === 'neptune') {
        // Dark storm spots
        ctx.fillStyle = 'rgba(30,40,100,0.4)';
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.ellipse(x, y, 15 + Math.random() * 20, 10 + Math.random() * 10, Math.random() * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        // Wispy clouds
        ctx.fillStyle = 'rgba(120,150,255,0.2)';
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.ellipse(x, y, 30 + Math.random() * 40, 5 + Math.random() * 8, Math.random() * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (planetKey === 'uranus') {
        // Subtle banding
        for (let y = 0; y < height; y += 15) {
            ctx.fillStyle = `rgba(100,200,220,${0.1 + Math.random() * 0.15})`;
            ctx.fillRect(0, y, width, 8);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

// ============ INIT ============
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(30, 40, 60);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 200;
    controls.enablePan = true;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    createLights();
    createStarfield();
    createNebula();
    createGlowRing();
    createSun();
    createAsteroidBelt();
    createPlanets();
    initSearch();
    initKeyboardShortcuts();
    startShootingStars();
    setupEvents();
    initSpaceAudio();

    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        showToast('Press ? for keyboard shortcuts');
    }, 2000);

    animate();
}

// ============ LIGHTS ============
function createLights() {
    scene.add(new THREE.AmbientLight(0x111122, 0.4));

    const sunLight = new THREE.PointLight(0xfff5e0, 2.5, 400);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    scene.add(new THREE.HemisphereLight(0x334466, 0x112233, 0.15));
}

// ============ STARFIELD ============
function createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = 400 + Math.random() * 600;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        const c = Math.random();
        if (c > 0.92) {
            colors[i3] = 0.6; colors[i3 + 1] = 0.7; colors[i3 + 2] = 1.0;
        } else if (c > 0.85) {
            colors[i3] = 1.0; colors[i3 + 1] = 0.9; colors[i3 + 2] = 0.7;
        } else if (c > 0.78) {
            colors[i3] = 1.0; colors[i3 + 1] = 0.6; colors[i3 + 2] = 0.4;
        } else {
            const b = 0.6 + Math.random() * 0.4;
            colors[i3] = b; colors[i3 + 1] = b; colors[i3 + 2] = b;
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true
    });

    scene.add(new THREE.Points(geometry, material));
}

// ============ NEBULA / COLORFUL STARFIELD ============
function createNebula() {
    const geo = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = 250 + Math.random() * 350;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
        positions[i3 + 2] = r * Math.cos(phi);

        const hue = 0.65 + Math.random() * 0.25;
        const c = new THREE.Color().setHSL(hue, 0.7, 0.08 + Math.random() * 0.08);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
        size: 2.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.18,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    scene.add(new THREE.Points(geo, mat));

    // Second nebula (warm tones)
    const geo2 = new THREE.BufferGeometry();
    const pos2 = new Float32Array(count * 3);
    const col2 = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = 300 + Math.random() * 300;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos2[i3] = r * Math.sin(phi) * Math.cos(theta);
        pos2[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4 + 60;
        pos2[i3 + 2] = r * Math.cos(phi);

        const hue = 0.0 + Math.random() * 0.12;
        const c = new THREE.Color().setHSL(hue, 0.8, 0.06 + Math.random() * 0.06);
        col2[i3] = c.r;
        col2[i3 + 1] = c.g;
        col2[i3 + 2] = c.b;
    }
    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    geo2.setAttribute('color', new THREE.BufferAttribute(col2, 3));
    const mat2 = new THREE.PointsMaterial({
        size: 3.0,
        vertexColors: true,
        transparent: true,
        opacity: 0.12,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    scene.add(new THREE.Points(geo2, mat2));
}

// ============ GLOW RING ON HOVER ============
function createSun() {
    // Animated sun using custom shader-like approach with multiple layers
    const sunGeo = new THREE.SphereGeometry(3, 64, 64);

    // Create sun texture procedurally
    const sunCanvas = document.createElement('canvas');
    sunCanvas.width = 512;
    sunCanvas.height = 256;
    const sCtx = sunCanvas.getContext('2d');

    // Gradient base
    const grad = sCtx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#ffaa00');
    grad.addColorStop(0.3, '#ffdd44');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(0.7, '#ffcc22');
    grad.addColorStop(1, '#ff8800');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 512, 256);

    // Solar granulation
    for (let i = 0; i < 500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const size = 2 + Math.random() * 8;
        const brightness = 200 + Math.random() * 55;
        sCtx.fillStyle = `rgba(${brightness},${brightness - 30},${brightness - 80},0.4)`;
        sCtx.beginPath();
        sCtx.arc(x, y, size, 0, Math.PI * 2);
        sCtx.fill();
    }

    // Sunspots
    sCtx.fillStyle = 'rgba(100,50,0,0.5)';
    for (let i = 0; i < 8; i++) {
        sCtx.beginPath();
        sCtx.arc(Math.random() * 512, Math.random() * 256, 3 + Math.random() * 8, 0, Math.PI * 2);
        sCtx.fill();
    }

    const sunTexture = new THREE.CanvasTexture(sunCanvas);

    const sunMat = new THREE.MeshBasicMaterial({
        map: sunTexture,
        color: 0xffcc44
    });

    sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    // Multiple glow layers
    const glowGeo = new THREE.SphereGeometry(3.8, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffaa22, transparent: true, opacity: 0.12, side: THREE.BackSide });
    sunGlow1 = new THREE.Mesh(glowGeo, glowMat);
    scene.add(sunGlow1);

    const glow2Geo = new THREE.SphereGeometry(5, 32, 32);
    const glow2Mat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.06, side: THREE.BackSide });
    sunGlow2 = new THREE.Mesh(glow2Geo, glow2Mat);
    scene.add(sunGlow2);

    // Corona particles
    const coronaGeo = new THREE.BufferGeometry();
    const coronaCount = 400;
    const coronaPos = new Float32Array(coronaCount * 3);
    const coronaSizes = new Float32Array(coronaCount);
    for (let i = 0; i < coronaCount; i++) {
        const r = 3.3 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        coronaPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        coronaPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        coronaPos[i * 3 + 2] = r * Math.cos(phi);
        coronaSizes[i] = Math.random() * 0.2 + 0.05;
    }
    coronaGeo.setAttribute('position', new THREE.BufferAttribute(coronaPos, 3));
    const coronaMat = new THREE.PointsMaterial({ color: 0xffcc44, size: 0.18, transparent: true, opacity: 0.7, sizeAttenuation: true });
    sunCorona = new THREE.Points(coronaGeo, coronaMat);
    scene.add(sunCorona);

    // Sun label
    createPlanetLabel('sun', 'SUN', sun);
}

// ============ ASTEROID BELT ============
function createAsteroidBelt() {
    const asteroidCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(asteroidCount * 3);
    const colors = new Float32Array(asteroidCount * 3);

    for (let i = 0; i < asteroidCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 27 + Math.random() * 4;
        const height = (Math.random() - 0.5) * 2;

        positions[i * 3] = Math.cos(angle) * dist;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * dist;

        const shade = 0.3 + Math.random() * 0.4;
        colors[i * 3] = shade;
        colors[i * 3 + 1] = shade * 0.9;
        colors[i * 3 + 2] = shade * 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
    });

    asteroidBelt = new THREE.Points(geometry, material);
    scene.add(asteroidBelt);
}

// ============ PLANET LABELS ============
function createPlanetLabel(key, text, mesh) {
    const labelDiv = document.createElement('div');
    labelDiv.className = 'planet-label-3d';
    labelDiv.textContent = text;
    labelDiv.style.cssText = `
        position: fixed;
        font-family: 'Orbitron', monospace;
        font-size: 9px;
        letter-spacing: 2px;
        color: rgba(200,220,255,0.8);
        pointer-events: none;
        z-index: 50;
        text-shadow: 0 0 8px rgba(79,195,247,0.5);
        transition: opacity 0.3s;
    `;
    document.body.appendChild(labelDiv);
    orbitLines[key + '_label'] = { element: labelDiv, mesh };
}

function updateLabels() {
    Object.keys(planets).forEach(key => {
        const labelData = orbitLines[key + '_label'];
        if (!labelData) return;

        if (!showLabels) {
            labelData.element.style.opacity = '0';
            return;
        }

        const pos = new THREE.Vector3();
        pos.copy(planets[key].mesh.position);
        pos.y += planets[key].data.radius + 0.5;

        pos.project(camera);
        const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;

        if (pos.z < 1) {
            labelData.element.style.opacity = '1';
            labelData.element.style.left = x + 'px';
            labelData.element.style.top = (y - 15) + 'px';
            labelData.element.style.transform = 'translate(-50%, -100%)';
        } else {
            labelData.element.style.opacity = '0';
        }
    });

    // Sun label
    const sunLabel = orbitLines['sun_label'];
    if (sunLabel) {
        if (!showLabels) {
            sunLabel.element.style.opacity = '0';
        } else {
            const pos = new THREE.Vector3(0, 4.5, 0).project(camera);
            const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
            if (pos.z < 1) {
                sunLabel.element.style.opacity = '1';
                sunLabel.element.style.left = x + 'px';
                sunLabel.element.style.top = (y - 10) + 'px';
                sunLabel.element.style.transform = 'translate(-50%, -100%)';
            } else {
                sunLabel.element.style.opacity = '0';
            }
        }
    }
}

// ============ PLANETS ============
function createPlanets() {
    Object.keys(PLANETS).forEach(key => {
        const data = PLANETS[key];

        const group = new THREE.Group();
        scene.add(group);

        // Load planet texture (file or procedural fallback)
        const texture = getPlanetTexture(key, data.texture);

        const geo = new THREE.SphereGeometry(data.radius, 64, 64);
        const mat = new THREE.MeshStandardMaterial({
            map: texture,
            emissive: data.emissive,
            emissiveIntensity: 0.15,
            roughness: 0.8,
            metalness: 0.05
        });

        // Bump/normal maps for cratered bodies
        if (key === 'mercury' || key === 'mars') {
            const bumpCanvas = document.createElement('canvas');
            bumpCanvas.width = 512;
            bumpCanvas.height = 256;
            const bCtx = bumpCanvas.getContext('2d');
            bCtx.fillStyle = '#808080';
            bCtx.fillRect(0, 0, 512, 256);
            const craterCount = key === 'mercury' ? 300 : 150;
            for (let i = 0; i < craterCount; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 256;
                const size = 2 + Math.random() * (key === 'mercury' ? 14 : 10);
                const brightness = 60 + Math.random() * 100;
                bCtx.fillStyle = 'rgb(' + brightness + ',' + brightness + ',' + brightness + ')';
                bCtx.beginPath();
                bCtx.arc(x, y, size, 0, Math.PI * 2);
                bCtx.fill();
            }
            if (key === 'mercury') {
                for (let i = 0; i < 30; i++) {
                    const x = Math.random() * 512;
                    const y = Math.random() * 256;
                    bCtx.strokeStyle = 'rgba(180,160,140,0.3)';
                    bCtx.lineWidth = 1;
                    bCtx.beginPath();
                    bCtx.arc(x, y, 3 + Math.random() * 10, 0, Math.PI * 2);
                    bCtx.stroke();
                }
            }
            mat.bumpMap = new THREE.CanvasTexture(bumpCanvas);
            mat.bumpScale = key === 'mercury' ? 0.06 : 0.04;
        }

        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.x = data.distance;
        mesh.rotation.z = THREE.MathUtils.degToRad(data.axialTilt);
        mesh.userData = { planetId: key };
        group.add(mesh);

        // Saturn special: smoother, more emissive glow
        if (key === 'saturn') {
            mat.roughness = 0.6;
            mat.metalness = 0.02;
            mat.emissiveIntensity = 0.2;
        }

        // Earth special: cloud layer + night lights
        if (key === 'earth') {
            data._hasClouds = TEXTURE_EXISTS['earth_clouds'];
            if (data._hasClouds) {
                const cloudGeo2 = new THREE.SphereGeometry(data.radius * 1.015, 64, 64);
                const cloudMat2 = new THREE.MeshBasicMaterial({
                    map: textureLoader.load('textures/earth_clouds.jpg'),
                    transparent: true,
                    opacity: 0.35,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.DoubleSide
                });
                const cloudMesh2 = new THREE.Mesh(cloudGeo2, cloudMat2);
                cloudMesh2.position.copy(mesh.position);
                cloudMesh2.userData = { planetId: key, isCloud: true };
                group.add(cloudMesh2);
            }
        }

        // Atmosphere glow
        if (data.atmosphere) {
            const atmosGeo = new THREE.SphereGeometry(data.radius * 1.18, 32, 32);
            const atmosMat = new THREE.MeshBasicMaterial({
                color: data.atmosphere,
                transparent: true,
                opacity: 0.12,
                side: THREE.BackSide
            });
            const atmos = new THREE.Mesh(atmosGeo, atmosMat);
            atmos.position.copy(mesh.position);
            group.add(atmos);
        }

        // Rings
        if (data.hasRings && data.ringConfig) {
            const rc = data.ringConfig;
            const ringColors = data.ringColors || [data.ringColor || 0xc8b88a];

            if (key === 'saturn') {
                // Saturn: always use multi-band rings for best appearance
                const gapBands = [1, 4, 7, 10];
                for (let b = 0; b < rc.bands; b++) {
                    const t = b / rc.bands;
                    const tNext = (b + 1) / rc.bands;
                    const inner = rc.inner + (rc.outer - rc.inner) * t;
                    const outer = rc.inner + (rc.outer - rc.inner) * tNext;

                    // Cassini-like gaps
                    const isGap = gapBands.includes(b);
                    const bandWidth = (outer - inner) / (rc.outer - rc.inner);

                    const color = ringColors[b % ringColors.length];
                    const opacity = isGap ? 0.05 : rc.opacity * (0.4 + 0.6 * (1 - t));

                    const ringGeo2 = new THREE.RingGeometry(inner, outer, 128);
                    const ringMat2 = new THREE.MeshBasicMaterial({
                        color: color,
                        transparent: true,
                        opacity: opacity,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        blending: THREE.AdditiveBlending
                    });
                    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
                    ring2.position.copy(mesh.position);
                    ring2.rotation.x = Math.PI * 0.5;
                    group.add(ring2);
                }
                // Outer diffuse ring
                const outerRingGeo = new THREE.RingGeometry(rc.outer * 0.8, rc.outer * 1.15, 128);
                const outerRingMat = new THREE.MeshBasicMaterial({
                    color: 0xa89878,
                    transparent: true,
                    opacity: 0.08,
                    side: THREE.DoubleSide,
                    depthWrite: false
                });
                const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
                outerRing.position.copy(mesh.position);
                outerRing.rotation.x = Math.PI * 0.5;
                group.add(outerRing);
            } else {
                for (let b = 0; b < rc.bands; b++) {
                    const inner = rc.inner + (rc.outer - rc.inner) * (b / rc.bands);
                    const outer = rc.inner + (rc.outer - rc.inner) * ((b + 1) / rc.bands);
                    const ringGeo2 = new THREE.RingGeometry(inner, outer, 96);
                    const ringMat2 = new THREE.MeshBasicMaterial({
                        color: data.ringColor || 0xc8b88a,
                        transparent: true,
                        opacity: rc.opacity * (1 - b * 0.15),
                        side: THREE.DoubleSide
                    });
                    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
                    ring2.position.copy(mesh.position);
                    ring2.rotation.x = Math.PI * 0.5;
                    if (key === 'uranus') ring2.rotation.z = Math.PI * 0.45;
                    group.add(ring2);
                }
            }
        }

        // Moons
        data.moonsData.forEach(moonData => {
            const moonGeo = new THREE.SphereGeometry(moonData.radius, 24, 24);
            const moonMat = new THREE.MeshStandardMaterial({
                color: moonData.color,
                roughness: 0.85,
                metalness: 0.05
            });
            // Use moon texture for Earth's moon
            if (key === 'earth' && moonData.name === 'Moon' && TEXTURE_EXISTS['moon']) {
                moonMat.map = textureLoader.load('textures/moon.jpg');
                moonMat.bumpMap = moonMat.map;
                moonMat.bumpScale = 0.02;
            }
            const moonMesh = new THREE.Mesh(moonGeo, moonMat);
            moonMesh.position.x = mesh.position.x + moonData.distance;
            moonMesh.castShadow = true;
            moonMesh.userData = { planetId: key, moonName: moonData.name };
            group.add(moonMesh);
        });

        // Orbit line
        const orbitPoints = [];
        for (let i = 0; i <= 256; i++) {
            const angle = (i / 256) * Math.PI * 2;
            orbitPoints.push(new THREE.Vector3(
                Math.cos(angle) * data.distance,
                0,
                Math.sin(angle) * data.distance
            ));
        }
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMat = new THREE.LineBasicMaterial({
            color: 0x4fc3f7,
            transparent: true,
            opacity: 0.1
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        scene.add(orbitLine);
        orbitLines[key] = orbitLine;

        // Planet label
        createPlanetLabel(key, data.name.toUpperCase(), mesh);

        planets[key] = {
            mesh,
            group,
            data,
            angle: Math.random() * Math.PI * 2,
            moonAngles: data.moonsData.map(() => Math.random() * Math.PI * 2)
        };
    });
}

// ============ EVENTS ============
function setupEvents() {
    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('dblclick', onDoubleClick);

    document.getElementById('btnOrbits').addEventListener('click', toggleOrbits);
    document.getElementById('btnLabels').addEventListener('click', toggleLabels);
    document.getElementById('btnPause').addEventListener('click', togglePause);
    document.getElementById('speedSlider').addEventListener('input', onSpeedChange);
    document.getElementById('closeInfo').addEventListener('click', closeInfoPanel);
    document.getElementById('btnSound').addEventListener('click', toggleSound);
    document.getElementById('btnScreenshot').addEventListener('click', takeScreenshot);
    document.getElementById('btnFullscreen').addEventListener('click', toggleFullscreen);
    document.getElementById('kbdClose').addEventListener('click', () => {
        document.getElementById('kbdModal').classList.add('hidden');
    });
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const meshes = Object.values(planets).map(p => p.mesh);
    const intersects = raycaster.intersectObjects(meshes);
    const hoverLabel = document.getElementById('hoverLabel');

    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const planetId = hit.userData.planetId;
        const planet = planets[planetId];

        if (hoveredPlanet !== planetId) {
            hoveredPlanet = planetId;
            canvas.style.cursor = 'pointer';
            hoverLabel.textContent = planet.data.name.toUpperCase();
            hoverLabel.classList.remove('hidden');
        }
        hoverLabel.style.left = e.clientX + 15 + 'px';
        hoverLabel.style.top = e.clientY - 10 + 'px';
    } else {
        if (hoveredPlanet) {
            hoveredPlanet = null;
            canvas.style.cursor = 'default';
            hoverLabel.classList.add('hidden');
        }
    }
}

function onClick(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const meshes = Object.values(planets).map(p => p.mesh);
    const sunHit = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    scene.add(sunHit);

    // Close search if open
    const searchOverlay = document.getElementById('searchOverlay');
    if (!searchOverlay.classList.contains('hidden')) {
        searchOverlay.classList.add('hidden');
        searchActive = false;
        document.getElementById('searchInput').blur();
    }

    const intersects = raycaster.intersectObjects([...meshes, sunHit]);

    if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit === sunHit) {
            showSunInfo();
            flyToCamera(new THREE.Vector3(0, 0, 0), 12);
        } else {
            showPlanetInfo(hit.userData.planetId);
            const p = planets[hit.userData.planetId];
            flyToCamera(new THREE.Vector3(p.mesh.position.x, 0, p.mesh.position.z), p.data.radius * 6);
        }
    } else {
        closeInfoPanel();
    }

    scene.remove(sunHit);
}

function onDoubleClick(e) {
    onClick(e);
}

function flyToCamera(target, distance) {
    cameraTarget = { target, distance };
    cameraTransitioning = true;
}

function showSunInfo() {
    const panel = document.getElementById('planetInfo');
    document.getElementById('infoIcon').style.background = 'radial-gradient(circle at 30% 30%, #fff 0%, #ffdd44 40%, #ff8800 100%)';
    document.getElementById('infoName').textContent = 'The Sun';
    document.getElementById('infoType').textContent = 'G-Type Main-Sequence Star (G2V)';
    document.getElementById('infoDist').textContent = 'Center';
    document.getElementById('infoOrbit').textContent = 'N/A';
    document.getElementById('infoDiam').textContent = '1,391,000 km';
    document.getElementById('infoMoons').textContent = '8 planets';
    document.getElementById('infoDay').textContent = '25.4 days (equator)';
    document.getElementById('infoTemp').textContent = '5,500°C surface';
    document.getElementById('infoGravity').textContent = '274 m/s²';
    document.getElementById('infoMass').textContent = '1.99 × 10³⁰ kg';
    document.getElementById('infoDesc').textContent = 'The Sun is the star at the center of our Solar System. It is a nearly perfect ball of hot plasma, heated to incandescence by nuclear fusion reactions in its core, radiating energy mainly as visible light, ultraviolet, and infrared radiation. It is by far the largest object in the Solar System.';
    document.getElementById('infoFact').textContent = 'The Sun contains 99.86% of the total mass of the Solar System. About 1.3 million Earths could fit inside it. Light from the Sun takes about 8 minutes to reach Earth.';
    panel.classList.remove('hidden');
    selectedPlanet = 'sun';
    playPlanetSound('sun');
}

function showPlanetInfo(planetId) {
    const data = PLANETS[planetId];
    const panel = document.getElementById('planetInfo');

    const gradients = {
        mercury: 'radial-gradient(circle at 30% 30%, #c4b5a0 0%, #8c7e6d 50%, #5a5a5a 100%)',
        venus: 'radial-gradient(circle at 30% 30%, #fff0c0 0%, #e8cda0 50%, #8b7355 100%)',
        earth: 'radial-gradient(circle at 30% 30%, #88ccff 0%, #4a90d9 40%, #1a5276 100%)',
        mars: 'radial-gradient(circle at 30% 30%, #d4a574 0%, #c1440e 50%, #7b241c 100%)',
        jupiter: 'radial-gradient(circle at 30% 30%, #e8c88a 0%, #c88b3a 40%, #6e4b1e 100%)',
        saturn: 'radial-gradient(circle at 30% 30%, #f5ecc8 0%, #e8d5a3 50%, #8b7d5a 100%)',
        uranus: 'radial-gradient(circle at 30% 30%, #b0e8f0 0%, #73c2d0 50%, #2e6b75 100%)',
        neptune: 'radial-gradient(circle at 30% 30%, #7799ff 0%, #3f51b5 50%, #1a237e 100%)'
    };

    document.getElementById('infoIcon').style.background = gradients[planetId];
    document.getElementById('infoName').textContent = data.name;
    document.getElementById('infoType').textContent = data.type;
    document.getElementById('infoDist').textContent = data.stats.dist;
    document.getElementById('infoOrbit').textContent = data.stats.orbit;
    document.getElementById('infoDiam').textContent = data.stats.diam;
    document.getElementById('infoMoons').textContent = data.stats.moons;
    document.getElementById('infoDay').textContent = data.stats.day;
    document.getElementById('infoTemp').textContent = data.stats.temp;
    document.getElementById('infoGravity').textContent = data.stats.gravity;
    document.getElementById('infoMass').textContent = data.stats.mass;
    document.getElementById('infoDesc').textContent = data.description;
    document.getElementById('infoFact').textContent = data.fact;
    panel.classList.remove('hidden');
    selectedPlanet = planetId;
    playPlanetSound(planetId);
}

function closeInfoPanel() {
    document.getElementById('planetInfo').classList.add('hidden');
    selectedPlanet = null;
    controls.target.set(0, 0, 0);
    stopPlanetSound();
}

function toggleOrbits() {
    showOrbits = !showOrbits;
    document.getElementById('btnOrbits').classList.toggle('active', showOrbits);
    Object.keys(orbitLines).forEach(key => {
        if (orbitLines[key] instanceof THREE.Line) {
            orbitLines[key].material.opacity = showOrbits ? 0.1 : 0;
        }
    });
}

function toggleLabels() {
    showLabels = !showLabels;
    document.getElementById('btnLabels').classList.toggle('active', showLabels);
}

function togglePause() {
    isPlaying = !isPlaying;

    const pauseIcon = document.getElementById('pauseIcon');
    const playIcon = document.getElementById('playIcon');
    const pauseLabel = document.getElementById('pauseLabel');
    const btn = document.getElementById('btnPause');

    if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
    if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
    if (pauseLabel) pauseLabel.textContent = isPlaying ? 'Pause' : 'Play';
    if (btn) {
        btn.classList.toggle('active', !isPlaying);
        btn.setAttribute('aria-pressed', !isPlaying);
    }
}

function onSpeedChange(e) {
    speedMultiplier = parseFloat(e.target.value) / 10;
    document.getElementById('speedVal').textContent = speedMultiplier.toFixed(1) + 'x';
}

// ============ MINIMAP ============
function drawMinimap() {
    const w = 180, h = 180;
    minimapCtx.clearRect(0, 0, w, h);

    minimapCtx.fillStyle = 'rgba(3,0,20,0.92)';
    minimapCtx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2, scale = 1.1;

    // Sun
    minimapCtx.beginPath();
    minimapCtx.arc(cx, cy, 4, 0, Math.PI * 2);
    minimapCtx.fillStyle = '#ffdd44';
    minimapCtx.fill();

    // Asteroid belt
    minimapCtx.beginPath();
    minimapCtx.arc(cx, cy, 27 * scale, 0, Math.PI * 2);
    minimapCtx.arc(cx, cy, 31 * scale, 0, Math.PI * 2, true);
    minimapCtx.fillStyle = 'rgba(100,90,80,0.15)';
    minimapCtx.fill();

    Object.keys(planets).forEach(key => {
        const planet = planets[key];
        const data = planet.data;
        const px = cx + Math.cos(planet.angle) * data.distance * scale;
        const py = cy + Math.sin(planet.angle) * data.distance * scale;

        // Orbit
        minimapCtx.beginPath();
        minimapCtx.arc(cx, cy, data.distance * scale, 0, Math.PI * 2);
        minimapCtx.strokeStyle = selectedPlanet === key ? 'rgba(79,195,247,0.4)' : 'rgba(79,195,247,0.12)';
        minimapCtx.lineWidth = selectedPlanet === key ? 1 : 0.5;
        minimapCtx.stroke();

        // Planet
        minimapCtx.beginPath();
        minimapCtx.arc(px, py, Math.max(2, data.radius * 1.5), 0, Math.PI * 2);
        minimapCtx.fillStyle = '#' + data.color.toString(16).padStart(6, '0');
        minimapCtx.fill();

        if (selectedPlanet === key) {
            minimapCtx.beginPath();
            minimapCtx.arc(px, py, 7, 0, Math.PI * 2);
            minimapCtx.strokeStyle = '#4fc3f7';
            minimapCtx.lineWidth = 1.5;
            minimapCtx.stroke();
        }

        // Moons on minimap
        planet.moonAngles.forEach((mAngle, mi) => {
            const md = data.moonsData[mi];
            if (!md) return;
            const mx = px + Math.cos(mAngle) * md.distance * 3;
            const my = py + Math.sin(mAngle) * md.distance * 3;
            minimapCtx.beginPath();
            minimapCtx.arc(mx, my, 1.5, 0, Math.PI * 2);
            minimapCtx.fillStyle = '#' + md.color.toString(16).padStart(6, '0');
            minimapCtx.fill();
        });
    });

    // Camera
    const camAngle = Math.atan2(camera.position.z, camera.position.x);
    const camDist = Math.min(Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2) * scale, 80);
    const camX = cx + Math.cos(camAngle) * camDist;
    const camY = cy + Math.sin(camAngle) * camDist;

    minimapCtx.beginPath();
    minimapCtx.moveTo(camX - 3, camY + 4);
    minimapCtx.lineTo(camX, camY - 5);
    minimapCtx.lineTo(camX + 3, camY + 4);
    minimapCtx.closePath();
    minimapCtx.fillStyle = '#ff4444';
    minimapCtx.fill();
}

// ============ ANIMATION ============
function animate() {
    requestAnimationFrame(animate);

    if (isPlaying) {
        elapsedTime += 0.016; // ~60fps per frame

        // Sun rotation & corona
        if (sun) {
            sun.rotation.y += 0.001 * speedMultiplier;
            if (sunCorona) {
                sunCorona.rotation.y += 0.0005 * speedMultiplier;
            }
        }

        // Asteroid belt slow rotation
        if (asteroidBelt) {
            asteroidBelt.rotation.y += 0.0002 * speedMultiplier;
        }
    }

    // Sun pulse & glow (uses accumulated time so it freezes when paused)
    if (sun) {
        const pulse = 1 + Math.sin(elapsedTime * 2) * 0.02;
        sun.scale.set(pulse, pulse, pulse);
        if (sunGlow1) {
            const g1 = 1 + Math.sin(elapsedTime * 1.5) * 0.03;
            sunGlow1.scale.set(g1, g1, g1);
        }
    }

    // Planets
    if (isPlaying) {
        Object.keys(planets).forEach(key => {
            const planet = planets[key];
            planet.angle += planet.data.orbitSpeed * 0.005 * speedMultiplier;

            const px = Math.cos(planet.angle) * planet.data.distance;
            const pz = Math.sin(planet.angle) * planet.data.distance;

            planet.mesh.position.x = px;
            planet.mesh.position.z = pz;
            planet.mesh.rotation.y += planet.data.rotationSpeed * speedMultiplier;

            // Cloud layer rotation (Earth)
            if (key === 'earth' && planet.data._hasClouds) {
                planet.group.children[1].rotation.y += planet.data.rotationSpeed * 1.3 * speedMultiplier;
            }

            // Update children positions (clouds, atmosphere, rings, moons)
            let childIdx = 1;
            if (key === 'earth' && planet.data._hasClouds) {
                planet.group.children[childIdx].position.set(px, 0, pz);
                childIdx++;
            }
            if (planet.data.atmosphere) {
                planet.group.children[childIdx].position.set(px, 0, pz);
                childIdx++;
            }
            if (planet.data.hasRings && planet.data.ringConfig) {
                const ringCount = (key === 'saturn') ? planet.data.ringConfig.bands + 1 : planet.data.ringConfig.bands;
                for (let b = 0; b < ringCount; b++) {
                    planet.group.children[childIdx].position.set(px, 0, pz);
                    childIdx++;
                }
            }
            planet.data.moonsData.forEach((md, mi) => {
                planet.moonAngles[mi] += md.speed * speedMultiplier;
                const moonMesh = planet.group.children[childIdx];
                if (moonMesh) {
                    moonMesh.position.x = px + Math.cos(planet.moonAngles[mi]) * md.distance;
                    moonMesh.position.z = pz + Math.sin(planet.moonAngles[mi]) * md.distance;
                    moonMesh.position.y = Math.sin(planet.moonAngles[mi] * 0.5) * 0.3;
                    moonMesh.rotation.y += 0.01 * speedMultiplier;
                }
                childIdx++;
            });
        });
    }

    // Orbit highlight
    Object.keys(orbitLines).forEach(key => {
        if (orbitLines[key] instanceof THREE.Line && showOrbits) {
            orbitLines[key].material.opacity = selectedPlanet === key ? 0.3 : 0.1;
        }
    });

    // Camera transitions
    if (cameraTransitioning && cameraTarget) {
        const currentDist = camera.position.distanceTo(cameraTarget.target);
        controls.target.lerp(cameraTarget.target, 0.04);

        if (selectedPlanet && selectedPlanet !== 'sun' && planets[selectedPlanet]) {
            const p = planets[selectedPlanet];
            const idealPos = new THREE.Vector3(
                p.mesh.position.x + cameraTarget.distance * 0.5,
                cameraTarget.distance * 0.4,
                p.mesh.position.z + cameraTarget.distance * 0.5
            );
            camera.position.lerp(idealPos, 0.03);
        } else if (selectedPlanet === 'sun') {
            const idealPos = new THREE.Vector3(8, 6, 8);
            camera.position.lerp(idealPos, 0.03);
        }

        if (currentDist < cameraTarget.distance * 0.6) {
            cameraTransitioning = false;
        }
    } else if (selectedPlanet && selectedPlanet !== 'sun' && planets[selectedPlanet]) {
        const p = planets[selectedPlanet];
        controls.target.lerp(new THREE.Vector3(p.mesh.position.x, 0, p.mesh.position.z), 0.03);
    } else if (selectedPlanet === 'sun') {
        controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.03);
    }

    controls.update();
    renderer.render(scene, camera);
    updateLabels();
    updateGlowRing();
    drawMinimap();
}

// ============ START ============
init();
