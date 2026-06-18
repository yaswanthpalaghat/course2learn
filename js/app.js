/* =====================================================
   Course2Learn: App.js
   Hash-based SPA | course2learn.in
   ===================================================== */

const App = (() => {
  'use strict';

  // ---- State ----
  let allCourses = [];
  let loaded = false;

  // ─── 55 CATEGORIES ───────────────────────────────────────────────────────
  const CATS = {
    // ── AI & Data ──────────────────────────────────────────────────────────
    'ai':                 { label: 'AI & Machine Learning',   icon: '🤖', desc: 'ChatGPT, GPT-4, LLMs, neural networks and AI tools.', group: 'AI & Data' },
    'machine-learning':   { label: 'Machine Learning',        icon: '🧠', desc: 'Supervised, unsupervised, reinforcement learning & MLOps.', group: 'AI & Data' },
    'deep-learning':      { label: 'Deep Learning',           icon: '⚡', desc: 'Neural networks, TensorFlow, PyTorch, CNNs, RNNs.', group: 'AI & Data' },
    'prompt-engineering': { label: 'Prompt Engineering',      icon: '💬', desc: 'Craft effective prompts for ChatGPT, Claude & Gemini.', group: 'AI & Data' },
    'data-science':       { label: 'Data Science',            icon: '🔬', desc: 'End-to-end data science with Python, statistics & ML.', group: 'AI & Data' },
    'data-analytics':     { label: 'Data Analytics',          icon: '📊', desc: 'Excel, Power BI, Tableau, SQL for business insights.', group: 'AI & Data' },
    'excel':              { label: 'Excel & Sheets',          icon: '📗', desc: 'Excel formulas, pivot tables, Google Sheets, dashboards.', group: 'AI & Data' },
    'power-bi':           { label: 'Power BI',                icon: '📈', desc: 'Microsoft Power BI dashboards, DAX, data modeling.', group: 'AI & Data' },
    'tableau':            { label: 'Tableau',                 icon: '📉', desc: 'Tableau visualizations, calculated fields, storytelling.', group: 'AI & Data' },
    'sql':                { label: 'SQL & Databases',         icon: '🗄️', desc: 'SQL queries, joins, stored procedures, PostgreSQL, MySQL.', group: 'AI & Data' },
    // ── Programming ────────────────────────────────────────────────────────
    'programming':        { label: 'Programming',             icon: '💻', desc: 'Learn coding from scratch: Python, JS, Java, C++ & more.', group: 'Programming' },
    'python':             { label: 'Python',                  icon: '🐍', desc: 'Python basics to advanced: automation, scripting, Django.', group: 'Programming' },
    'javascript':         { label: 'JavaScript',              icon: '🟨', desc: 'ES6+, DOM manipulation, async JS, TypeScript basics.', group: 'Programming' },
    'react':              { label: 'React & Frontend',        icon: '⚛️', desc: 'React.js, Next.js, Tailwind, component-driven UI.', group: 'Programming' },
    'nodejs':             { label: 'Node.js & Backend',       icon: '🟩', desc: 'Express, REST APIs, authentication, MongoDB with Node.', group: 'Programming' },
    'mobile-dev':         { label: 'Mobile Development',      icon: '📱', desc: 'Flutter, React Native, Android (Kotlin), iOS (Swift).', group: 'Programming' },
    'database':           { label: 'Database Design',         icon: '🗃️', desc: 'Relational & NoSQL databases, schema design, indexing.', group: 'Programming' },
    'linux':              { label: 'Linux & Command Line',    icon: '🖥️', desc: 'Linux administration, bash scripting, shell commands.', group: 'Programming' },
    'docker':             { label: 'Docker & Kubernetes',     icon: '🐳', desc: 'Containerization, orchestration, microservices deployment.', group: 'Programming' },
    'devops':             { label: 'DevOps & CI/CD',          icon: '⚙️', desc: 'GitHub Actions, Jenkins, Terraform, monitoring, pipelines.', group: 'Programming' },
    'cloud-computing':    { label: 'Cloud Computing',         icon: '☁️', desc: 'AWS, Google Cloud, Azure: architecture, certifications.', group: 'Programming' },
    'blockchain':         { label: 'Blockchain & Web3',       icon: '⛓️', desc: 'Ethereum, Solidity, NFTs, DeFi, smart contracts.', group: 'Programming' },
    'game-dev':           { label: 'Game Development',        icon: '🎮', desc: 'Unity, Unreal Engine, Godot, 2D/3D game design.', group: 'Programming' },
    // ── Cybersecurity ──────────────────────────────────────────────────────
    'cybersecurity':      { label: 'Cybersecurity',           icon: '🛡️', desc: 'Ethical hacking, network security, CEH, CISSP prep.', group: 'Cybersecurity' },
    // ── Digital Marketing ──────────────────────────────────────────────────
    'digital-marketing':  { label: 'Digital Marketing',       icon: '📣', desc: 'Full-stack digital marketing: SEO, paid ads, social media, email and more.', group: 'Digital Marketing' },
    'seo':                { label: 'SEO',                     icon: '🔍', desc: 'On-page SEO, technical SEO, link building, rank on Google.', group: 'Digital Marketing' },
    'paid-advertising':   { label: 'Paid Advertising',        icon: '💸', desc: 'Google Ads, Meta Ads, YouTube Ads. Master PPC campaigns from scratch.', group: 'Digital Marketing' },
    'social-media':       { label: 'Social Media Marketing',  icon: '📲', desc: 'Instagram, LinkedIn, Twitter, YouTube growth strategies.', group: 'Digital Marketing' },
    'content-marketing':  { label: 'Content Marketing',       icon: '✍️', desc: 'Blog writing, SEO content, copywriting, storytelling.', group: 'Digital Marketing' },
    'email-marketing':    { label: 'Email Marketing',         icon: '📧', desc: 'Mailchimp, automation sequences, list building, A/B testing.', group: 'Digital Marketing' },
    'affiliate-marketing':{ label: 'Affiliate Marketing',     icon: '🤝', desc: 'Build passive income with affiliate marketing strategies.', group: 'Digital Marketing' },
    'youtube-marketing':  { label: 'YouTube Marketing',       icon: '▶️', desc: 'YouTube SEO, thumbnails, scripts, monetization strategies.', group: 'Digital Marketing' },
    'ecommerce-marketing':{ label: 'E-commerce Marketing',    icon: '🛒', desc: 'Shopify, WooCommerce, Meesho, Amazon seller strategies.', group: 'Digital Marketing' },
    // ── Design & Creative ──────────────────────────────────────────────────
    'design':             { label: 'Design',                  icon: '🎨', desc: 'UI/UX, graphic design, Figma, Canva, Photoshop.', group: 'Design & Creative' },
    'ui-ux':              { label: 'UI/UX Design',            icon: '🖱️', desc: 'User research, wireframing, Figma, prototyping, usability.', group: 'Design & Creative' },
    'graphic-design':     { label: 'Graphic Design',          icon: '🖼️', desc: 'Logo design, branding, print, Illustrator, CorelDRAW.', group: 'Design & Creative' },
    'video-editing':      { label: 'Video Editing',           icon: '🎬', desc: 'Premiere Pro, DaVinci Resolve, Final Cut Pro, reels.', group: 'Design & Creative' },
    'photo-editing':      { label: 'Photo Editing',           icon: '📸', desc: 'Photoshop, Lightroom, portrait & product photo editing.', group: 'Design & Creative' },
    'canva':              { label: 'Canva Design',            icon: '🎭', desc: 'Create stunning designs: posts, presentations, logos.', group: 'Design & Creative' },
    'motion-graphics':    { label: 'Motion Graphics',         icon: '🎥', desc: 'After Effects, animations, intros, logo reveals.', group: 'Design & Creative' },
    // ── Finance & Business ─────────────────────────────────────────────────
    'finance':            { label: 'Finance & Investing',     icon: '💰', desc: 'Stock market, mutual funds, options, financial planning.', group: 'Finance & Business' },
    'stock-market':       { label: 'Stock Market Trading',    icon: '📊', desc: 'Technical analysis, F&O, intraday, long-term investing.', group: 'Finance & Business' },
    'crypto':             { label: 'Cryptocurrency',          icon: '₿', desc: 'Bitcoin, altcoins, trading, DeFi, Web3 investing.', group: 'Finance & Business' },
    'accounting':         { label: 'Accounting & GST',        icon: '🧾', desc: 'Tally, GST filing, balance sheet, income tax returns.', group: 'Finance & Business' },
    'business':           { label: 'Business Strategy',       icon: '🚀', desc: 'Entrepreneurship, lean startup, product-market fit, scaling.', group: 'Finance & Business' },
    'entrepreneurship':   { label: 'Entrepreneurship',        icon: '💡', desc: 'Start, build, and grow your own business from scratch.', group: 'Finance & Business' },
    'project-management': { label: 'Project Management',      icon: '📋', desc: 'PMP, Agile, Scrum, Kanban, JIRA, risk management.', group: 'Finance & Business' },
    'sales':              { label: 'Sales & CRM',             icon: '🤜', desc: 'B2B sales, cold calling, CRM tools, negotiation skills.', group: 'Finance & Business' },
    'freelancing':        { label: 'Freelancing',             icon: '🧑‍💻', desc: 'Build a freelance career on Fiverr, Upwork, Toptal.', group: 'Finance & Business' },
    // ── Personal Development ───────────────────────────────────────────────
    'english-speaking':   { label: 'English Speaking',        icon: '🗣️', desc: 'Spoken English, grammar, fluency, accent training.', group: 'Personal Development' },
    'communication':      { label: 'Communication Skills',    icon: '🗨️', desc: 'Business communication, presentation, body language.', group: 'Personal Development' },
    'productivity':       { label: 'Productivity',            icon: '⏰', desc: 'Time management, goal setting, Notion, Obsidian.', group: 'Personal Development' },
    'interview-prep':     { label: 'Interview Preparation',   icon: '🎤', desc: 'Crack coding, HR, and behavioral interviews with confidence.', group: 'Personal Development' },
    'public-speaking':    { label: 'Public Speaking',         icon: '🎙️', desc: 'Overcome stage fright, deliver impactful presentations.', group: 'Personal Development' },
    // ── Other ──────────────────────────────────────────────────────────────
    'other':              { label: 'Other Skills',            icon: '🌟', desc: 'MS Office, personality development, aptitude, and more.', group: 'Other' },
  };

  const CAT_GROUPS = ['AI & Data', 'Programming', 'Cybersecurity', 'Digital Marketing', 'Design & Creative', 'Finance & Business', 'Personal Development'];

  const CAT_COLORS = {
    'ai':                 '#ECFDF5', 'machine-learning':   '#F0FDF4', 'deep-learning':      '#D1FAE5',
    'prompt-engineering': '#ECFDF5', 'data-science':       '#F0FDF4', 'data-analytics':     '#ECFDF5',
    'excel':              '#F0FDF4', 'power-bi':           '#EFF6FF', 'tableau':            '#EFF6FF',
    'sql':                '#F0F9FF', 'programming':        '#EFF6FF', 'python':             '#FEFCE8',
    'javascript':         '#FFFDE7', 'react':              '#E0F7FA', 'nodejs':             '#F0FDF4',
    'mobile-dev':         '#FFF3E0', 'database':           '#F0F4FF', 'linux':              '#F1F5F9',
    'docker':             '#E0F7FA', 'devops':             '#F0FDF4', 'cloud-computing':    '#EFF6FF',
    'blockchain':         '#F3E5F5', 'game-dev':           '#FFF0F3', 'cybersecurity':      '#FFF1F2',
    'digital-marketing':  '#FFF7ED', 'seo':                '#FFF7ED', 'paid-advertising':   '#FFF3E0',
    'social-media':       '#FFF0F5', 'content-marketing':  '#FFF7ED', 'email-marketing':    '#FFF8E1',
    'affiliate-marketing':'#F0FDF4', 'youtube-marketing':  '#FFF0F0', 'ecommerce-marketing':'#FFF3E0',
    'design':             '#FDF4FF', 'ui-ux':              '#F5F3FF', 'graphic-design':     '#FDF4FF',
    'video-editing':      '#FFF0F0', 'photo-editing':      '#FFF3E0', 'canva':              '#FFF0F5',
    'motion-graphics':    '#FFF0F0', 'finance':            '#FFFBEB', 'stock-market':       '#FFFBEB',
    'crypto':             '#F7F5F0', 'accounting':         '#F0FDF4', 'business':           '#F0FDF4',
    'entrepreneurship':   '#FFF7ED', 'project-management': '#EFF6FF', 'sales':              '#F0FDF4',
    'freelancing':        '#FFFBEB', 'english-speaking':   '#FFF0F5', 'communication':      '#FFF3E0',
    'productivity':       '#ECFDF5', 'interview-prep':     '#EFF6FF', 'public-speaking':    '#FFF0F5',
    'other':              '#F8FAFC',
  };

  const ITEMS_PER_PAGE = 24;

  // ---- Helpers ----
  function fmtStudents(n) {
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n/1000).toFixed(1) + 'K';
    return n;
  }
  function stars(r) {
    const full = Math.floor(r), half = r % 1 >= 0.5 ? 1 : 0;
    let s = '★'.repeat(full);
    if (half) s += '☆';
    return s;
  }
  function levelLabel(l) {
    return { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }[l] || l;
  }
  function langLabel(l) {
    return { english: '🇬🇧 English', hindi: '🇮🇳 Hindi', telugu: '🇮🇳 Telugu', tamil: '🇮🇳 Tamil' }[l] || l;
  }
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function getHash() { return window.location.hash.slice(1) || '/'; }
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  // ---- Data Loading ----
  async function loadCourses() {
    if (loaded) return allCourses;
    try {
      const res = await fetch('data/courses.json');
      allCourses = await res.json();
      loaded = true;
    } catch(e) {
      console.error('Failed to load courses:', e);
      allCourses = [];
    }
    return allCourses;
  }

  // ---- Search + Filter ----
  function filterCourses(params = {}) {
    let list = [...allCourses];

    // Text search
    if (params.q) {
      const q = params.q.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.provider || '').toLowerCase().includes(q) ||
        (c.instructor || '').toLowerCase().includes(q) ||
        (c.tags || []).some(t => t.toLowerCase().includes(q)) ||
        (c.skills || []).some(s => s.toLowerCase().includes(q)) ||
        (c.description || '').toLowerCase().includes(q)
      );
    }
    if (params.category) list = list.filter(c => c.category === params.category);
    if (params.free === 'true') list = list.filter(c => c.isFree);
    if (params.cert === 'true') list = list.filter(c => c.hasCertificate);
    if (params.lang)  list = list.filter(c => c.language === params.lang);
    if (params.level) list = list.filter(c => c.level === params.level);

    // Multiple levels
    if (params.levels) {
      const lvls = params.levels.split(',');
      list = list.filter(c => lvls.includes(c.level));
    }

    // Sort
    const sort = params.sort || 'rating';
    if (sort === 'rating')   list.sort((a,b) => b.rating - a.rating);
    if (sort === 'students') list.sort((a,b) => b.students - a.students);
    if (sort === 'newest')   list.sort((a,b) => (b.updatedAt||'').localeCompare(a.updatedAt||''));
    if (sort === 'free')     list.sort((a,b) => a.isFree === b.isFree ? 0 : a.isFree ? -1 : 1);

    return list;
  }

  function parseQueryString(qs = '') {
    const params = {};
    if (!qs) return params;
    qs.replace(/^\?/, '').split('&').forEach(p => {
      const [k, v] = p.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return params;
  }

  // ---- Card Rendering ----
  function renderCourseCard(c) {
    const bg  = CAT_COLORS[c.category] || '#F9FAFB';
    const ico = CATS[c.category]?.icon || '📚';
    return `
    <div class="course-card" onclick="App.goCourse(${c.id})">
      <div class="card-thumb">
        <div class="card-thumb-bg" style="background:${bg}">${ico}</div>
        <div class="card-badges">
          ${c.isFree ? '<span class="badge badge-free">Free</span>' : ''}
          ${c.hasCertificate ? '<span class="badge badge-cert">🏆 Cert</span>' : ''}
          ${c.isFeatured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
          <span class="badge badge-level-${c.level}">${levelLabel(c.level)}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-provider">${esc(c.provider)}</div>
        <div class="card-title">${esc(c.title)}</div>
        <div class="card-instructor">by ${esc(c.instructor)}</div>
        <div class="card-meta">
          <span class="card-rating">
            <span class="card-rating-stars">${stars(c.rating)}</span>
            ${c.rating}
          </span>
          <span class="card-students">${fmtStudents(c.students)} students</span>
          <span class="card-duration">⏱ ${c.duration}h</span>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-price ${c.isFree ? 'free-price' : ''}">${c.isFree ? 'Free' : esc(c.price)}</div>
        <div class="card-btn">View Course</div>
      </div>
    </div>`;
  }

  function renderSkeletons(n = 8) {
    return Array(n).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton sk-thumb"></div>
        <div class="sk-body">
          <div class="skeleton sk-line sk-short"></div>
          <div class="skeleton sk-line sk-title"></div>
          <div class="skeleton sk-line sk-short"></div>
          <div class="skeleton sk-line" style="width:70%"></div>
        </div>
      </div>`).join('');
  }

  // ---- Pagination ----
  function renderPagination(total, currentPage, params) {
    const pages = Math.ceil(total / ITEMS_PER_PAGE);
    if (pages <= 1) return '';
    let html = '<div class="pagination">';
    const makeHref = (p) => {
      const ps = { ...params, page: p };
      return '#/search?' + Object.entries(ps).filter(([,v])=>v).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&');
    };
    if (currentPage > 1) html += `<a href="${makeHref(currentPage-1)}" class="page-btn">‹</a>`;
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - currentPage) <= 2) {
        html += `<a href="${makeHref(i)}" class="page-btn${i===currentPage?' active':''}">${i}</a>`;
      } else if (Math.abs(i - currentPage) === 3) {
        html += '<span class="page-btn ellipsis">…</span>';
      }
    }
    if (currentPage < pages) html += `<a href="${makeHref(currentPage+1)}" class="page-btn">›</a>`;
    html += '</div>';
    return html;
  }

  // ---- Filter Sidebar ----
  function renderFilterSidebar(params, targetPath) {
    const makeFilter = (key, val, label) => {
      const checked = params[key] === val ? 'checked' : '';
      return `<label class="filter-option"><input type="radio" name="filter-${key}" value="${val}" ${checked} onchange="App.applyFilter('${key}','${val}')"> ${label}</label>`;
    };
    const makeCB = (key, val, label) => {
      const checked = params[key] === val ? 'checked' : '';
      return `<label class="filter-option"><input type="checkbox" ${checked} onchange="App.applyFilterToggle('${key}','${val}')"> ${label}</label>`;
    };
    return `
    <div class="filter-sidebar" id="filterSidebar">
      <h3>🔍 Filters</h3>
      <div class="filter-group">
        <h4>Price</h4>
        <label class="filter-option"><input type="radio" name="filter-free" ${!params.free ? 'checked' : ''} onchange="App.clearFilter('free')"> All Courses</label>
        ${makeCB('free','true','🎁 Free Only')}
        ${makeCB('cert','true','🏆 With Certificate')}
      </div>
      <div class="filter-group">
        <h4>Level</h4>
        <label class="filter-option"><input type="radio" name="filter-level" ${!params.level ? 'checked' : ''} onchange="App.clearFilter('level')"> All Levels</label>
        ${makeFilter('level','beginner','🟢 Beginner')}
        ${makeFilter('level','intermediate','🟡 Intermediate')}
        ${makeFilter('level','advanced','🔴 Advanced')}
      </div>
      <div class="filter-group">
        <h4>Language</h4>
        <label class="filter-option"><input type="radio" name="filter-lang" ${!params.lang ? 'checked' : ''} onchange="App.clearFilter('lang')"> All Languages</label>
        ${makeFilter('lang','english','🇬🇧 English')}
        ${makeFilter('lang','hindi','🇮🇳 Hindi')}
        ${makeFilter('lang','telugu','🇮🇳 Telugu')}
      </div>
      <button class="filter-clear" onclick="App.clearAllFilters()">✕ Clear All Filters</button>
    </div>`;
  }

  // Expose filter helpers
  window.App = window.App || {};
  Object.assign(window.App, {
    applyFilter(key, val) {
      const h = getHash();
      const [path, qs] = h.split('?');
      const params = parseQueryString(qs);
      params[key] = val; params.page = 1;
      window.location.hash = path + '?' + Object.entries(params).filter(([,v])=>v).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&');
    },
    applyFilterToggle(key, val) {
      const h = getHash();
      const [path, qs] = h.split('?');
      const params = parseQueryString(qs);
      if (params[key] === val) delete params[key]; else params[key] = val;
      params.page = 1;
      window.location.hash = path + '?' + Object.entries(params).filter(([,v])=>v).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&');
    },
    clearFilter(key) {
      const h = getHash();
      const [path, qs] = h.split('?');
      const params = parseQueryString(qs);
      delete params[key]; params.page = 1;
      window.location.hash = path + '?' + Object.entries(params).filter(([,v])=>v).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&');
    },
    clearAllFilters() {
      const h = getHash();
      const [path, qs] = h.split('?');
      const params = parseQueryString(qs);
      const keep = { q: params.q, category: params.category, sort: params.sort };
      window.location.hash = path + '?' + Object.entries(keep).filter(([,v])=>v).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&');
    },
  });

  // ---- Pages ----

  async function renderHome() {
    document.title = 'Course2Learn: Find Best Online Courses | Your Learning Assistant';
    const app = document.getElementById('app');
    app.innerHTML = `
      <!-- HERO -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge">📚 1000+ Courses · Free & Paid · English, Hindi & Telugu</div>
          <h1>Find Your Next <em>Learning Path</em></h1>
          <p>Discover courses from Udemy, Coursera, Google, YouTube and more. All in one place..</p>
          <div class="hero-search">
            <input type="text" id="heroSearch" placeholder="Search ChatGPT, Python, Excel, SEO…" onkeydown="if(event.key==='Enter') App.doSearch()" autocomplete="off"/>
            <button onclick="App.doSearch()">🔍 Search</button>
          </div>
          <div class="hero-pills">
            ${['ChatGPT','Python','Excel','SEO','Google Ads','Power BI','Ethical Hacking','Flutter','Stock Market','Canva','Prompt Engineering','Data Science'].map(t =>
              `<span class="hero-pill" onclick="App.quickSearch('${t}')">${t}</span>`
            ).join('')}
          </div>
          <div class="hero-stats">
            <div class="stat-item"><span class="stat-num">1800+</span><span class="stat-lbl">Courses Listed</span></div>
            <div class="stat-item"><span class="stat-num">15+</span><span class="stat-lbl">Top Platforms</span></div>
            <div class="stat-item"><span class="stat-num">55+</span><span class="stat-lbl">Categories</span></div>
            <div class="stat-item"><span class="stat-num">3</span><span class="stat-lbl">Languages</span></div>
          </div>
        </div>
      </section>

      <!-- CATEGORIES BY GROUP -->
      <section class="section-sm" style="background:var(--white); border-bottom:1px solid var(--gray-300);">
        <div class="container">
          <div class="section-header">
            <div><h2>Browse 55+ Categories</h2><p>From AI to Freelancing: every skill you need</p></div>
          </div>
          ${CAT_GROUPS.map(group => {
            const groupCats = Object.entries(CATS).filter(([,c]) => c.group === group);
            return `
            <div class="cat-group">
              <div class="cat-group-label">${group}</div>
              <div class="categories-grid" id="catGrid-${group.replace(/\s+/g,'-').toLowerCase()}">
                ${groupCats.map(([slug, cat]) => `
                  <a href="#/category/${slug}" class="cat-card">
                    <div class="cat-icon">${cat.icon}</div>
                    <div class="cat-name">${cat.label}</div>
                    <div class="cat-count" data-slug="${slug}">loading...</div>
                  </a>`).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>

      <!-- FEATURED COURSES (partner links, managed via data/featured.json) -->
      <section class="section" id="featuredSection" style="display:none">
        <div class="container">
          <div class="section-header">
            <div><h2>⭐ Featured Courses</h2><p>Handpicked partner courses</p></div>
            <a href="#/search?sort=rating" class="view-all">View All →</a>
          </div>
          <div class="courses-grid" id="featuredGrid"></div>
        </div>
      </section>

      <!-- FREE COURSES -->
      <section class="section" style="background:var(--primary-lt);">
        <div class="container">
          <div class="section-header">
            <div><h2>🎁 Free Courses</h2><p>Learn without spending a penny</p></div>
            <a href="#/search?free=true" class="view-all">View All →</a>
          </div>
          <div class="courses-grid" id="freeGrid">${renderSkeletons(4)}</div>
        </div>
      </section>

      <!-- LATEST COURSES -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <div><h2>🆕 Latest Additions</h2><p>Recently added courses</p></div>
            <a href="#/search?sort=newest" class="view-all">View All →</a>
          </div>
          <div class="courses-grid" id="latestGrid">${renderSkeletons(8)}</div>
        </div>
      </section>`;

    // Load courses + featured.json in parallel
    await loadCourses();
    let featuredLinks = [];
    try {
      const fr = await fetch('data/featured.json');
      featuredLinks = await fr.json();
    } catch(e) { featuredLinks = []; }

    // Featured partner links section (only show if data/featured.json has entries)
    if (featuredLinks.length > 0) {
      document.getElementById('featuredSection').style.display = '';
      document.getElementById('featuredGrid').innerHTML = featuredLinks.map(f => `
        <div class="course-card" onclick="window.open('${f.url}','_blank')">
          <div class="card-thumb">
            <div class="card-thumb-bg" style="background:${CAT_COLORS[f.category]||'#ECFDF5'}">${CATS[f.category]?.icon||'📚'}</div>
            <div class="card-badges">
              ${f.isFree ? '<span class="badge badge-free">Free</span>' : ''}
              ${f.hasCertificate ? '<span class="badge badge-cert">🏆 Cert</span>' : ''}
              <span class="badge badge-featured">⭐ Featured</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-provider">${esc(f.provider||'')}</div>
            <div class="card-title">${esc(f.title||'')}</div>
            <div class="card-instructor">by ${esc(f.instructor||'')}</div>
          </div>
          <div class="card-footer">
            <div class="card-price ${f.isFree?'free-price':''}">${f.isFree?'Free':esc(f.price||'')}</div>
            <div class="card-btn">View Course</div>
          </div>
        </div>`).join('');
    }

    const free   = allCourses.filter(c => c.isFree).sort((a,b) => b.rating-a.rating).slice(0, 4);
    const latest = [...allCourses].sort((a,b) => (b.updatedAt||'').localeCompare(a.updatedAt||'')).slice(0, 8);
    document.getElementById('freeGrid').innerHTML   = free.map(renderCourseCard).join('');
    document.getElementById('latestGrid').innerHTML = latest.map(renderCourseCard).join('');

    // Update cat counts
    document.querySelectorAll('.cat-count[data-slug]').forEach(el => {
      const slug = el.getAttribute('data-slug');
      const count = allCourses.filter(c => c.category === slug).length;
      el.textContent = count ? `${count} courses` : 'Coming soon';
    });
  }

  async function renderCategory(slug) {
    const cat = CATS[slug];
    if (!cat) { renderHome(); return; }
    document.title = `${cat.label} Courses | Course2Learn`;
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="cat-page-header">
        <div class="container">
          <h1>${cat.icon} ${cat.label}</h1>
          <p>${cat.desc}</p>
          <div class="hero-pills" style="margin-top:12px">
            ${['All','Beginner','Intermediate','Advanced','Free','Certificate'].map(f =>
              `<span class="hero-pill" onclick="App.catFilter('${slug}','${f}')">${f}</span>`
            ).join('')}
          </div>
        </div>
      </div>
      <div class="container" style="padding-bottom:56px">
        <div class="page-layout">
          ${renderFilterSidebar({category:slug}, slug)}
          <div class="results-main">
            <button class="filter-mobile-toggle" onclick="App.toggleFilterSidebar()">⚙️ Filters</button>
            <div class="sort-bar">
              <div class="results-count" id="resultCount">Loading…</div>
              <select class="sort-select" onchange="App.applyFilter('sort',this.value)">
                <option value="rating">Top Rated</option>
                <option value="students">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="free">Free First</option>
              </select>
            </div>
            <div class="courses-grid" id="coursesGrid">${renderSkeletons()}</div>
            <div id="paginationArea"></div>
          </div>
        </div>
      </div>`;

    await loadCourses();
    const filtered = filterCourses({ category: slug });
    document.getElementById('resultCount').innerHTML = `<strong>${filtered.length}</strong> courses in ${cat.label}`;
    document.getElementById('coursesGrid').innerHTML = filtered.slice(0, ITEMS_PER_PAGE).map(renderCourseCard).join('') || '<div class="no-courses"><h3>No courses found</h3><p>Try a different filter.</p></div>';
    document.getElementById('paginationArea').innerHTML = renderPagination(filtered.length, 1, {category: slug});
  }

  // Expose catFilter
  Object.assign(window.App, {
    catFilter(slug, filter) {
      const map = {
        'All': {}, 'Beginner': {level:'beginner'}, 'Intermediate': {level:'intermediate'},
        'Advanced': {level:'advanced'}, 'Free': {free:'true'}, 'Certificate': {cert:'true'}
      };
      const p = { category: slug, ...(map[filter]||{}) };
      window.location.hash = '/search?' + Object.entries(p).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&');
    },
    toggleFilterSidebar() {
      document.getElementById('filterSidebar')?.classList.toggle('mobile-open');
    }
  });

  async function renderSearch(params) {
    const { q, sort='rating', page=1, category, free, cert, lang, level } = params;
    const pageNum = parseInt(page) || 1;

    // Build title
    let title = 'Search Courses';
    if (q) title = `"${q}" Courses`;
    else if (free === 'true') title = 'Free Courses';
    else if (cert === 'true') title = 'Courses with Certificate';
    else if (lang) title = `${langLabel(lang)} Courses`;
    document.title = `${title} | Course2Learn`;

    const app = document.getElementById('app');

    // Build active filter chips
    const chips = [];
    if (free === 'true') chips.push(['free','Free']);
    if (cert === 'true') chips.push(['cert','With Certificate']);
    if (lang) chips.push(['lang', langLabel(lang)]);
    if (level) chips.push(['level', levelLabel(level)]);
    if (category) chips.push(['category', CATS[category]?.label || category]);

    app.innerHTML = `
      <div class="search-header">
        <div class="container">
          ${q ? `<h2>Results for <em>"${esc(q)}"</em></h2>` : `<h2>${title}</h2>`}
          ${chips.length ? `<div class="active-filters">
            ${chips.map(([k,v]) => `<span class="active-filter">${v}<button onclick="App.clearFilter('${k}')">×</button></span>`).join('')}
          </div>` : ''}
        </div>
      </div>
      <div class="container" style="padding-bottom:56px">
        <div class="page-layout">
          ${renderFilterSidebar(params, 'search')}
          <div class="results-main">
            <button class="filter-mobile-toggle" onclick="App.toggleFilterSidebar()">⚙️ Filters</button>
            <div class="sort-bar">
              <div class="results-count" id="resultCount">Searching…</div>
              <select class="sort-select" onchange="App.applyFilter('sort',this.value)" id="sortSel">
                <option value="rating"   ${sort==='rating'   ?'selected':''}>Top Rated</option>
                <option value="students" ${sort==='students' ?'selected':''}>Most Popular</option>
                <option value="newest"   ${sort==='newest'   ?'selected':''}>Newest</option>
                <option value="free"     ${sort==='free'     ?'selected':''}>Free First</option>
              </select>
            </div>
            <div class="courses-grid" id="coursesGrid">${renderSkeletons()}</div>
            <div id="paginationArea"></div>
          </div>
        </div>
      </div>`;

    await loadCourses();
    const all = filterCourses(params);
    const start  = (pageNum - 1) * ITEMS_PER_PAGE;
    const paged  = all.slice(start, start + ITEMS_PER_PAGE);

    document.getElementById('resultCount').innerHTML = `<strong>${all.length}</strong> courses found`;
    document.getElementById('coursesGrid').innerHTML = paged.length
      ? paged.map(renderCourseCard).join('')
      : `<div class="no-courses">
           <div class="empty-icon">🔍</div>
           <h3>No courses found</h3>
           <p>Try different keywords or remove some filters.</p>
           <a href="#/" class="btn-primary">Browse All Courses</a>
         </div>`;
    document.getElementById('paginationArea').innerHTML = renderPagination(all.length, pageNum, params);
  }

  async function renderCourseDetail(id) {
    await loadCourses();
    const course = allCourses.find(c => c.id === parseInt(id));
    if (!course) { window.location.hash = '/'; return; }

    document.title = `${course.title} | Course2Learn`;
    const cat = CATS[course.category] || { icon: '📚', label: course.category };
    const bg  = CAT_COLORS[course.category] || '#F9FAFB';

    document.getElementById('app').innerHTML = `
      <div class="detail-hero">
        <div class="container">
          <div class="detail-layout">
            <div class="detail-content">
              <div class="detail-breadcrumb">
                <a href="#/">Home</a><span>›</span>
                <a href="#/category/${course.category}">${cat.icon} ${cat.label}</a><span>›</span>
                <span>${course.title.substring(0,40)}…</span>
              </div>
              <h1 class="detail-title">${esc(course.title)}</h1>
              <div class="detail-meta-row">
                <span class="badge badge-level-${course.level}">${levelLabel(course.level)}</span>
                <span class="badge badge-${course.isFree?'free':'paid'}">${course.isFree ? '🎁 Free' : '💳 Paid'}</span>
                ${course.hasCertificate ? '<span class="badge badge-cert">🏆 Certificate</span>' : ''}
                <span style="font-size:.85rem;color:var(--gray-500)">${langLabel(course.language)}</span>
              </div>
              <div class="detail-rating" style="margin-bottom:12px">
                <span style="color:var(--accent);font-size:1.1rem">${stars(course.rating)}</span>
                <strong>${course.rating}</strong>
                <span style="font-size:.85rem;color:var(--gray-500)">(${fmtStudents(course.students)} students)</span>
              </div>
              <p class="detail-desc">${esc(course.description)}</p>
              <div class="detail-instructor" style="margin-top:12px">
                Instructor: <strong>${esc(course.instructor)}</strong> · Platform: <strong>${esc(course.provider)}</strong>
              </div>
            </div>
            <div class="detail-card">
              <div class="detail-card-thumb" style="background:${bg}">${cat.icon}</div>
              <div class="detail-card-body">
                <div class="detail-price ${course.isFree?'free':''}">${course.isFree ? 'Free' : esc(course.price)}</div>
                <a href="${esc(course.affiliate)}" target="_blank" rel="noopener" class="detail-enroll-btn" onclick="App.trackClick(${course.id})">
                  🎓 ${course.isFree ? 'Start Free Course' : 'Enroll Now'} →
                </a>
                <div class="detail-card-features">
                  <div class="detail-feature"><span class="icon">⏱</span> ${course.duration} hours of content</div>
                  <div class="detail-feature"><span class="icon">📶</span> ${levelLabel(course.level)}</div>
                  <div class="detail-feature"><span class="icon">🌐</span> ${langLabel(course.language)}</div>
                  ${course.hasCertificate ? '<div class="detail-feature"><span class="icon">🏆</span> Certificate of completion</div>' : ''}
                  <div class="detail-feature"><span class="icon">📱</span> Mobile & desktop access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-body">
        <div class="container">
          <h3 style="margin-bottom:12px">🧠 Skills You'll Learn</h3>
          <div class="skills-grid">
            ${(course.skills || []).map(s => `<span class="skill-tag">${esc(s)}</span>`).join('')}
          </div>
          <hr class="divider"/>
          <h3 style="margin-bottom:12px">📋 Course Details</h3>
          <div class="detail-specs">
            <div class="spec-item"><div class="spec-label">Provider</div><div class="spec-value">${esc(course.provider)}</div></div>
            <div class="spec-item"><div class="spec-label">Instructor</div><div class="spec-value">${esc(course.instructor)}</div></div>
            <div class="spec-item"><div class="spec-label">Duration</div><div class="spec-value">${course.duration} Hours</div></div>
            <div class="spec-item"><div class="spec-label">Level</div><div class="spec-value">${levelLabel(course.level)}</div></div>
            <div class="spec-item"><div class="spec-label">Language</div><div class="spec-value">${langLabel(course.language)}</div></div>
            <div class="spec-item"><div class="spec-label">Certificate</div><div class="spec-value">${course.hasCertificate ? '✅ Yes' : '❌ No'}</div></div>
            <div class="spec-item"><div class="spec-label">Price</div><div class="spec-value">${course.isFree ? 'Free' : esc(course.price)}</div></div>
            <div class="spec-item"><div class="spec-label">Rating</div><div class="spec-value">${course.rating} / 5 ⭐</div></div>
          </div>
          <hr class="divider"/>
          <div style="text-align:center;padding:32px 0">
            <a href="${esc(course.affiliate)}" target="_blank" rel="noopener" class="detail-enroll-btn" style="display:inline-block;max-width:360px;padding:16px 40px;font-size:1.1rem" onclick="App.trackClick(${course.id})">
              🎓 ${course.isFree ? 'Start Free Course' : 'Enroll Now'} →
            </a>
            <p style="margin-top:12px;font-size:.82rem;color:var(--gray-500)">You'll be redirected to ${esc(course.provider)}. Affiliate disclosure applies.</p>
          </div>
          <hr class="divider"/>
          <h3 style="margin-bottom:20px">📚 More ${cat.label} Courses</h3>
          <div class="courses-grid" id="relatedGrid"></div>
        </div>
      </div>`;

    // Related courses
    const related = allCourses.filter(c => c.category === course.category && c.id !== course.id).sort((a,b) => b.rating - a.rating).slice(0, 4);
    document.getElementById('relatedGrid').innerHTML = related.map(renderCourseCard).join('');
  }

  // ---- Router ----
  async function route() {
    const hash = getHash();
    const [path, qs] = hash.split('?');
    const params = parseQueryString(qs);
    const segs = path.split('/').filter(Boolean);

    // Update active nav link
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + hash.split('?')[0]);
    });

    if (!path || path === '/') {
      await renderHome();
    } else if (segs[0] === 'category' && segs[1]) {
      await renderCategory(segs[1]);
    } else if (segs[0] === 'search') {
      await renderSearch(params);
    } else if (segs[0] === 'course' && segs[1]) {
      await renderCourseDetail(segs[1]);
    } else {
      await renderHome();
    }
    window.scrollTo(0, 0);
  }

  // ---- Public API ----
  Object.assign(window.App, {
    doSearch() {
      const val = document.getElementById('heroSearch')?.value?.trim();
      if (val) window.location.hash = `/search?q=${encodeURIComponent(val)}`;
    },
    doNavSearch() {
      const val = document.getElementById('navSearchInput')?.value?.trim();
      if (val) window.location.hash = `/search?q=${encodeURIComponent(val)}`;
    },
    quickSearch(term) {
      window.location.hash = `/search?q=${encodeURIComponent(term)}`;
    },
    goCourse(id) {
      window.location.hash = `/course/${id}`;
    },
    toggleMobileNav() {
      document.getElementById('mobileNav')?.classList.toggle('open');
    },
    trackClick(id) {
      console.log('Affiliate click: course', id);
      // Future: send to analytics
    }
  });

  // ---- Init ----
  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', () => {
    route();
    // Nav search: press Enter
    document.getElementById('navSearchInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') App.doNavSearch();
    });
  });

  return window.App;
})();
