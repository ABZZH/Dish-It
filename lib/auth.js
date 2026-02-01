const { getDb } = require("./db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { cookies } = require("next/headers");

const SESSION_COOKIE = "dish_it_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

function createSession(userId) {
  const db = getDb();
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE).toISOString();

  db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(
    sessionId,
    userId,
    expiresAt
  );

  return sessionId;
}

function getSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;

  const db = getDb();
  const session = db
    .prepare(
      `SELECT s.*, u.id as user_id, u.username, u.email, u.display_name, u.bio, u.avatar_url
       FROM sessions s JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    )
    .get(sessionCookie.value);

  if (!session) return null;

  return {
    userId: session.user_id,
    username: session.username,
    email: session.email,
    displayName: session.display_name,
    bio: session.bio,
    avatarUrl: session.avatar_url,
  };
}

function deleteSession(sessionId) {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}

function signup({ username, email, password, displayName }) {
  const db = getDb();

  const existing = db
    .prepare("SELECT id FROM users WHERE username = ? OR email = ?")
    .get(username, email);
  if (existing) {
    return { error: "Username or email already exists" };
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare(
      "INSERT INTO users (username, email, password_hash, display_name) VALUES (?, ?, ?, ?)"
    )
    .run(username, email, passwordHash, displayName);

  const sessionId = createSession(result.lastInsertRowid);
  return { sessionId, userId: result.lastInsertRowid };
}

function login({ email, password }) {
  const db = getDb();

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return { error: "Invalid email or password" };
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  const sessionId = createSession(user.id);
  return { sessionId, userId: user.id };
}

module.exports = {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSession,
  getSession,
  deleteSession,
  signup,
  login,
};
