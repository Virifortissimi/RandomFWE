// --- Constants & Config ---
const FAMILY_WORSHIP_DATA = {
    "Bible": [
        { "Activity": "Listen to an audio recording", "Description": "Listen to an audio recording of the weekly Bible reading, or take turns reading it aloud. Each family member could read the words of a different Bible character." },
        { "Activity": "Prepare questions", "Description": "Prepare questions based on the weekly Bible reading. Have family members choose one question each and research it. Then they can share what they have learned." },
        { "Activity": "Research Bible principles", "Description": "Pose a question or describe a situation, and then research the Bible principles in Scriptures for Christian Living that apply." },
        { "Activity": "Reenact a Bible account", "Description": "Reenact a portion of a Bible account." },
        { "Activity": "Memorize Bible verses", "Description": "Prepare a flash card with a different Bible verse each week, such as those from appendix A in the brochure Love People​—Make Disciples, and try to memorize it." },
        { "Activity": "Study a book", "Description": "Study a portion of the Enjoy Life Forever! book." },
        { "Activity": "Present a report", "Description": "Assign family members to present a report on one of the articles from the series 'Bible Questions Answered' or 'Bible Verses Explained' on jw.org." }
    ],
    "Meetings": [
        { "Activity": "Prepare for a congregation meeting", "Description": "Prepare a portion of a congregation meeting." },
        { "Activity": "Rehearse comments", "Description": "Prepare and rehearse comments. Take note of timing." },
        { "Activity": "Practice Kingdom songs", "Description": "Practice Kingdom songs." },
        { "Activity": "Encourage someone", "Description": "Discuss and practice what to say to encourage someone before or after the next meeting." },
        { "Activity": "Rehearse a student assignment", "Description": "Rehearse an upcoming student assignment in front of the family." }
    ],
    "Ministry": [
        { "Activity": "Prepare for house-to-house ministry", "Description": "Prepare for the house-to-house ministry." },
        { "Activity": "Prepare for return visits", "Description": "Prepare for your return visits." },
        { "Activity": "Practice informal witnessing", "Description": "Imagine an informal setting, and then practice how to start a friendly conversation." },
        { "Activity": "Set ministry goals", "Description": "Discuss specific goals for expanding your ministry during the Memorial season or during time off from work or school." }
    ],
    "Needs Of The Family": [
        { "Activity": "Practice handling situations", "Description": "Have a practice session on how to handle a specific situation that has arisen or is likely to arise, such as those involving neutrality, bullying, dating, or holidays." },
        { "Activity": "Role reversal session", "Description": "Have a practice session where parents and children reverse roles. The children research the subject and then reason with the parents." }
    ],
    "Additional Suggestions": [
        { "Activity": "Watch and discuss a program", "Description": "Watch and discuss a JW Broadcasting® program." },
        { "Activity": "Read or watch, then discuss", "Description": "Read an article or watch a video from jw.org, and then discuss it." },
        { "Activity": "Consider resources for youth", "Description": "Consider something from the 'Teens & Young Adults' or 'Children' sections found under the BIBLE TEACHINGS tab on jw.org." },
        { "Activity": "Review notes from a convention or assembly", "Description": "Review notes from a convention or an assembly." },
        { "Activity": "Research creation", "Description": "Observe or research an aspect of creation, and then discuss what it teaches us about Jehovah." },
        { "Activity": "Interview a guest", "Description": "Occasionally invite someone to join you, and then interview him." },
        { "Activity": "Set and discuss spiritual goals", "Description": "Set spiritual goals, and discuss how to reach them." },
        { "Activity": "Work on a project together", "Description": "Work on a project together, such as a model, a map, or a chart." }
    ]
};

const BADGES = [
    { id: 'starter', name: 'Explorer', desc: 'Found your first worship idea', icon: '🚀', goal: 1 },
    { id: 'streak3', name: 'Hot Streak', desc: '3-day worship streak', icon: '🔥', goal: 3 },
    { id: 'streak7', name: 'Shield of Faith', desc: '7-day worship streak', icon: '🛡️', goal: 7 },
    { id: 'bible_lover', name: 'Bible Scholar', desc: 'Found 5 Bible-based ideas', icon: '📖', goal: 5, cat: 'Bible' },
    { id: 'enthusiast', name: 'Enthusiast', desc: 'Reached Level 2', icon: '⭐️', goal: 300, type: 'xp' }
];

// --- Audio Engine (Synthesized) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let soundEnabled = localStorage.getItem('sound_enabled') !== 'false';

function playSound(type) {
    if (!soundEnabled) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'shuffle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    }
}

