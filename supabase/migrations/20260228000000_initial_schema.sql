-- Habits RPG - Supabase Migration
-- 軽量化版: 7テーブル→5テーブルに統合

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== ENUMS =====
CREATE TYPE habit_category AS ENUM (
  'exercise', 'sleep', 'health', 'reading', 'study', 'learning',
  'meditation', 'journaling', 'gratitude', 'mindfulness',
  'music', 'art', 'craft', 'hobby',
  'communication', 'social', 'grooming',
  'workout', 'sports', 'fitness', 'other'
);

CREATE TYPE frequency_type AS ENUM ('daily', 'weekly', 'specific_days');
CREATE TYPE habit_difficulty AS ENUM ('easy', 'normal', 'hard', 'very_hard');
CREATE TYPE stat_type AS ENUM ('VIT', 'INT', 'MND', 'DEX', 'CHA', 'STR');
CREATE TYPE achievement_type AS ENUM ('streak', 'total', 'level', 'stat', 'special', 'first');
CREATE TYPE achievement_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE job_tier AS ENUM ('novice', 'apprentice', 'journeyman', 'expert', 'master', 'grandmaster');

-- ===== 1. USERS TABLE =====
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Supabase auth.users と連携
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Profile
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  timezone TEXT DEFAULT 'Asia/Tokyo',
  gender TEXT DEFAULT 'male', -- 'male' | 'female' | 'cat'
  
  -- Stats (各ステータスはレベルのみ保存、EXPは計算で導出)
  vitality INTEGER DEFAULT 1 CHECK (vitality >= 1 AND vitality <= 99),
  intelligence INTEGER DEFAULT 1 CHECK (intelligence >= 1 AND intelligence <= 99),
  mental INTEGER DEFAULT 1 CHECK (mental >= 1 AND mental <= 99),
  dexterity INTEGER DEFAULT 1 CHECK (dexterity >= 1 AND dexterity <= 99),
  charisma INTEGER DEFAULT 1 CHECK (charisma >= 1 AND charisma <= 99),
  strength INTEGER DEFAULT 1 CHECK (strength >= 1 AND strength <= 99),
  
  -- Level & EXP
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 99),
  total_exp INTEGER DEFAULT 0 CHECK (total_exp >= 0),
  
  -- Current Job
  current_job_id TEXT DEFAULT 'beginner',
  
  -- Streaks
  max_streak INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Indexes
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ===== 2. HABITS TABLE =====
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📝',
  color TEXT DEFAULT '#4CAF50',
  category habit_category DEFAULT 'other',
  group_category TEXT DEFAULT '未分類',
  stat_type stat_type DEFAULT 'VIT',
  
  -- Frequency
  frequency_type frequency_type DEFAULT 'daily',
  
  -- Difficulty
  difficulty habit_difficulty DEFAULT 'normal',
  
  -- Reminder
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_time TIME,
  
  -- Streaks
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  last_completed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own habits"
  ON habits FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_is_archived ON habits(is_archived) WHERE is_archived = FALSE;

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ===== 3. HABIT_RECORDS TABLE =====
CREATE TABLE habit_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Completion Info
  completed_date DATE NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  note TEXT,
  
  -- Stats at completion
  exp_earned INTEGER DEFAULT 0,
  streak_at_completion INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one record per habit per day
  UNIQUE(habit_id, completed_date)
);

ALTER TABLE habit_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own habit records"
  ON habit_records FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE INDEX idx_habit_records_habit_id ON habit_records(habit_id);
CREATE INDEX idx_habit_records_user_id ON habit_records(user_id);
CREATE INDEX idx_habit_records_completed_date ON habit_records(completed_date);


-- ===== 4. MASTER DATA: ACHIEVEMENTS & JOBS =====
-- Achievement Master (管理者のみ編集、全ユーザー読み取り可)
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  type achievement_type NOT NULL,
  rarity achievement_rarity NOT NULL,
  exp_reward INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT FALSE,
  
  -- Conditions
  target_value INTEGER DEFAULT 1,
  target_stat_type stat_type,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (TRUE);

-- Job Master
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  tier job_tier NOT NULL,
  
  -- Requirements (JSONB for flexibility)
  requirements JSONB DEFAULT '{}',
  
  -- Bonuses
  stat_bonuses JSONB DEFAULT '{}',
  exp_bonus FLOAT DEFAULT 1.0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (TRUE);


-- ===== 5. USER PROGRESS TABLE (統合) =====
-- UserAchievement と UserJob を統合
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Progress Type
  type TEXT NOT NULL CHECK (type IN ('achievement', 'job')),
  reference_id TEXT NOT NULL, -- achievement.id or job.id
  
  -- Status
  is_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  current_value INTEGER DEFAULT 0,
  
  -- Job-specific
  is_equipped BOOLEAN DEFAULT FALSE, -- job only
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, type, reference_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own progress"
  ON user_progress FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_type ON user_progress(type);
CREATE INDEX idx_user_progress_reference_id ON user_progress(reference_id);


-- ===== HELPER FUNCTIONS =====

-- Get user by auth_user_id
CREATE OR REPLACE FUNCTION get_user_by_auth_id(auth_id UUID)
RETURNS SETOF users AS $$
BEGIN
  RETURN QUERY SELECT * FROM users WHERE auth_user_id = auth_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate EXP for next level
CREATE OR REPLACE FUNCTION exp_for_level(level INT)
RETURNS INT AS $$
DECLARE
  total INT := 0;
  i INT;
BEGIN
  FOR i IN 1..(level - 1) LOOP
    total := total + FLOOR(100 * POWER(1.5, i - 1));
  END LOOP;
  RETURN total;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate streak multiplier
CREATE OR REPLACE FUNCTION streak_multiplier(streak INT)
RETURNS FLOAT AS $$
BEGIN
  IF streak >= 60 THEN RETURN 2.5;
  ELSIF streak >= 30 THEN RETURN 2.0;
  ELSIF streak >= 14 THEN RETURN 1.5;
  ELSIF streak >= 7 THEN RETURN 1.25;
  ELSIF streak >= 3 THEN RETURN 1.1;
  ELSE RETURN 1.0;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
