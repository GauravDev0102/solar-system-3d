// solar-system-3d — planetary data & config tables (extracted from app.js 2026-10-26)

const PLANETS = {
    mercury: {
        name: "Mercury",
        type: "Terrestrial Planet",
        radius: 0.38,
        distance: 8,
        orbitSpeed: 4.15,
        rotationSpeed: 0.005,
        axialTilt: 0.034,
        color: 0xb0b0b0,
        emissive: 0x333333,
        atmosphere: null,
        hasRings: false,
        moons: [],
        texture: { base: 0x8c7e6d, spots: 0x5a5a5a, highlight: 0xc4b5a0 },
        description: "Mercury is the smallest and innermost planet in the Solar System. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the planets. It has no atmosphere and its surface is heavily cratered, resembling our Moon.",
        stats: {
            dist: "57.9M km",
            orbit: "87.97 days",
            diam: "4,879 km",
            moons: "0",
            day: "58.6 Earth days",
            temp: "-180°C to 430°C",
            gravity: "3.7 m/s²",
            mass: "3.30 × 10²³ kg"
        },
        fact: "Mercury has the most eccentric orbit of any planet. A year on Mercury (176 Earth days) is shorter than a single Mercury day (58.6 Earth days).",
        moonsData: []
    },
    venus: {
        name: "Venus",
        type: "Terrestrial Planet",
        radius: 0.72,
        distance: 12,
        orbitSpeed: 1.62,
        rotationSpeed: -0.002,
        axialTilt: 177.4,
        color: 0xe8cda0,
        emissive: 0x443322,
        atmosphere: 0xe8c080,
        hasRings: false,
        moons: [],
        texture: { base: 0xc4a86a, spots: 0xe8d5a0, highlight: 0xfff0c0 },
        description: "Venus is the second planet from the Sun and the hottest planet in our solar system. Its thick atmosphere traps heat in a runaway greenhouse effect, making it hotter than Mercury. It rotates backwards compared to most planets.",
        stats: {
            dist: "108.2M km",
            orbit: "224.7 days",
            diam: "12,104 km",
            moons: "0",
            day: "243 Earth days",
            temp: "464°C avg",
            gravity: "8.87 m/s²",
            mass: "4.87 × 10²⁴ kg"
        },
        fact: "Venus is the hottest planet in the solar system at 464°C — hot enough to melt lead. Its atmosphere is 96.5% carbon dioxide with clouds of sulfuric acid.",
        moonsData: []
    },
    earth: {
        name: "Earth",
        type: "Terrestrial Planet",
        radius: 0.76,
        distance: 17,
        orbitSpeed: 1.0,
        rotationSpeed: 0.01,
        axialTilt: 23.44,
        color: 0x4a90d9,
        emissive: 0x112244,
        atmosphere: 0x6699ff,
        hasRings: false,
        moons: ["moon"],
        texture: { base: 0x2255aa, spots: 0x44aa44, highlight: 0xffffff },
        description: "Earth is the third planet from the Sun and the only known planet to harbor life. About 71% of its surface is covered with water, and it has a protective magnetic field that shields it from solar radiation.",
        stats: {
            dist: "149.6M km",
            orbit: "365.25 days",
            diam: "12,742 km",
            moons: "1",
            day: "24 hours",
            temp: "15°C avg",
            gravity: "9.81 m/s²",
            mass: "5.97 × 10²⁴ kg"
        },
        fact: "Earth is the only planet not named after a Greek or Roman god. It's also the densest planet in the solar system and the only one with liquid water on its surface.",
        moonsData: [
            { name: "Moon", radius: 0.2, distance: 2.0, speed: 0.03, color: 0xaaaaaa, axialTilt: 1.54 }
        ]
    },
    mars: {
        name: "Mars",
        type: "Terrestrial Planet",
        radius: 0.53,
        distance: 23,
        orbitSpeed: 0.53,
        rotationSpeed: 0.009,
        axialTilt: 25.19,
        color: 0xc1440e,
        emissive: 0x331100,
        atmosphere: 0xcc6644,
        hasRings: false,
        moons: ["phobos", "deimos"],
        texture: { base: 0xb5380a, spots: 0x8b2500, highlight: 0xd4a574 },
        description: "Mars is the fourth planet from the Sun, known as the 'Red Planet' due to iron oxide on its surface. It has the tallest volcano (Olympus Mons) and the deepest canyon (Valles Marineris) in the solar system.",
        stats: {
            dist: "227.9M km",
            orbit: "687 days",
            diam: "6,779 km",
            moons: "2",
            day: "24.6 hours",
            temp: "-63°C avg",
            gravity: "3.72 m/s²",
            mass: "6.42 × 10²³ kg"
        },
        fact: "Mars has seasons like Earth because of its similar axial tilt. Olympus Mons is 21.9 km high — nearly 3 times the height of Mount Everest.",
        moonsData: [
            { name: "Phobos", radius: 0.08, distance: 1.2, speed: 0.08, color: 0x888888, axialTilt: 0 },
            { name: "Deimos", radius: 0.05, distance: 1.6, speed: 0.04, color: 0x777777, axialTilt: 0 }
        ]
    },
    jupiter: {
        name: "Jupiter",
        type: "Gas Giant",
        radius: 2.2,
        distance: 34,
        orbitSpeed: 0.084,
        rotationSpeed: 0.02,
        axialTilt: 3.13,
        color: 0xc88b3a,
        emissive: 0x332200,
        atmosphere: 0xd4a060,
        hasRings: false,
        moons: ["io", "europa", "ganymede", "callisto"],
        texture: { base: 0xc88b3a, spots: 0xaa5522, highlight: 0xe8c88a },
        description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It's a gas giant with a mass more than two and a half times all other planets combined. Its Great Red Spot is a storm larger than Earth.",
        stats: {
            dist: "778.5M km",
            orbit: "11.86 years",
            diam: "139,820 km",
            moons: "95",
            day: "9.9 hours",
            temp: "-110°C avg",
            gravity: "24.79 m/s²",
            mass: "1.90 × 10²⁷ kg"
        },
        fact: "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years and is shrinking. It could fit 2-3 Earths inside it.",
        moonsData: [
            { name: "Io", radius: 0.15, distance: 3.5, speed: 0.06, color: 0xffaa00, axialTilt: 0 },
            { name: "Europa", radius: 0.13, distance: 4.2, speed: 0.04, color: 0x88ccff, axialTilt: 0 },
            { name: "Ganymede", radius: 0.2, distance: 5.0, speed: 0.025, color: 0xaa9977, axialTilt: 0 },
            { name: "Callisto", radius: 0.18, distance: 5.8, speed: 0.015, color: 0x666655, axialTilt: 0 }
        ]
    },
    saturn: {
        name: "Saturn",
        type: "Gas Giant",
        radius: 1.8,
        distance: 46,
        orbitSpeed: 0.034,
        rotationSpeed: 0.018,
        axialTilt: 26.73,
        color: 0xe8d5a3,
        emissive: 0x332211,
        atmosphere: 0xf0e0b0,
        hasRings: true,
        moons: ["titan", "enceladus", "mimas"],
        texture: { base: 0xe0cc88, spots: 0xc8a860, highlight: 0xf5ecc8 },
        description: "Saturn is the sixth planet from the Sun and is famous for its stunning ring system. It's the second-largest planet and has the most moons in the solar system. Its rings are made of ice and rock.",
        stats: {
            dist: "1.434B km",
            orbit: "29.46 years",
            diam: "116,460 km",
            moons: "146",
            day: "10.7 hours",
            temp: "-140°C avg",
            gravity: "10.44 m/s²",
            mass: "5.68 × 10²⁶ kg"
        },
        fact: "Saturn is the least dense planet — it would float in water if you could find a bathtub big enough. Its rings extend up to 282,000 km but are only about 10 meters thick.",
        moonsData: [
            { name: "Titan", radius: 0.22, distance: 3.5, speed: 0.03, color: 0xddaa44, axialTilt: 0 },
            { name: "Enceladus", radius: 0.08, distance: 2.5, speed: 0.06, color: 0xeeeeff, axialTilt: 0 },
            { name: "Mimas", radius: 0.06, distance: 2.0, speed: 0.08, color: 0x999999, axialTilt: 0 }
        ],
        ringColor: 0xc8b88a,
        ringConfig: { inner: 2.2, outer: 4.0, bands: 12, opacity: 0.7 },
        ringColors: [0xc8b88a, 0xb8a878, 0xd8c898, 0xa89868, 0xe0d0a0, 0xc0b080, 0xd0c090, 0xb0a070]
    },
    uranus: {
        name: "Uranus",
        type: "Ice Giant",
        radius: 1.2,
        distance: 58,
        orbitSpeed: 0.012,
        rotationSpeed: 0.012,
        axialTilt: 97.77,
        color: 0x73c2d0,
        emissive: 0x112233,
        atmosphere: 0x88dde8,
        hasRings: true,
        moons: ["miranda", "ariel", "titania"],
        texture: { base: 0x5aaab5, spots: 0x73c2d0, highlight: 0xb0e8f0 },
        description: "Uranus is the seventh planet from the Sun and has the most extreme axial tilt at 97.77°, essentially rolling on its side. It's an ice giant with methane in its atmosphere giving it a blue-green color.",
        stats: {
            dist: "2.871B km",
            orbit: "84.01 years",
            diam: "50,724 km",
            moons: "28",
            day: "17.2 hours",
            temp: "-195°C avg",
            gravity: "8.69 m/s²",
            mass: "8.68 × 10²⁵ kg"
        },
        fact: "Uranus rotates on its side with a 98° tilt, likely caused by a collision with an Earth-sized object billions of years ago. It has faint rings discovered in 1977.",
        moonsData: [
            { name: "Miranda", radius: 0.06, distance: 2.0, speed: 0.05, color: 0x888888, axialTilt: 0 },
            { name: "Ariel", radius: 0.08, distance: 2.5, speed: 0.035, color: 0x999999, axialTilt: 0 },
            { name: "Titania", radius: 0.1, distance: 3.2, speed: 0.02, color: 0x777777, axialTilt: 0 }
        ],
        ringConfig: { inner: 1.5, outer: 2.0, bands: 2, opacity: 0.25 }
    },
    neptune: {
        name: "Neptune",
        type: "Ice Giant",
        radius: 1.1,
        distance: 70,
        orbitSpeed: 0.006,
        rotationSpeed: 0.011,
        axialTilt: 28.32,
        color: 0x3f51b5,
        emissive: 0x111133,
        atmosphere: 0x5566dd,
        hasRings: false,
        moons: ["triton"],
        texture: { base: 0x2244aa, spots: 0x3366cc, highlight: 0x7799ff },
        description: "Neptune is the eighth and farthest-known planet from the Sun. It has the strongest winds in the solar system, reaching 2,100 km/h. Its vivid blue color comes from methane in its atmosphere.",
        stats: {
            dist: "4.495B km",
            orbit: "164.8 years",
            diam: "49,244 km",
            moons: "16",
            day: "16.1 hours",
            temp: "-200°C avg",
            gravity: "11.15 m/s²",
            mass: "1.02 × 10²⁶ kg"
        },
        fact: "Neptune has the fastest winds in the solar system at 2,100 km/h. It was the first planet found through mathematical prediction rather than direct observation.",
        moonsData: [
            { name: "Triton", radius: 0.14, distance: 2.5, speed: -0.04, color: 0xaabbcc, axialTilt: 0 }
        ]
    }
};

