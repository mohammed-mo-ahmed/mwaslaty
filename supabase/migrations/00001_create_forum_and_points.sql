-- ═══════════════════════════════════════════
-- Migration 00001: Create forum and points tables
-- Run this in your Supabase Dashboard SQL Editor
-- ═══════════════════════════════════════════

-- 1. user_points
CREATE TABLE IF NOT EXISTS user_points (
  user_id TEXT PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 0,
  last_daily_claim_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_points_select" ON user_points;
DROP POLICY IF EXISTS "user_points_insert" ON user_points;
  DROP POLICY IF EXISTS "user_points_update" ON user_points;

CREATE POLICY "user_points_select" ON user_points
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "user_points_insert" ON user_points
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "user_points_update" ON user_points
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

GRANT SELECT, INSERT, UPDATE ON user_points TO authenticated;

-- 2. points_transactions
CREATE TABLE IF NOT EXISTS points_transactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "points_transactions_select" ON points_transactions;
DROP POLICY IF EXISTS "points_transactions_insert" ON points_transactions;

CREATE POLICY "points_transactions_select" ON points_transactions
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "points_transactions_insert" ON points_transactions
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

  CREATE INDEX IF NOT EXISTS idx_points_transactions_user ON points_transactions(user_id);

GRANT SELECT, INSERT ON points_transactions TO authenticated;
GRANT USAGE ON SEQUENCE points_transactions_id_seq TO authenticated;

-- 3. forum_posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "forum_posts_select" ON forum_posts;
DROP POLICY IF EXISTS "forum_posts_insert" ON forum_posts;

CREATE POLICY "forum_posts_select" ON forum_posts
  FOR SELECT USING (true);

CREATE POLICY "forum_posts_insert" ON forum_posts
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);
CREATE POLICY "forum_posts_update" ON forum_posts
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);
CREATE POLICY "forum_posts_delete" ON forum_posts
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON forum_posts(created_at DESC);

GRANT SELECT ON forum_posts TO anon;
GRANT SELECT, INSERT, UPDATE ON forum_posts TO authenticated;
GRANT USAGE ON SEQUENCE forum_posts_id_seq TO authenticated;

-- 4. forum_replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "forum_replies_select" ON forum_replies;
DROP POLICY IF EXISTS "forum_replies_insert" ON forum_replies;

CREATE POLICY "forum_replies_select" ON forum_replies
  FOR SELECT USING (true);

CREATE POLICY "forum_replies_insert" ON forum_replies
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);
CREATE POLICY "forum_replies_update" ON forum_replies
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);
CREATE POLICY "forum_replies_delete" ON forum_replies
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON forum_replies(post_id);

GRANT SELECT ON forum_replies TO anon;
GRANT SELECT, INSERT, UPDATE ON forum_replies TO authenticated;
GRANT USAGE ON SEQUENCE forum_replies_id_seq TO authenticated;