// --- Persistence & State ---
let state = {
    xp: parseInt(localStorage.getItem('worship_xp')) || 0,
    streak: parseInt(localStorage.getItem('worship_streak')) || 0,
    lastUsed: localStorage.getItem('worship_last_used') || null,
    favorites: JSON.parse(localStorage.getItem('worship_favorites')) || [],
    badges: JSON.parse(localStorage.getItem('worship_earned_badges')) || [],
    stats: JSON.parse(localStorage.getItem('worship_stats')) || { Bible: 0, Meetings: 0, Ministry: 0, "Needs Of The Family": 0, "Additional Suggestions": 0, total: 0 }
};

let currentItem = null;

// --- UI Logic ---
const LEVELS = [
    { threshold: 0, name: "Worship Beginner" },
    { threshold: 300, name: "Worship Enthusiast" },
    { threshold: 800, name: "Worship Devoted" },
    { threshold: 1500, name: "Worship Expert" },
    { threshold: 3000, name: "Grand Family Mentor" }
];

function updateUI() {
    const level = LEVELS.reduce((prev, curr) => (state.xp >= curr.threshold ? curr : prev));
    const nextLevel = LEVELS.find(l => l.threshold > state.xp) || { threshold: state.xp + 1000 };
    const progress = ((state.xp - level.threshold) / (nextLevel.threshold - level.threshold)) * 100;

    document.getElementById('currentXp').textContent = state.xp;
    document.getElementById('nextLevelXp').textContent = nextLevel.threshold;
    document.getElementById('xpBarFill').style.width = `${Math.min(100, progress)}%`;
    document.getElementById('levelName').textContent = level.name;
    document.getElementById('streakCount').textContent = state.streak;

    const favList = document.getElementById('favoritesList');
    if (state.favorites.length === 0) {
        favList.innerHTML = '<p class="empty-msg">No favorites yet. Tap the ❤️ on an idea!</p>';
    } else {
        favList.innerHTML = state.favorites.map((f, i) => `
            <div class="fav-item">
                <strong>${f.category}</strong>
                <p>${f.activity}</p>
                <button class="remove-fav" onclick="removeFavorite(${i})">×</button>
            </div>
        `).join('');
    }

    const badgeList = document.getElementById('badgesList');
    badgeList.innerHTML = BADGES.map(b => {
        const isUnlocked = state.badges.includes(b.id);
        return `
            <div class="badge ${isUnlocked ? 'unlocked' : ''}">
                <div class="badge-icon">${b.icon}</div>
                <span class="badge-name">${b.name}</span>
                <span class="badge-desc">${b.desc}</span>
            </div>
        `;
    }).join('');
}

function checkBadges() {
    let changed = false;
    BADGES.forEach(b => {
        if (state.badges.includes(b.id)) return;

        let unlocked = false;
        if (b.type === 'xp' && state.xp >= b.goal) unlocked = true;
        else if (b.cat && state.stats[b.cat] >= b.goal) unlocked = true;
        else if (b.id === 'starter' && state.stats.total >= 1) unlocked = true;
        else if (b.id === 'streak3' && state.streak >= 3) unlocked = true;
        else if (b.id === 'streak7' && state.streak >= 7) unlocked = true;

        if (unlocked) {
            state.badges.push(b.id);
            changed = true;
        }
    });

    if (changed) {
        localStorage.setItem('worship_earned_badges', JSON.stringify(state.badges));
        updateUI();
    }
}

// --- Interaction Actions ---
window.toggleFavorite = function () {
    if (!currentItem) return;
    const index = state.favorites.findIndex(f => f.activity === currentItem.item.Activity);

    if (index > -1) {
        state.favorites.splice(index, 1);
    } else {
        state.favorites.push({
            category: currentItem.category,
            activity: currentItem.item.Activity,
            description: currentItem.item.Description
        });
        playSound('success');
    }

    localStorage.setItem('worship_favorites', JSON.stringify(state.favorites));
    updateUI();
    updateFavoriteButton();
};

window.removeFavorite = function (index) {
    state.favorites.splice(index, 1);
    localStorage.setItem('worship_favorites', JSON.stringify(state.favorites));
    updateUI();
    updateFavoriteButton();
};

function updateFavoriteButton() {
    const favBtn = document.getElementById('favBtn');
    if (!favBtn || !currentItem) return;
    const isFav = state.favorites.some(f => f.activity === currentItem.item.Activity);
    favBtn.classList.toggle('active', isFav);
    favBtn.innerHTML = isFav ? '❤️ Saved' : '🤍 Favorite';
}

