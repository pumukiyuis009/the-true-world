// Main JS for THE TRUE WORLD

// ==== Storage Keys ====
const USER_KEY = 'ttw_user';
const THEORIES_KEY = 'ttw_theories';

// ==== Globals ====
let user = null;
let theories = [];
let filteredCategory = null;
let loadCount = 5;
let currentLoadIndex = 0;

// ==== Initialize App ====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  loadUser();
  loadTheories();
  renderDailyTheory();
  setupTypewriter();
  setupEventListeners();
  renderTrending();
  renderTheoryFeed();
});

// ==== PARTICLES BACKGROUND ====
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = ['#00d4ff', '#9d00ff', '#00ff88'];
  const maxParticles = 80;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = 1 + Math.random() * 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.speedY = (Math.random() - 0.5) * 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if(this.x < 0) this.x = canvas.width;
      if(this.x > canvas.width) this.x = 0;
      if(this.y < 0) this.y = canvas.height;
      if(this.y > canvas.height) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(loop);
  }

  function connectParticles() {
    for(let i=0; i<particles.length; i++){
      for(let j=i+1; j<particles.length; j++){
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 120){
          ctx.beginPath();
          ctx.strokeStyle = `rgba(157,0,255,${1 - dist/120})`;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  for(let i=0; i<maxParticles; i++){
    particles.push(new Particle());
  }
  loop();
}

// ==== TYPEWRITER ====
const typewriterTexts = [
  "Unlock the unseen mysteries.",
  "Dive deep into alternative realities.",
  "Where questions become theories.",
  "The Void is calling you..."
];
function setupTypewriter() {
  const el = document.getElementById('typewriter-text');
  let index = 0;
  let charIndex = 0;
  let deleting = false;
  let wait = 2000;

  function type() {
    if(index >= typewriterTexts.length) index = 0;
    let fullText = typewriterTexts[index];

    if(!deleting) {
      el.textContent = fullText.slice(0, charIndex + 1);
      charIndex++;
      if(charIndex === fullText.length) {
        deleting = true;
        setTimeout(type, wait);
        return;
      }
    } else {
      el.textContent = fullText.slice(0, charIndex - 1);
      charIndex--;
      if(charIndex === 0) {
        deleting = false;
        index++;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

// ==== USER AUTH SIMULATION ====
function loadUser() {
  const savedUser = localStorage.getItem(USER_KEY);
  if(savedUser) {
    user = JSON.parse(savedUser);
    if(window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
      updateUILoggedIn();
    } else if(window.location.pathname.endsWith('profile.html')) {
      setupProfilePage();
    }
  }
}
function saveUser() {
  if(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}
function login() {
  const usernameInput = document.getElementById('username');
  const username = usernameInput.value.trim();
  if(!username) {
    alert("Enter a username.");
    return;
  }
  user = {
    username,
    avatar: "https://via.placeholder.com/200",
    followers: [],
    following: [],
    likes: [],
    theoriesPublished: [],
  };
  saveUser();
  hideLogin();
  if(window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    updateUILoggedIn();
  } else if(window.location.pathname.endsWith('profile.html')) {
    setupProfilePage();
  }
}
function logout() {
  user = null;
  saveUser();
  if(window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    updateUILoggedOut();
  } else if(window.location.pathname.endsWith('profile.html')) {
    window.location.href = "index.html";
  }
}

// ==== UI LOGIN MODAL ====
function showLogin() {
  document.getElementById('loginModal').style.display = 'block';
}
function hideLogin() {
  document.getElementById('loginModal').style.display = 'none';
}
window.onclick = function(event) {
  const modal = document.getElementById('loginModal');
  if(event.target === modal) {
    hideLogin();
  }
};

// ==== UI UPDATES ====
function updateUILoggedIn() {
  const btn = document.querySelector('.void-btn');
  btn.textContent = user.username;
  btn.onclick = () => {
    window.location.href = "profile.html";
  };
  document.getElementById('post-theory').style.display = 'block';
}
function updateUILoggedOut() {
  const btn = document.querySelector('.void-btn');
  btn.textContent = 'Enter the Void';
  btn.onclick = showLogin;
  document.getElementById('post-theory').style.display = 'none';
}

// ==== THEORIES STORAGE ====
function loadTheories() {
  const data = localStorage.getItem(THEORIES_KEY);
  if(data) {
    theories = JSON.parse(data);
  } else {
    // Seed with some example theories
    theories = [
      {
        id: generateId(),
        title: "Parallel Universe Overlap",
        category: "Parallel",
        content: "Our reality overlaps with parallel dimensions, explaining déjà vu.",
        author: "MysticOne",
        likes: 42,
        date: Date.now(),
        comments: []
      },
      {
        id: generateId(),
        title: "AI Consciousness",
        category: "Consciousness",
        content: "Advanced AI can develop consciousness and influence the future.",
        author: "TechGuru",
        likes: 36,
        date: Date.now() - 86400000,
        comments: []
      },
      {
        id: generateId(),
        title: "Ancient Alien Tech",
        category: "Conspiracies",
        content: "Aliens gave humans advanced tech thousands of years ago.",
        author: "TruthSeeker",
        likes: 55,
        date: Date.now() - 172800000,
        comments: []
      },
    ];
    saveTheories();
  }
}
function saveTheories() {
  localStorage.setItem(THEORIES_KEY, JSON.stringify(theories));
}
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// ==== RENDER TRENDING THEORIES ====
function renderTrending() {
  const container = document.getElementById('featuredContainer');
  if(!container) return;
  // Trending = top 5 by likes desc
  let sorted = [...theories].sort((a,b) => b.likes - a.likes);
  let top5 = sorted.slice(0,5);
  container.innerHTML = '';
  top5.forEach(t => {
    const card = createTheoryCard(t);
    container.appendChild(card);
  });
}

// ==== RENDER THEORY FEED ====
function renderTheoryFeed(reset = true) {
  const feed = document.getElementById('theoryFeed');
  if(!feed) return;
  if(reset) {
    feed.innerHTML = '';
    currentLoadIndex = 0;
  }

  // Filter by category if set
  let filtered = filteredCategory ? theories.filter(t => t.category === filteredCategory) : theories;

  // Sort newest first
  filtered.sort((a,b) => b.date - a.date);

  // Pagination
  let toLoad = filtered.slice(currentLoadIndex, currentLoadIndex + loadCount);
  toLoad.forEach(t => {
    const card = createTheoryCard(t, true);
    feed.appendChild(card);
  });

  currentLoadIndex += loadCount;

  // Hide load more if no more
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if(currentLoadIndex >= filtered.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

// ==== CREATE THEORY CARD ====
function createTheoryCard(theory, allowComments = false) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = theory.title;
  card.appendChild(title);

  const meta = document.createElement('small');
  meta.textContent = `#${theory.category} — by ${theory.author} — ${new Date(theory.date).toLocaleDateString()}`;
  card.appendChild(meta);

  const content = document.createElement('p');
  content.textContent = theory.content;
  card.appendChild(content);

  const likeBtn = document.createElement('button');
  likeBtn.textContent = `❤️ ${theory.likes || 0}`;
  likeBtn.onclick = () => {
    if(!user) {
      alert('You must log in to like theories!');
      return;
    }
    if(user.likes.includes(theory.id)) {
      alert('You already liked this theory.');
      return;
    }
    theory.likes = (theory.likes || 0) + 1;
    user.likes.push(theory.id);
    saveUser();
    saveTheories();
    likeBtn.textContent = `❤️ ${theory.likes}`;
  };
  card.appendChild(likeBtn);

  // COMMENTS (if allowed)
  if(allowComments) {
    const commentsSection = document.createElement('div');
    commentsSection.className = 'comments-section';

    const commentsTitle = document.createElement('h4');
    commentsTitle.textContent = 'Comments';
    commentsSection.appendChild(commentsTitle);

    const commentList = document.createElement('div');
    commentList.id = `comments-${theory.id}`;
    commentsSection.appendChild(commentList);

    renderComments(theory, commentList);

    // Add comment form if logged in
    if(user) {
      const form = document.createElement('form');
      form.onsubmit = (e) => {
        e.preventDefault();
        const input = form.querySelector('input[name="comment"]');
        const commentText = input.value.trim();
        if(commentText === '') return;
        theory.comments.push({
          id: generateId(),
          author: user.username,
          text: commentText,
          date: Date.now()
        });
        saveTheories();
        renderComments(theory, commentList);
        input.value = '';
      };
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'comment';
      input.placeholder = 'Add a comment...';
      input.required = true;
      input.autocomplete = 'off';
      form.appendChild(input);

      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Post';
      form.appendChild(submitBtn);

      commentsSection.appendChild(form);
    }

    card.appendChild(commentsSection);
  }

  return card;
}

// ==== RENDER COMMENTS ====
function renderComments(theory, container) {
  container.innerHTML = '';
  if(!theory.comments || theory.comments.length === 0) {
    container.innerHTML = '<p>No comments yet.</p>';
    return;
  }
  theory.comments.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `<strong>${c.author}</strong>: ${c.text} <div class="timestamp">${new Date(c.date).toLocaleString()}</div>`;
    container.appendChild(div);
  });
}

// ==== FILTER CATEGORIES ====
document.querySelectorAll('.category').forEach(cat => {
  cat.addEventListener('click', () => {
    filteredCategory = cat.dataset.category;
    renderTheoryFeed();
  });
});

// ==== POST NEW THEORY ====
const theoryForm = document.getElementById('theoryForm');
if(theoryForm) {
  theoryForm.addEventListener('submit', e => {
    e.preventDefault();
    if(!user) {
      alert('You must be logged in to post theories.');
      return;
    }
    const formData = new FormData(theoryForm);
    const title = formData.get('title').trim();
    const category = formData.get('category');
    const content = formData.get('content').trim();
    const anonymous = formData.get('anonymous') === 'on';
    if(!title || !category || !content) {
      alert('Please fill all fields.');
      return;
    }
    const newTheory = {
      id: generateId(),
      title,
      category,
      content,
      author: anonymous ? 'Anonymous' : user.username,
      likes: 0,
      date: Date.now(),
      comments: []
    };
    theories.unshift(newTheory);
    if(!anonymous) {
      user.theoriesPublished.push(newTheory.id);
      saveUser();
    }
    saveTheories();
    theoryForm.reset();
    alert('Theory published!');
    renderTrending();
    renderTheoryFeed();
  });
}

// ==== DAILY AI GENERATED THEORY ====
function renderDailyTheory() {
  const dailyEl = document.getElementById('dailyAI');
  const dailyTheories = [
    "Time is a loop, and the future is the past's echo.",
    "Consciousness transcends the physical brain.",
    "Our dreams leak truths about parallel universes.",
    "The universe is a vast simulation, paused and resumed.",
    "Ancient civilizations communicated with stars.",
    "Quantum entanglement links all minds simultaneously.",
    "Dark matter is a consciousness we cannot perceive.",
    "Gravity fluctuates with collective human emotion."
  ];
  const today = new Date().toISOString().slice(0,10);
  let seed = 0;
  for(let i=0; i<today.length; i++) {
    seed += today.charCodeAt(i);
  }
  const index = seed % dailyTheories.length;
  if(dailyEl) dailyEl.textContent = dailyTheories[index];
}

// ==== PROFILE PAGE SETUP ====
function setupProfilePage() {
  if(!user) {
    alert('Please log in first.');
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('profileName').textContent = user.username;
  const avatarImg = document.getElementById('avatarPreview');
  avatarImg.src = user.avatar;

  // Stats
  document.getElementById('followers').textContent = user.followers.length || 0;
  document.getElementById('following').textContent = user.following.length || 0;
  document.getElementById('likes').textContent = user.likes.length || 0;
  document.getElementById('theoryCount').textContent = user.theoriesPublished.length || 0;

  // Load user's theories
  const userTheoriesDiv = document.getElementById('userTheories');
  userTheoriesDiv.innerHTML = '';
  const myTheories = theories.filter(t => t.author === user.username);
  if(myTheories.length === 0) {
    userTheoriesDiv.textContent = 'You have not posted any theories yet.';
  } else {
    myTheories.forEach(t => {
      const card = createTheoryCard(t);
      userTheoriesDiv.appendChild(card);
    });
  }

  // Avatar change
  const avatarInput = document.getElementById('avatarInput');
  const avatarContainer = document.querySelector('.avatar-container');
  avatarContainer.onclick = () => avatarInput.click();
  avatarInput.onchange = e => {
    const file = e.target.files[0];
    if(!file) return;
    if(!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      user.avatar = reader.result;
      avatarImg.src = user.avatar;
      saveUser();
    };
    reader.readAsDataURL(file);
  };
}

// ==== SCROLL TO POST FORM ====
function scrollToPost() {
  const postSection = document.getElementById('post-theory');
  if(postSection) {
    postSection.scrollIntoView({behavior: 'smooth'});
  }
}

// ==== LOAD MORE BUTTON ====
const loadMoreBtn = document.getElementById('loadMoreBtn');
if(loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    renderTheoryFeed(false);
  });
}