// ============ THREE.JS VARIABLES ============

const PLANET_SEARCH_LIST = [
    { id: 'sun', name: 'Sun', type: 'Star' },
    { id: 'mercury', name: 'Mercury', type: 'Terrestrial' },
    { id: 'venus', name: 'Venus', type: 'Terrestrial' },
    { id: 'earth', name: 'Earth', type: 'Terrestrial' },
    { id: 'mars', name: 'Mars', type: 'Terrestrial' },
    { id: 'jupiter', name: 'Jupiter', type: 'Gas Giant' },
    { id: 'saturn', name: 'Saturn', type: 'Gas Giant' },
    { id: 'uranus', name: 'Uranus', type: 'Ice Giant' },
    { id: 'neptune', name: 'Neptune', type: 'Ice Giant' }
];


const PLANET_SOUND_PROFILES = {
    sun: {
        play: (ctx, now) => {
            const bufferSize = ctx.sampleRate * 4;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                const t = i / ctx.sampleRate;
                data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - t / 4) * 0.3
                    + Math.sin(t * 110 * Math.PI * 2) * 0.15 * Math.max(0, 1 - t / 4)
                    + Math.sin(t * 55 * Math.PI * 2) * 0.2 * Math.max(0, 1 - t / 3);
            }
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.value = 0.15;
            src.connect(gain);
            gain.connect(ctx.destination);
            src.start(now);
            return { src, gain, stop: () => { try { src.stop(); } catch(e) {} } };
        }
    },
    mercury: {
        play: (ctx, now) => {
            const bufferSize = ctx.sampleRate * 3;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                const t = i / ctx.sampleRate;
                const clickRate = 8 + Math.sin(t * 0.5) * 3;
                data[i] = (Math.floor(t * clickRate) % 3 === 0 ? (Math.random() * 2 - 1) * 0.3 : 0)
                    + Math.sin(t * 1200 * Math.PI * 2) * 0.08 * Math.max(0, 1 - t / 3);
            }
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.value = 0.12;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 800;
            src.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            src.start(now);
            return { src, gain, stop: () => { try { src.stop(); } catch(e) {} } };
        }
    },
    venus: {
        play: (ctx, now) => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = 45;
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 88;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 120;
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.3;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 10;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
            osc.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            lfo.start(now);
            osc.start(now);
            osc2.start(now);
            osc.stop(now + 4);
            osc2.stop(now + 4);
            lfo.stop(now + 4);
            return { src: osc, gain, stop: () => { try { osc.stop(); osc2.stop(); lfo.stop(); } catch(e) {} } };
        }
    },
    earth: {
        play: (ctx, now) => {
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.value = 174;
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 285;
            const osc3 = ctx.createOscillator();
            osc3.type = 'sine';
            osc3.frequency.value = 60;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 300;
            filter.Q.value = 0.5;
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.5;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 5;
            lfo.connect(lfoGain);
            lfoGain.connect(osc3.frequency);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
            osc.connect(filter);
            osc2.connect(filter);
            osc3.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            lfo.start(now);
            osc.start(now);
            osc2.start(now);
            osc3.start(now);
            osc.stop(now + 4.5);
            osc2.stop(now + 4.5);
            osc3.stop(now + 4.5);
            lfo.stop(now + 4.5);
            return { src: osc, gain, stop: () => { try { osc.stop(); osc2.stop(); osc3.stop(); lfo.stop(); } catch(e) {} } };
        }
    },
    mars: {
        play: (ctx, now) => {
            const bufferSize = ctx.sampleRate * 3;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                const t = i / ctx.sampleRate;
                const noise = (Math.random() * 2 - 1) * Math.max(0, 1 - t / 3) * 0.2;
                const tone = Math.sin(t * 90 * Math.PI * 2) * 0.1 * Math.max(0, 1 - t / 2.5);
                const wind = Math.sin(t * 200 * Math.PI * 2 + Math.sin(t * 3) * 20) * 0.08 * Math.max(0, 1 - t / 3);
                data[i] = noise * 0.5 + tone + wind;
            }
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            const gain = ctx.createGain();
            gain.gain.value = 0.12;
            src.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            src.start(now);
            return { src, gain, stop: () => { try { src.stop(); } catch(e) {} } };
        }
    },
    jupiter: {
        play: (ctx, now) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 42;
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 84;
            const osc3 = ctx.createOscillator();
            osc3.type = 'sawtooth';
            osc3.frequency.value = 120;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 150;
            const lfo = ctx.createOscillator();
            lfo.type = 'square';
            lfo.frequency.value = 2.5;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 15;
            lfo.connect(lfoGain);
            lfoGain.connect(osc3.frequency);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 5);
            osc.connect(filter);
            osc2.connect(filter);
            osc3.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            lfo.start(now);
            osc.start(now);
            osc2.start(now);
            osc3.start(now);
            osc.stop(now + 5);
            osc2.stop(now + 5);
            osc3.stop(now + 5);
            lfo.stop(now + 5);
            return { src: osc, gain, stop: () => { try { osc.stop(); osc2.stop(); osc3.stop(); lfo.stop(); } catch(e) {} } };
        }
    },
    saturn: {
        play: (ctx, now) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 220;
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 330;
            const osc3 = ctx.createOscillator();
            osc3.type = 'sine';
            osc3.frequency.value = 440;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 500;
            filter.Q.value = 1;
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.2;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 20;
            lfo.connect(lfoGain);
            lfoGain.connect(osc2.frequency);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 5);
            osc.connect(filter);
            osc2.connect(filter);
            osc3.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            const delay = ctx.createDelay(0.5);
            delay.delayTime.value = 0.25;
            const delayGain = ctx.createGain();
            delayGain.gain.value = 0.3;
            gain.connect(delay);
            delay.connect(delayGain);
            delayGain.connect(ctx.destination);
            lfo.start(now);
            osc.start(now);
            osc2.start(now);
            osc3.start(now);
            osc.stop(now + 5);
            osc2.stop(now + 5);
            osc3.stop(now + 5);
            lfo.stop(now + 5);
            return { src: osc, gain, stop: () => { try { osc.stop(); osc2.stop(); osc3.stop(); lfo.stop(); } catch(e) {} } };
        }
    },
    uranus: {
        play: (ctx, now) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 180;
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 185;
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 1.5;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 30;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfoGain.connect(osc2.frequency);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            lfo.start(now);
            osc.start(now);
            osc2.start(now);
            osc.stop(now + 4);
            osc2.stop(now + 4);
            lfo.stop(now + 4);
            return { src: osc, gain, stop: () => { try { osc.stop(); osc2.stop(); lfo.stop(); } catch(e) {} } };
        }
    },
    neptune: {
        play: (ctx, now) => {
            const bufferSize = ctx.sampleRate * 4;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                const t = i / ctx.sampleRate;
                const whistle = Math.sin(t * 800 * Math.PI * 2 + Math.sin(t * 4) * 30) * 0.12;
                const whistle2 = Math.sin(t * 1200 * Math.PI * 2 + Math.sin(t * 2) * 50) * 0.06;
                const noise = (Math.random() * 2 - 1) * Math.max(0, 1 - t / 4) * 0.08;
                data[i] = (whistle + whistle2 + noise) * Math.max(0, 1 - t / 4);
            }
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 400;
            const gain = ctx.createGain();
            gain.gain.value = 0.1;
            src.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            src.start(now);
            return { src, gain, stop: () => { try { src.stop(); } catch(e) {} } };
        }
    }
};