window.shareWhatsApp = function () {
    if (!currentItem) return;
    const text = `*Family Worship Idea*\n\n*Category:* ${currentItem.category}\n*Activity:* ${currentItem.item.Activity}\n\n${currentItem.item.Description}\n\n_Sent from Family Worship Ideas_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
};

// --- Sidebar & Sound Controls ---
function toggleSidebar(open) {
    document.getElementById('sidebar').classList.toggle('open', open);
    document.getElementById('overlay').classList.toggle('open', open);
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}Tab`).classList.add('active');
    });
});

document.getElementById('openFavoritesBtn').addEventListener('click', () => toggleSidebar(true));
document.getElementById('closeSidebarBtn').addEventListener('click', () => toggleSidebar(false));
document.getElementById('overlay').addEventListener('click', () => toggleSidebar(false));

document.getElementById('soundToggle').addEventListener('change', (e) => {
    soundEnabled = e.target.checked;
    localStorage.setItem('sound_enabled', soundEnabled);
    if (soundEnabled) playSound('success');
});

// --- Main Generation Logic ---
document.getElementById('generateBtn').addEventListener('click', function () {
    const loader = document.getElementById('loader');
    const resultBox = document.getElementById('randomData');
    const btn = this;

    loader.style.display = 'block';
    btn.disabled = true;
    btn.textContent = 'Seeking...';

    let shuffleInterval = setInterval(() => {
        const categories = Object.keys(FAMILY_WORSHIP_DATA);
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const items = FAMILY_WORSHIP_DATA[cat];
        const item = items[Math.floor(Math.random() * items.length)];

        resultBox.innerHTML = `
            <div class="reveal-item shuffling">
                <strong>Category</strong> <span>${cat}</span>
            </div>
            <div class="reveal-item shuffling">
                <strong>Activity</strong> <span>${item.Activity}</span>
            </div>
        `;
        playSound('shuffle');
    }, 100);

    setTimeout(() => {
        clearInterval(shuffleInterval);

        const categories = Object.keys(FAMILY_WORSHIP_DATA);
        const category = categories[Math.floor(Math.random() * categories.length)];
        const items = FAMILY_WORSHIP_DATA[category];
        const item = items[Math.floor(Math.random() * items.length)];

        currentItem = { category, item };
        document.body.setAttribute('data-theme', category);

        resultBox.innerHTML = `
            <div class="reveal-item">
                <strong>Category</strong> <span>${category}</span>
            </div>
            <div class="reveal-item">
                <strong>Activity</strong> <span>${item.Activity}</span>
            </div>
            <div class="reveal-item">
                <strong>Suggestion</strong> <span>${item.Description}</span>
            </div>
            <div class="item-actions">
                <button id="favBtn" class="action-btn" onclick="toggleFavorite()">🤍 Favorite</button>
                <button class="action-btn share" onclick="shareWhatsApp()">📱 WhatsApp</button>
            </div>
        `;

        loader.style.display = 'none';
        btn.disabled = false;
        btn.textContent = 'Next Suggestion';

        // Update Stats & Gamification
        state.stats[category] = (state.stats[category] || 0) + 1;
        state.stats.total = (state.stats.total || 0) + 1;
        localStorage.setItem('worship_stats', JSON.stringify(state.stats));

        const today = new Date().toDateString();
        if (state.lastUsed !== today) {
            if (state.lastUsed) {
                const diff = (new Date(today) - new Date(state.lastUsed)) / (1000 * 60 * 60 * 24);
                if (diff === 1) state.streak++;
                else if (diff > 1) state.streak = 1;
            } else state.streak = 1;
            state.lastUsed = today;
            localStorage.setItem('worship_streak', state.streak);
            localStorage.setItem('worship_last_used', today);
        }

        state.xp += 50;
        localStorage.setItem('worship_xp', state.xp);

        checkBadges();
        updateUI();
        updateFavoriteButton();
        playSound('success');

        particles = [];
        createConfetti();
        updateConfetti();
    }, 1200);
});

// --- Confetti Engine ---
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createConfetti() {
    const colors = ['#4f46e5', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: -10,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * 4 - 2, speedY: Math.random() * 6 + 4,
            rotation: Math.random() * 360, rotationSpeed: Math.random() * 10 - 5
        });
    }
}

function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.x += p.speedX; p.y += p.speedY; p.rotation += p.rotationSpeed;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        if (p.y > canvas.height) particles.splice(i, 1);
    });
    if (particles.length > 0) requestAnimationFrame(updateConfetti);
}

// Initial Load
updateUI();
