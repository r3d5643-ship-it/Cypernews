async function fetchPosts(){ const res = await fetch('/api/posts'); const data = await res.json(); return data.posts || []; }

function el(tag, attrs = {}, text = '') { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }

function renderPosts(posts){ const list = document.getElementById('postsList'); list.innerHTML = ''; posts.forEach(p => { const li = document.createElement('li'); li.className = 'post'; const vote = document.createElement('div'); vote.className = 'vote'; const upBtn = el('button', {}, '▲'); const score = el('div', {}, String(p.score || 0)); const downBtn = el('button', {}, '▼');

Code
upBtn.onclick = async () => {
  await votePost(p.id, +1);
  refresh();
};
downBtn.onclick = async () => {
  await votePost(p.id, -1);
  refresh();
};

vote.appendChild(upBtn);
vote.appendChild(score);
vote.appendChild(downBtn);

const body = document.createElement('div');
body.className = 'body';
const title = document.createElement('h3');
if (p.url) {
  const a = el('a', { href: p.url, target: '_blank' }, p.title);
  title.appendChild(a);
} else {
  title.textContent = p.title;
}
const meta = el('div', { class: 'meta' }, `${new Date(p.created_at).toLocaleString()} • ${p.comments_count || 0} تعليقات`);
const content = document.createElement('div');
content.textContent = p.content || '';
body.appendChild(title);
body.appendChild(meta);
body.appendChild(content);

li.appendChild(vote);
li.appendChild(body);
list.appendChild(li);
}); }

async function votePost(id, value){ await fetch(/api/posts/${id}/vote, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ value }) }); }

async function refresh(){ const posts = await fetchPosts(); renderPosts(posts); }

document.getElementById('postForm').addEventListener('submit', async (e) => { e.preventDefault(); const title = document.getElementById('title').value.trim(); const url = document.getElementById('url').value.trim(); const content = document.getElementById('content').value.trim(); if (!title) return alert('الرجاء إدخال عنوان'); await fetch('/api/posts', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title, url: url || null, content: content || null }) });
