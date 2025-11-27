const express = require('express'); const path = require('path'); const bodyParser = require('body-parser'); const helmet = require('helmet'); const cors = require('cors'); const db = require('./db');

const app = express(); app.use(helmet()); app.use(cors()); app.use(bodyParser.json()); app.use(express.static(path.join(__dirname, 'public')));

// Helper queries const getPostsStmt = db.prepare('SELECT id, title, url, content, score, comments_count, created_at FROM posts ORDER BY created_at DESC LIMIT 100'); const insertPostStmt = db.prepare('INSERT INTO posts (title, url, content, author_id) VALUES (?, ?, ?)'); const getPostById = db.prepare('SELECT * FROM posts WHERE id = ?'); const incScoreStmt = db.prepare('UPDATE posts SET score = score + ? WHERE id = ?'); const insertComment = db.prepare('INSERT INTO comments (post_id, author_id, content) VALUES (?, ?, ?)'); const getCommentsForPost = db.prepare('SELECT id, post_id, content, created_at FROM comments WHERE post_id = ? ORDER BY created_at ASC'); const updateCommentsCount = db.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?');

// Public API app.get('/api/posts', (req, res) => { const posts = getPostsStmt.all(); res.json({ ok: true, posts }); });

app.post('/api/posts', (req, res) => { const { title, url, content } = req.body || {}; if (!title || (typeof title !== 'string') || title.length > 300) { return res.status(400).json({ ok: false, error: 'Invalid title' }); } const info = insertPostStmt.run(title.trim(), url || null, content || null); const post = getPostById.get(info.lastInsertRowid); res.json({ ok: true, post }); });

app.post('/api/posts/:id/vote', (req, res) => { const id = Number(req.params.id); const { value } = req.body; // expect +1 or -1 if (![1, -1].includes(value)) return res.status(400).json({ ok: false, error: 'Invalid vote' }); const post = getPostById.get(id); if (!post) return res.status(404).json({ ok: false, error: 'Post not found' }); incScoreStmt.run(value, id); const updated = getPostById.get(id); res.json({ ok: true, post: updated }); });

app.get('/api/posts/:id/comments', (req, res) => { const postId = Number(req.params.id); const post = getPostById.get(postId); if (!post) return res.status(404).json({ ok: false, error: 'Post not found' }); const comments = getCommentsForPost.all(postId); res.json({ ok: true, comments }); });

app.post('/api/posts/:id/comments', (req, res) => { const postId = Number(req.params.id); const { content } = req.body || {}; if (!content || content.trim().length === 0) return res.status(400).json({ ok: false, error: 'Empty comment' }); const post = getPostById.get(postId); if (!post) return res.status(404).json({ ok: false, error: 'Post not found' }); const info = insertComment.run(postId, null, content.trim()); updateCommentsCount.run(postId); const comments = getCommentsForPost.all(postId); res.json({ ok: true, comments }); });

// Fallback to serve index.html app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

const port = process.env.PORT || 3000; app.listen(port, () => { console.log(Server running on http://localhost:${port}); });
