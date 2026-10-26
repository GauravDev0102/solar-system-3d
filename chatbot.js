let SPACE_KB = {};

async function loadSpaceKnowledge() {
  try {
    const res = await fetch('space_knowledge.json');
    SPACE_KB = await res.json();
    console.log('AstroBot: loaded ' + Object.keys(SPACE_KB).length + ' topics');
  } catch (e) {
    console.warn('AstroBot: could not load knowledge base, using fallback', e);
  }
}

// Conversational small-talk — checked BEFORE the knowledge base so short
// inputs like "hi" or "how are you" always get a friendly reply.
const SMALL_TALK = [
  {
    re: /^(hi+|hey+|hello+|hola|namaste|namaskar|yo|sup|howdy|greetings|good\s?(morning|afternoon|evening|day))\b/i,
    replies: () => {
      const h = new Date().getHours();
      const timeGreet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
      return [
        `${timeGreet}, space explorer! 🚀 I'm <strong>AstroBot</strong>. Ask me anything about planets, rockets, missions — or type <strong>help</strong>.`,
        `Hello there! 🌟 Ready to explore the cosmos? Try <strong>"How do rockets work?"</strong> or <strong>"What is a black hole?"</strong>`,
        `Hi! 👋 I know <strong>250+ space topics</strong> — planets, black holes, satellites, Chandrayaan, Starship... what shall we explore?`,
        `Greetings, traveler! 🛸 The universe awaits — ask me about Mars, black holes, rocket engines, anything!`,
      ];
    },
  },
  {
    re: /\b(how are you|how r u|how do you do|how's it going|kaise ho|wassup|what's up)\b/i,
    replies: [
      'Running at 100% solar power! ☀️ How about you? Ask me something space-y!',
      "Fantastic — I've been stargazing all day! 🌌 What would you like to know?",
      'Great! Orbiting smoothly around your questions. 🛰️ What shall we talk about?',
    ],
  },
  {
    re: /\b(who are you|what are you|your name|introduce yourself|about yourself)\b/i,
    replies: [
      "I'm <strong>AstroBot</strong> 🤖 — the resident space expert of this Solar System Explorer. I know 250+ topics: planets, rockets, satellites, missions, black holes and beyond! Built by <strong>Gaurav</strong> — <a href='https://github.com/GauravDev0102' target='_blank' rel='noopener'>GitHub</a> · <a href='https://www.linkedin.com/in/gauravdev0102' target='_blank' rel='noopener'>LinkedIn</a>",
      'I am <strong>AstroBot</strong> — a knowledge-powered space guide living in this 3D solar system. 🌠 My creator <strong>Gaurav</strong> is on <a href="https://github.com/GauravDev0102" target="_blank" rel="noopener">GitHub</a> and <a href="https://www.linkedin.com/in/gauravdev0102" target="_blank" rel="noopener">LinkedIn</a>!',
    ],
  },
  {
    re: /\b(github|linked ?in|linkedin id|social media|socials|portfolio|follow you|your profile|your website)\b/i,
    replies: [
      'You can find my creator <strong>Gaurav</strong> here:<br>⭐ GitHub: <a href="https://github.com/GauravDev0102" target="_blank" rel="noopener">github.com/GauravDev0102</a><br>💼 LinkedIn: <a href="https://www.linkedin.com/in/gauravdev0102" target="_blank" rel="noopener">linkedin.com/in/gauravdev0102</a>',
    ],
  },
  {
    re: /\b(thanks|thank you|thankyou|thx|appreciate it|cheers|shukriya|dhanyawad)\b/i,
    replies: [
      "You're welcome, space explorer! 🌟 The universe has endless wonders — ask me more anytime!",
      'Anytime! 🚀 Fun fact available on request — just say <strong>"space fact"</strong>.',
      "Happy to help! Keep exploring! 🪐",
    ],
  },
  {
    re: /\b(bye|goodbye|good night|see you|see ya|tata|alvida)\b/i,
    replies: [
      'Safe travels, explorer! 🌠 The stars will be waiting.',
      'Goodbye! Come back soon — the universe is not going anywhere! 😄',
      "Clear skies and tailwinds! 🚀 See you on the next orbit!",
    ],
  },
  {
    re: /\b(joke|make me laugh|something funny|crack a joke)\b/i,
    replies: () => {
      const jokes = [
        'Why did the Sun go to school? ☀️ To get a little brighter!',
        'Why did the astronaut break up with the Moon? He needed <strong>space</strong>! 🚀',
        'How does the solar system hold up its pants? With an <strong>asteroid belt</strong>! 😄',
        "Why don't aliens visit our solar system? Only <strong>1 star</strong> — terrible reviews on TripAdvisor! 🛸",
        'What do you call a comet with a cold? An <strong>as-ti-cough</strong>! 🤧☄️',
        'Why is the Moon always broke? Because it keeps going through <strong>phases</strong>! 🌙',
        'What did Mars say to Saturn? "Nice <strong>rings</strong> — want to trade no moons for 95?" 🪐',
        'I tried to write a joke about black holes... it was <strong>too dense</strong> for anyone to escape! 🕳️',
      ];
      return [jokes[Math.floor(Math.random() * jokes.length)]];
    },
  },
  {
    re: /\b(space fact|random fact|tell me a fact|another fact|fun fact)\b/i,
    replies: () => {
      const facts = [
        'A day on Venus is longer than its year — 243 vs 225 Earth days! 🪐',
        'There are more stars in the universe than grains of sand on all Earth\'s beaches. 🌌',
        'One million Earths could fit inside the Sun — and it\'s a mid-sized star! ☀️',
        'Neutron star material is so dense, one teaspoon would weigh ~10 million tons. ⭐',
        'Footprints on the Moon will last millions of years — no wind or water to erase them. 👣',
        'Saturn would float in water — its density is lower than H₂O! 🪐',
        'Light from the Sun takes 8 minutes 20 seconds to reach you — you always see the Sun as it WAS. ☀️',
        'Jupiter\'s Great Red Spot is a storm bigger than Earth that has raged for centuries. 🔴',
        'In space, you\'d get taller by ~5 cm — the spine stretches without gravity! 🧑‍🚀',
        'Olympus Mons on Mars is ~22 km tall — nearly 3× Mount Everest. 🏔️',
      ];
      return ['Here you go: ' + facts[Math.floor(Math.random() * facts.length)]];
    },
  },
];

