async function fetchPosts(){ const res = await fetch('/api/posts'); const data = await res.json(); return data.posts || []; }

function el(tag, attrs = {}, text = '') { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }

function renderPosts(posts){ const list = document.getElementById('postsList'); list.innerHTML = ''; posts.forEach(p => { const li = document.createElement('li'); li.className = 'post'; const vote = document.createElement('div'); vote.className = 'vote'; const upBtn = el('button', {}, '▲'); const score = el('div', {}, String(p.score || 0)); const downBtn = el('button', {}, '▼');
