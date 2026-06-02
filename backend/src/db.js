import pkg from 'pg';
const { Pool } = pkg;
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        streak_count INTEGER DEFAULT 0,
        reset_token TEXT,
        reset_token_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS mood_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        mood INTEGER NOT NULL,
        note TEXT,
        sleep_hours REAL NOT NULL,
        energy_level INTEGER NOT NULL,
        companion_response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES profiles(id),
        UNIQUE(user_id, date)
      );

      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES profiles(id)
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        session_id TEXT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES profiles(id),
        FOREIGN KEY(session_id) REFERENCES chat_sessions(id)
      );
      
      DO $$
      BEGIN
        BEGIN
          ALTER TABLE profiles ADD COLUMN reset_token TEXT;
        EXCEPTION WHEN duplicate_column THEN NULL;
        END;
        BEGIN
          ALTER TABLE profiles ADD COLUMN reset_token_expires TIMESTAMP;
        EXCEPTION WHEN duplicate_column THEN NULL;
        END;
        BEGIN
          ALTER TABLE chat_messages ADD COLUMN session_id TEXT REFERENCES chat_sessions(id);
        EXCEPTION WHEN duplicate_column THEN NULL;
        END;
        BEGIN
          ALTER TABLE chat_messages ADD COLUMN image_url TEXT;
        EXCEPTION WHEN duplicate_column THEN NULL;
        END;
      END $$;

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES profiles(id)
      );
    `);
    console.log('✅ PostgreSQL Database connected and schema initialized.');
  } catch (err) {
    console.error('❌ Failed to initialize database schema:', err);
  }
};

initializeDatabase();

// Wrapper around pool.query to make it easier to transition
// Instead of db.prepare().run(), we'll export the pool directly.
export { pool as db, uuidv4 };