function matchSmallTalk(input) {
  for (const intent of SMALL_TALK) {
    if (intent.re.test(input)) {
      const options = typeof intent.replies === 'function' ? intent.replies() : intent.replies;
      return options[Math.floor(Math.random() * options.length)];
    }
  }
  return null;
}

class AstroBot {
  constructor() {
    this.knowledgeBase = SPACE_KB;
    this.chatToggle = document.getElementById('chatToggle');
    this.chatWindow = document.getElementById('chatWindow');
    this.chatClose = document.getElementById('chatClose');
    this.chatInput = document.getElementById('chatInput');
    this.chatSend = document.getElementById('chatSend');
    this.chatMessages = document.getElementById('chatMessages');
    this.chatBadge = document.getElementById('chatBadge');
    this.suggestions = document.querySelectorAll('.chat-suggestion');
    this.isOpen = false;
    this.init();
  }

  init() {
    this.chatToggle.addEventListener('click', () => this.toggleChat());
    this.chatClose.addEventListener('click', () => this.toggleChat());
    this.chatSend.addEventListener('click', () => this.sendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    this.suggestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-q');
        this.chatInput.value = q;
        this.sendMessage();
      });
    });

    setTimeout(() => {
      this.chatBadge.classList.add('show');
    }, 3000);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatWindow.classList.toggle('hidden', !this.isOpen);
    if (this.isOpen) {
      this.chatBadge.classList.remove('show');
      this.chatInput.focus();
    }
  }

  sendMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.addMessage(text, 'user');
    this.chatInput.value = '';

    const typingId = this.showTyping();

    setTimeout(() => {
      this.removeTyping(typingId);
      const response = this.getResponse(text);
      this.addMessage(response, 'bot');
    }, 600 + Math.random() * 800);
  }

  addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${type}`;
    const avatar = type === 'bot' ? '🤖' : '🧑';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msgDiv.innerHTML = `
      <div class="chat-msg-avatar">${avatar}</div>
      <div class="chat-msg-content">
        <p>${text}</p>
        <span class="chat-msg-time">${time}</span>
      </div>
    `;
    this.chatMessages.appendChild(msgDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  showTyping() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot';
    typingDiv.id = id;
    typingDiv.innerHTML = `
      <div class="chat-msg-avatar">🤖</div>
      <div class="chat-msg-content">
        <div class="chat-typing"><span></span><span></span><span></span></div>
      </div>
    `;
    this.chatMessages.appendChild(typingDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    return id;
  }

  removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  getResponse(input) {
    if (!input || input.trim() === '') {
      return 'Ask me something about space! Type <strong>help</strong> to see what I know.';
    }

    const lowerInput = input.toLowerCase().trim();

    // small talk first — greetings, thanks, jokes, facts
    const smallTalk = matchSmallTalk(lowerInput);
    if (smallTalk) return smallTalk;

    const words = lowerInput.split(/\s+/).filter(w => w.length > 0);
    // generic question words would false-match keywords like "what is the speed of light"
    const STOPWORDS = new Set(['what', 'which', 'who', 'how', 'why', 'when', 'where', 'tell', 'about', 'give', 'show', 'explain', 'define', 'describe', 'please', 'does', 'did', 'know', 'want', 'need', 'name', 'list', 'thing', 'stuff', 'space', 'there', 'that', 'this', 'with', 'from', 'have', 'are', 'was', 'were', 'will', 'would', 'could', 'should']);
    const longWords = words.filter(w => w.length > 3 && !STOPWORDS.has(w));
    const matchedAnswers = new Map();

    for (const [key, entry] of Object.entries(this.knowledgeBase)) {
      const keywords = entry.keywords;
      for (const kw of keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower.length <= 2) continue;
        // short keywords (acronyms, "sun", "mars") must match as whole words,
        // otherwise they hijack sentences that merely contain the letters
        let hit;
        if (kwLower.length <= 4) {
          const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          hit = new RegExp('\\b' + escaped + '\\b').test(lowerInput);
        } else {
          hit = lowerInput.includes(kwLower);
        }
        if (hit) {
          // longer keyword = more specific match = higher score
          const score = 100 + kwLower.length;
          const cur = matchedAnswers.get(key);
          if (!cur || score > cur.score) matchedAnswers.set(key, { entry, score });
          break;
        }
      }
    }

    if (matchedAnswers.size === 0) {
      for (const word of longWords) {
        for (const [key, entry] of Object.entries(this.knowledgeBase)) {
          if (matchedAnswers.has(key)) continue;
          for (const kw of entry.keywords) {
            const kwLower = kw.toLowerCase();
            if (kwLower.includes(word)) {
              const score = 50 + kwLower.length;
              const current = matchedAnswers.get(key);
              matchedAnswers.set(key, { entry, score: (current ? current.score : 0) + score });
              break;
            }
          }
        }
      }
    }

    if (matchedAnswers.size > 0) {
      let best = null;
      let bestScore = -1;
      for (const [, value] of matchedAnswers) {
        if (value.score > bestScore) {
          bestScore = value.score;
          best = value.entry;
        }
      }
      return best.answer;
    }

    if (lowerInput.includes('?') || lowerInput.startsWith('what') || lowerInput.startsWith('how') || lowerInput.startsWith('why') || lowerInput.startsWith('when') || lowerInput.startsWith('where') || lowerInput.startsWith('is ') || lowerInput.startsWith('are ') || lowerInput.startsWith('do ') || lowerInput.startsWith('can ')) {
      if (lowerInput.includes('planet')) {
        return 'Our solar system has <strong>8 planets</strong>: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. The inner 4 are rocky (terrestrial), while the outer 4 are gas/ice giants. Ask about a specific planet for more details!';
      }
      if (lowerInput.includes('star')) {
        return 'Stars come in many types: <strong>red dwarfs</strong> (most common), <strong>yellow dwarfs</strong> (like our Sun), <strong>blue giants</strong> (hot and bright), and <strong>red supergiants</strong> (like Betelgeuse). Their life cycle depends on mass — low-mass stars become white dwarfs, while massive stars end as neutron stars or black holes.';
      }
      if (lowerInput.includes('black hole')) {
        return '<strong>Black holes</strong> come in three main types: stellar-mass (3-100 solar masses), intermediate (100-100,000 solar masses), and supermassive (millions to billions of solar masses). They form when massive stars collapse or through mergers. The Event Horizon Telescope captured the first image of a black hole in 2019.';
      }
      if (lowerInput.includes('life') || lowerInput.includes('alien')) {
        return 'Earth is the only known planet with life, but several worlds in our solar system show promise: <strong>Mars</strong> (ancient water), <strong>Europa</strong> (subsurface ocean), <strong>Enceladus</strong> (water plumes), and <strong>Titan</strong> (methane cycle). Exoplanet studies are searching for biosignatures on distant worlds.';
      }
      if (lowerInput.includes('biggest') || lowerInput.includes('largest')) {
        return 'Largest planet: <strong>Jupiter</strong> (1,300 Earths fit inside). Largest star: <strong>UY Scuti</strong> (1,700× Sun\'s radius). Largest galaxy: <strong>IC 1101</strong> (2 million ly across). Largest black hole: <strong>TON 618</strong> (66 billion solar masses).';
      }
      if (lowerInput.includes('smallest')) {
        return 'Smallest planet: <strong>Mercury</strong> (4,879 km). Smallest star: <strong>EBLM J0555-57Ab</strong> (slightly larger than Saturn). Smallest moon: captured asteroids around Mars or Jupiter.';
      }
      return 'Great question! Try asking about a specific planet, star, black hole, galaxy, mission, or concept. I have extensive knowledge about all things space!';
    }

    return 'I\'m not sure about that. Try asking about planets, rockets, missions, or type <strong>help</strong> — you can also just say hi, ask for a <strong>space joke</strong> or a <strong>space fact</strong>!';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadSpaceKnowledge();
  new AstroBot();
});