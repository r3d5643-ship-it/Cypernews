 const Database = require('better-sqlite3'); const db = new Database('./data.db');
db.prepare(CREATE TABLE IF NOT EXISTS users (   id INTEGER PRIMARY KEY AUTOINCREMENT,   username TEXT UNIQUE,   password_hash TEXT,   is_admin INTEGER DEFAULT 0,   created_at DATETIME DEFAULT CURRENT_TIMESTAMP )).run();

db.prepare(CREATE TABLE IF NOT EXISTS posts (   id INTEGER PRIMARY KEY AUTOINCREMENT,   title TEXT NOT NULL,   url TEXT,   content TEXT,   author_id INTEGER,   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,   score INTEGER DEFAULT 0,   comments_count INTEGER DEFAULT 0,   FOREIGN KEY(author_id) REFERENCES users(id) )).run();

db.prepare(CREATE TABLE IF NOT EXISTS comments (   id INTEGER PRIMARY KEY AUTOINCREMENT,   post_id INTEGER NOT NULL,   author_id INTEGER,   content TEXT NOT NULL,   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,   FOREIGN KEY(post_id) REFERENCES posts(id),   FOREIGN KEY(author_id) REFERENCES users(id) )).run();

db.prepare(CREATE TABLE IF NOT EXISTS votes (   id INTEGER PRIMARY KEY AUTOINCREMENT,   post_id INTEGER NOT NULL,   user_id INTEGER,   value INTEGER NOT NULL,   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,   UNIQUE(post_id, user_id),   FOREIGN KEY(post_id) REFERENCES posts(id),   FOREIGN KEY(user_id) REFERENCES users(id) )).run();
