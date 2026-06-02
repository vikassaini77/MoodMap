import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { db, uuidv4 } from './db.js';
import { predictMood, analyzeSentiment, burnoutRisk } from './mlClient.js';
import { generateCompanionResponse, generateWeeklyInsights, generateChatResponse, generateCouncilResponse } from './ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-fallback-key-for-dev';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, full_name } = req.body;
  try {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO profiles (id, email, password, full_name) VALUES ($1, $2, $3, $4)', [id, email, hashedPassword, full_name || 'User']);
    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
        token,
        user: { 
            id, email, name: full_name, streakDays: 1, currentMood: 'neutral', moodCoins: 100, xp: 50, level: 1, moodHistory: []
        } 
    });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed. Email might already exist.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const userRes = await db.query('SELECT * FROM profiles WHERE email = $1', [email]);
    const user = userRes.rows[0];
    
    if (user && await bcrypt.compare(password, user.password)) {
      const historyRes = await db.query('SELECT * FROM mood_entries WHERE user_id = $1 ORDER BY date DESC LIMIT 30', [user.id]);
      const historyRaw = historyRes.rows;
      
      const reverseMoodMapping = { 1: 'sad', 2: 'anxious', 3: 'neutral', 4: 'happy', 5: 'excited' };
      const history = historyRaw.map(h => ({
          date: h.date,
          mood: reverseMoodMapping[h.mood] || 'neutral',
          note: h.note,
          energy: h.energy_level
      }));

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
          token,
          user: { 
              id: user.id, 
              email: user.email, 
              name: user.full_name,
              streakDays: user.streak_count,
              currentMood: history.length > 0 ? history[0].mood : 'neutral',
              moodCoins: 120, 
              xp: 340, 
              level: 3,
              moodHistory: history 
          } 
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'test@gmail.com',
    pass: process.env.EMAIL_PASS || 'dummy-pass'
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const userRes = await db.query('SELECT * FROM profiles WHERE email = $1', [email]);
    const user = userRes.rows[0];
    if (!user) {
      // Don't leak that the email doesn't exist for security
      return res.json({ success: true, message: 'If an account with that email exists, we sent a password reset link.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    // Token expires in 1 hour
    const expires = new Date(Date.now() + 3600000);

    await db.query(
      'UPDATE profiles SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [hashedToken, expires, email]
    );

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}?resetToken=${resetToken}&email=${encodeURIComponent(email)}`;

    try {
      await transporter.sendMail({
        from: `"MoodMap X Support" <${process.env.EMAIL_USER || 'support@moodmap.app'}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px; text-align: center;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password for MoodMap X.</p>
            <p>Click the button below to set a new password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
          </div>
        `
      });
      console.log(`[AUTH] Sent password reset email to ${email}`);
    } catch (emailErr) {
      console.error('[AUTH] Failed to send email via SMTP, outputting link to console instead for dev:', emailErr.message);
      console.log(`[AUTH-DEV] Reset link for ${email}: ${resetLink}`);
    }

    res.json({ success: true, message: 'If an account with that email exists, we sent a password reset link.' });
  } catch (err) {
    console.error('[AUTH] Error in forgot-password:', err);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    const userRes = await db.query('SELECT * FROM profiles WHERE email = $1', [email]);
    const user = userRes.rows[0];

    if (!user || !user.reset_token || !user.reset_token_expires) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }

    if (new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ error: 'Password reset token has expired' });
    }

    const isValid = await bcrypt.compare(token, user.reset_token);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid password reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE profiles SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2',
      [hashedPassword, email]
    );

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('[AUTH] Error in reset-password:', err);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// Journal Routes
app.post('/api/journal', authenticateToken, async (req, res) => {
  try {
    const { user_id, date, mood, note, sleep_hours, energy_level } = req.body;
    
    const moodMapping = { 'sad': 1, 'anxious': 2, 'neutral': 3, 'calm': 3, 'happy': 4, 'excited': 5 };
    const moodNum = moodMapping[mood] || 3;
    const id = uuidv4();
    const uid = user_id || req.user.id;

    const insertRes = await db.query(`
      INSERT INTO mood_entries (id, user_id, date, mood, note, sleep_hours, energy_level) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id, date) DO UPDATE 
      SET mood = EXCLUDED.mood, note = EXCLUDED.note, sleep_hours = EXCLUDED.sleep_hours, energy_level = EXCLUDED.energy_level
      RETURNING id
    `, [id, uid, date, moodNum, note || '', sleep_hours || 7, energy_level || 5]);
    
    const realId = insertRes.rows[0].id;

    const responseText = await generateCompanionResponse(moodNum, sleep_hours || 7, energy_level || 5, note || '');
    await db.query('UPDATE mood_entries SET companion_response = $1 WHERE id = $2', [responseText, realId]);

    const risk = await burnoutRisk({
        sleep_hours: sleep_hours || 7,
        energy_level: energy_level || 5,
        mood: moodNum,
        note: note || '',
        day_of_week: new Date(date).getDay(),
        streak_count: 5,
        gratitude_count: 1
    });

    res.json({ success: true, companionResponse: responseText, mlRisk: risk });
  } catch (error) {
    console.error('Error saving journal:', error);
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

// Insights Route
app.post('/api/insights', authenticateToken, async (req, res) => {
  try {
    const uid = req.body.user_id || req.user.id;
    const logsRes = await db.query('SELECT * FROM mood_entries WHERE user_id = $1 ORDER BY date DESC', [uid]);
    const logs = logsRes.rows;
    
    const insights = await generateWeeklyInsights(logs);
    res.json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate weekly pattern report.' });
  }
});

// Chat Routes
app.post('/api/chat/sessions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;
    const sessionId = uuidv4();
    await db.query('INSERT INTO chat_sessions (id, user_id, title) VALUES ($1, $2, $3)', [sessionId, userId, title || 'New Chat']);
    res.json({ id: sessionId, title: title || 'New Chat' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

app.get('/api/chat/sessions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionsRes = await db.query('SELECT id, title, updated_at FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
    res.json({ sessions: sessionsRes.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
});

app.get('/api/chat/sessions/:id/history', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const historyRes = await db.query('SELECT role, content as text, image_url FROM chat_messages WHERE session_id = $1 AND user_id = $2 ORDER BY created_at ASC', [id, userId]);
    res.json({ history: historyRes.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { sessionId, messages, companionType, mood, imageBase64, customInstructions } = req.body;
    const userId = req.user.id;
    
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      await db.query('INSERT INTO chat_messages (id, user_id, session_id, role, content, image_url) VALUES ($1, $2, $3, $4, $5, $6)', [uuidv4(), userId, sessionId, 'user', lastUserMessage.text, imageBase64 || null]);
    }

    // Update session updated_at
    await db.query('UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [sessionId]);

    const reply = await generateChatResponse(messages, companionType, mood, userId, imageBase64, customInstructions);
    
    await db.query('INSERT INTO chat_messages (id, user_id, session_id, role, content) VALUES ($1, $2, $3, $4, $5)', [uuidv4(), userId, sessionId, 'companion', reply]);

    res.json({ reply });
  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({ error: 'Failed to generate chat response' });
  }
});

// Council Route
app.post('/api/council', authenticateToken, async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;
    const councilRes = await generateCouncilResponse(question, userId);
    res.json(councilRes);
  } catch (error) {
    console.error('Error generating council response:', error);
    res.status(500).json({ error: 'Failed to generate council response' });
  }
});

// Notifications Routes
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const notesRes = await db.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json({ notifications: notesRes.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Proactive AI Background Agent
cron.schedule('*/2 * * * *', async () => {
  console.log('[AGENT] Running proactive AI health check...');
  try {
    const usersRes = await db.query('SELECT id, full_name FROM profiles');
    const users = usersRes.rows;
    
    for (const user of users) {
      const notificationId = uuidv4();
      const message = `Hi ${user.full_name}, Kira here. I noticed you've been working hard. Remember to take a small break today! 🦊`;
      
      const recentRes = await db.query(
        "SELECT id FROM notifications WHERE user_id = $1 AND created_at > NOW() - INTERVAL '2 hours'",
        [user.id]
      );
      
      if (recentRes.rows.length === 0) {
        await db.query(
          'INSERT INTO notifications (id, user_id, title, message) VALUES ($1, $2, $3, $4)', 
          [notificationId, user.id, 'Proactive Check-in', message]
        );
        console.log(`[AGENT] Sent proactive notification to ${user.full_name}`);
      }
    }
  } catch (error) {
    console.error('[AGENT] Error in proactive background task:', error);
  }
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🧠 MoodMap Node.js Backend running on port ${PORT}`);
  console.log(`=========================================`);
});
