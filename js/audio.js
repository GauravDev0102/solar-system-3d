// solar-system-3d — ambient + per-planet audio engine (extracted from app.js 2026-10-26)

let spaceAudioCtx = null;
let spaceAudioGain = null;
let spaceAudioOsc1 = null;
let spaceAudioOsc2 = null;
let isSoundEnabled = true;
let currentPlanetSound = null;

function initSpaceAudio() {
    try {
        spaceAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Main drone oscillator
        spaceAudioOsc1 = spaceAudioCtx.createOscillator();
        spaceAudioOsc1.type = 'sine';
        spaceAudioOsc1.frequency.value = 55;

        // Second detuned oscillator for richness
        spaceAudioOsc2 = spaceAudioCtx.createOscillator();
        spaceAudioOsc2.type = 'sine';
        spaceAudioOsc2.frequency.value = 57.5;

        // Sub-bass oscillator
        const osc3 = spaceAudioCtx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.value = 27.5;

        // Filter
        const filter = spaceAudioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 0.5;

        // Gain
        spaceAudioGain = spaceAudioCtx.createGain();
        spaceAudioGain.gain.value = 0.08;

        // LFO for subtle modulation
        const lfo = spaceAudioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.15;
        const lfoGain = spaceAudioCtx.createGain();
        lfoGain.gain.value = 10;
        lfo.connect(lfoGain);
        lfoGain.connect(spaceAudioOsc1.frequency);
        lfoGain.connect(spaceAudioOsc2.frequency);

        // Reverb-like effect using delay
        const delay = spaceAudioCtx.createDelay(1.0);
        delay.delayTime.value = 0.3;
        const delayGain = spaceAudioCtx.createGain();
        delayGain.gain.value = 0.3;

        // Connect: osc -> filter -> gain -> destination
        spaceAudioOsc1.connect(filter);
        spaceAudioOsc2.connect(filter);
        osc3.connect(filter);
        filter.connect(spaceAudioGain);
        spaceAudioGain.connect(spaceAudioCtx.destination);

        // Feedback delay
        spaceAudioGain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(spaceAudioCtx.destination);
        delayGain.connect(delay);

        lfo.start();
        spaceAudioOsc1.start();
        spaceAudioOsc2.start();
        osc3.start();

        if (spaceAudioCtx.state === 'suspended') {
            spaceAudioCtx.resume();
        }
    } catch (e) {
        console.warn('WebAudio not available');
        isSoundEnabled = false;
    }
}

function toggleSound() {
    if (!spaceAudioCtx) return;
    isSoundEnabled = !isSoundEnabled;
    if (spaceAudioGain) {
        spaceAudioGain.gain.value = isSoundEnabled ? 0.08 : 0;
    }
    document.getElementById('btnSound').classList.toggle('active', isSoundEnabled);
    showToast(isSoundEnabled ? 'Space ambient sound on' : 'Sound muted');
}

// ============ PLANET SOUNDS ============

function playPlanetSound(planetId) {
    if (!spaceAudioCtx) return;
    if (currentPlanetSound) {
        try { currentPlanetSound.stop(); } catch(e) {}
        currentPlanetSound = null;
    }
    const profile = PLANET_SOUND_PROFILES[planetId];
    if (!profile) return;
    if (spaceAudioCtx.state === 'suspended') {
        spaceAudioCtx.resume();
    }
    currentPlanetSound = profile.play(spaceAudioCtx, spaceAudioCtx.currentTime);
}

function stopPlanetSound() {
    if (currentPlanetSound) {
        try { currentPlanetSound.stop(); } catch(e) {}
        currentPlanetSound = null;
    }
}

// ============ SHOOTING STARS ============
