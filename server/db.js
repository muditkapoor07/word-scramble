const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS ws_users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ws_games (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES ws_users(id) ON DELETE CASCADE,
      category VARCHAR(50) NOT NULL,
      difficulty VARCHAR(20) NOT NULL,
      total_score INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      total_questions INTEGER DEFAULT 0,
      played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ws_scores (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES ws_users(id) ON DELETE CASCADE,
      game_id INTEGER REFERENCES ws_games(id) ON DELETE CASCADE,
      word VARCHAR(100) NOT NULL,
      result BOOLEAN NOT NULL,
      time_taken INTEGER NOT NULL,
      score INTEGER DEFAULT 0,
      category VARCHAR(50),
      difficulty VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ws_hints_usage (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES ws_users(id) ON DELETE CASCADE,
      usage_date DATE DEFAULT CURRENT_DATE,
      hints_used INTEGER DEFAULT 0,
      UNIQUE(user_id, usage_date)
    )
  `;

  console.log('Word Scramble database tables created/verified successfully');
}

module.exports = { sql, setupDatabase };
