 async function fetchPosts(){ const res = await fetch('/api/posts'); const data = await res.json(); return data.posts || []; }
