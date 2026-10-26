// solar-system-3d — search, keyboard shortcuts, toast, screenshot, fullscreen (extracted from app.js 2026-10-26)

let searchActive = false;
let searchResultIndex = -1;

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchResults = document.getElementById('searchResults');

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.add('hidden');
            searchActive = false;
            searchInput.blur();
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            searchResultIndex = -1;
            return;
        }

        const matches = PLANET_SEARCH_LIST.filter(p =>
            p.name.toLowerCase().includes(query) || p.id.includes(query)
        );

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No planets found</div>';
            searchResults.classList.add('active');
            searchResultIndex = -1;
            return;
        }

        searchResults.innerHTML = matches.map((p, i) => {
            const colors = { sun: '#ffdd44', mercury: '#b0b0b0', venus: '#e8cda0', earth: '#4a90d9', mars: '#c1440e', jupiter: '#c88b3a', saturn: '#e8d5a3', uranus: '#73c2d0', neptune: '#3f51b5' };
            return `<div class="search-result-item" data-index="${i}" data-id="${p.id}">
                <span class="search-result-dot" style="background:${colors[p.id] || '#fff'}"></span>
                <span class="search-result-name">${p.name}</span>
                <span class="search-result-type">${p.type}</span>
            </div>`;
        }).join('');
        searchResults.classList.add('active');
        searchResultIndex = -1;

        document.querySelectorAll('.search-result-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                searchInput.value = '';
                searchResults.classList.remove('active');
                searchOverlay.classList.add('hidden');
                searchActive = false;
                focusOnPlanet(id);
            });
            el.addEventListener('mouseenter', () => {
                document.querySelectorAll('.search-result-item').forEach(e => e.classList.remove('highlighted'));
                el.classList.add('highlighted');
                searchResultIndex = parseInt(el.getAttribute('data-index'));
            });
        });
    });

    searchInput.addEventListener('keydown', (e) => {
        const items = document.querySelectorAll('.search-result-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            searchResultIndex = Math.min(searchResultIndex + 1, items.length - 1);
            highlightSearchItem(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            searchResultIndex = Math.max(searchResultIndex - 1, 0);
            highlightSearchItem(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const highlighted = document.querySelector('.search-result-item.highlighted');
            if (highlighted) {
                highlighted.click();
            }
        }
    });
}

function highlightSearchItem(items) {
    items.forEach(e => e.classList.remove('highlighted'));
    if (items[searchResultIndex]) {
        items[searchResultIndex].classList.add('highlighted');
        items[searchResultIndex].scrollIntoView({ block: 'nearest' });
    }
}

function focusOnPlanet(id) {
    if (id === 'sun') {
        showSunInfo();
        flyToCamera(new THREE.Vector3(0, 0, 0), 12);
    } else if (planets[id]) {
        showPlanetInfo(id);
        const p = planets[id];
        flyToCamera(new THREE.Vector3(p.mesh.position.x, 0, p.mesh.position.z), p.data.radius * 6);
    }
    showToast('Navigating to ' + (id === 'sun' ? 'the Sun' : PLANETS[id]?.name || id));
}

// ============ KEYBOARD SHORTCUTS ============
function initKeyboardShortcuts() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');

    document.addEventListener('keydown', (e) => {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
            if (e.key === 'Escape') {
                e.target.blur();
                searchOverlay.classList.add('hidden');
                searchActive = false;
            }
            return;
        }

        switch (e.key) {
            case ' ':
                e.preventDefault();
                togglePause();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 's':
            case 'S':
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    takeScreenshot();
                }
                break;
            case '/':
                e.preventDefault();
                searchOverlay.classList.remove('hidden');
                searchInput.value = '';
                searchInput.focus();
                document.getElementById('searchResults').classList.remove('active');
                searchActive = true;
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                resetCamera();
                break;
            case 'o':
            case 'O':
                e.preventDefault();
                if (document.getElementById('btnOrbits')) {
                    document.getElementById('btnOrbits').click();
                    showToast('Orbits ' + (showOrbits ? 'On' : 'Off'));
                }
                break;
            case 'l':
            case 'L':
                e.preventDefault();
                if (document.getElementById('btnLabels')) {
                    document.getElementById('btnLabels').click();
                    showToast('Labels ' + (showLabels ? 'On' : 'Off'));
                }
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                document.getElementById('btnSound').click();
                break;
            case '?':
                e.preventDefault();
                document.getElementById('kbdModal').classList.toggle('hidden');
                break;
            case 'Escape':
                if (!document.getElementById('kbdModal').classList.contains('hidden')) {
                    document.getElementById('kbdModal').classList.add('hidden');
                } else if (!document.getElementById('searchOverlay').classList.contains('hidden')) {
                    document.getElementById('searchOverlay').classList.add('hidden');
                    searchActive = false;
                    document.getElementById('searchInput').blur();
                } else if (!document.getElementById('planetInfo').classList.contains('hidden')) {
                    closeInfoPanel();
                }
                break;
            case '+':
            case '=':
                e.preventDefault();
                adjustSpeed(0.1);
                break;
            case '-':
            case '_':
                e.preventDefault();
                adjustSpeed(-0.1);
                break;
        }

        if (e.key >= '1' && e.key <= '8') {
            const keys = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
            const idx = parseInt(e.key) - 1;
            if (keys[idx] && planets[keys[idx]]) {
                focusOnPlanet(keys[idx]);
            }
        }
    });
}

function adjustSpeed(delta) {
    const slider = document.getElementById('speedSlider');
    let val = parseFloat(slider.value) + delta * 10;
    val = Math.max(0, Math.min(50, val));
    slider.value = val;
    slider.dispatchEvent(new Event('input'));
    showToast('Speed: ' + (val / 10).toFixed(1) + 'x');
}

function resetCamera() {
    closeInfoPanel();
    cameraTransitioning = true;
    cameraTarget = { target: new THREE.Vector3(0, 0, 0), distance: 40 };
    showToast('Camera reset');
}

// ============ FULLSCREEN ============
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
}

// Fullscreen change handler
document.addEventListener('fullscreenchange', updateFSIcon);
document.addEventListener('webkitfullscreenchange', updateFSIcon);

function updateFSIcon() {
    const icon = document.getElementById('fsIcon');
    if (!icon) return;
    if (document.fullscreenElement) {
        icon.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>';
    } else {
        icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';
    }
}

// ============ SCREENSHOT ============
function takeScreenshot() {
    renderer.render(scene, camera);
    const link = document.createElement('a');
    link.download = 'solar-system-' + new Date().toISOString().slice(0, 19).replace(/[:-]/g, '') + '.png';
    link.href = renderer.domElement.toDataURL('image/png');
    link.click();
    showToast('Screenshot saved!');
}

// ============ TOAST ============
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.add('hidden'), 2500);
}

// ============ AMBIENT SPACE AUDIO ============
