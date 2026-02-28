-- ============================================================================
-- Supabase Seed Data for Habits RPG
-- ============================================================================
-- This file contains master data for:
-- 1. Achievements (achievements table)
-- 2. Jobs (jobs table)
--
-- Run after migrations:
--   supabase db reset
-- Or manually:
--   psql -h localhost -p 54322 -d postgres -U postgres -f supabase/seed.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- ACHIEVEMENTS MASTER DATA
-- ============================================================================

-- First Achievements
INSERT INTO achievements (id, name, description, icon, type, rarity, exp_reward, target_value, is_hidden) VALUES
('first_habit', 'さいしょのしゅうかん', 'さいしょのしゅうかんをつくる', '🎉', 'first', 'common', 20, 1, false),
('first_completion', 'だいいっぽ', 'さいしょのしゅうかんをたっせいする', '👣', 'first', 'common', 30, 1, false);

-- Streak Achievements
INSERT INTO achievements (id, name, description, icon, type, rarity, exp_reward, target_value, is_hidden) VALUES
('streak_3', 'みっかぼうずをこえて', '3にちれんぞくでたっせいする', '🔥', 'streak', 'common', 50, 3, false),
('streak_7', 'いっしゅうかんのしゅうかん', '7にちれんぞくでたっせいする', '🔥', 'streak', 'uncommon', 100, 7, false),
('streak_14', 'にしゅうかんマスター', '14にちれんぞくでたっせいする', '🔥', 'streak', 'uncommon', 200, 14, false),
('streak_30', 'げっかんマスター', '30にちれんぞくでたっせいする', '🔥', 'streak', 'rare', 500, 30, false),
('streak_60', 'しゅうかんのたつじん', '60にちれんぞくでたっせいする', '🏆', 'streak', 'epic', 1000, 60, false),
('streak_100', 'でんせつのしゅうかんか', '100にちれんぞくでたっせいする', '👑', 'streak', 'legendary', 2000, 100, false);

-- Total Completion Achievements
INSERT INTO achievements (id, name, description, icon, type, rarity, exp_reward, target_value, is_hidden) VALUES
('total_10', '10かいたっせい', 'しゅうかんをごうけい10かいたっせいする', '⭐', 'total', 'common', 50, 10, false),
('total_50', '50かいたっせい', 'しゅうかんをごうけい50かいたっせいする', '⭐', 'total', 'uncommon', 150, 50, false),
('total_100', '100かいたっせい', 'しゅうかんをごうけい100かいたっせいする', '🌟', 'total', 'rare', 300, 100, false),
('total_500', '500かいたっせい', 'しゅうかんをごうけい500かいたっせいする', '💎', 'total', 'epic', 1000, 500, false),
('total_1000', '1000かいたっせい', 'しゅうかんをごうけい1000かいたっせいする', '👑', 'total', 'legendary', 2000, 1000, false);

-- Level Achievements
INSERT INTO achievements (id, name, description, icon, type, rarity, exp_reward, target_value, is_hidden) VALUES
('level_10', 'レベル10たっせい', 'レベル10にとうたつする', '🌟', 'level', 'common', 100, 10, false),
('level_25', 'レベル25たっせい', 'レベル25にとうたつする', '💫', 'level', 'uncommon', 300, 25, false),
('level_50', 'レベル50たっせい', 'レベル50にとうたつする', '✨', 'level', 'rare', 800, 50, false),
('level_75', 'レベル75たっせい', 'レベル75にとうたつする', '🔆', 'level', 'epic', 1500, 75, false),
('level_99', 'カンスト', 'さいだいレベル99にとうたつする', '👑', 'level', 'legendary', 5000, 99, false);

-- Stat Achievements (Example: STR, INT, MND, DEX, CHA, VIT)
INSERT INTO achievements (id, name, description, icon, type, rarity, exp_reward, target_value, is_hidden) VALUES
('stat_str_10', 'ちからじまん', 'STRを10にする', '💪', 'stat_str', 'common', 100, 10, false),
('stat_int_10', 'ちしきじまん', 'INTを10にする', '📚', 'stat_int', 'common', 100, 10, false),
('stat_mnd_10', 'せいしんりょく', 'MNDを10にする', '🧘', 'stat_mnd', 'common', 100, 10, false),
('stat_dex_10', 'きようさ', 'DEXを10にする', '🎯', 'stat_dex', 'common', 100, 10, false),
('stat_cha_10', 'みりょくてき', 'CHAを10にする', '✨', 'stat_cha', 'common', 100, 10, false),
('stat_vit_10', 'けんこうたい', 'VITを10にする', '❤️', 'stat_vit', 'common', 100, 10, false);

-- Category Achievements (Exercise, Sleep, Health, etc.)
INSERT INTO achievements (id, name, description, icon, type, rarity, exp_reward, target_value, is_hidden) VALUES
('category_exercise_10', 'うんどうずき', 'うんどうしゅうかんを10かいたっせい', '🏃', 'category_exercise', 'common', 80, 10, false),
('category_sleep_10', 'すいみんマスター', 'すいみんしゅうかんを10かいたっせい', '😴', 'category_sleep', 'common', 80, 10, false),
('category_health_10', 'けんこういちばん', 'けんこうしゅうかんを10かいたっせい', '🍎', 'category_health', 'common', 80, 10, false),
('category_reading_10', 'どくしょか', 'どくしょしゅうかんを10かいたっせい', '📖', 'category_reading', 'common', 80, 10, false),
('category_study_10', 'べんきょうか', 'がくしゅうしゅうかんを10かいたっせい', '✏️', 'category_study', 'common', 80, 10, false),
('category_meditation_10', 'めいそうか', 'めいそうしゅうかんを10かいたっせい', '🧘', 'category_meditation', 'common', 80, 10, false),
('category_mindfulness_10', 'マインドフルネス', 'マインドフルネスしゅうかんを10かいたっせい', '☮️', 'category_mindfulness', 'common', 80, 10, false);

-- ============================================================================
-- JOBS MASTER DATA
-- ============================================================================

-- ===== Novice (初期) =====
INSERT INTO jobs (id, name, description, icon, tier, required_level, stat_bonuses, exp_bonus) VALUES
('beginner', 'ビギナー', 'すべての冒険者の始まり', '🌱', 'novice', NULL, '{}', 1.0);

-- ===== Apprentice (見習い) =====
INSERT INTO jobs (id, name, description, icon, tier, required_level, required_stats, required_jobs, stat_bonuses, exp_bonus) VALUES
('warrior_apprentice', '見習い戦士', '筋力を鍛える者', '⚔️', 'apprentice', NULL, '{"STR": 2}', NULL, '{"STR": 1}', 1.05),
('scholar_apprentice', '見習い学者', '知識を追い求める者', '📖', 'apprentice', NULL, '{"INT": 2}', NULL, '{"INT": 1}', 1.05),
('monk_apprentice', '見習い僧侶', '精神を磨く者', '🙏', 'apprentice', NULL, '{"MND": 2}', NULL, '{"MND": 1}', 1.05),
('artisan_apprentice', '見習い職人', '技術を追求する者', '🔧', 'apprentice', NULL, '{"DEX": 2}', NULL, '{"DEX": 1}', 1.05),
('performer_apprentice', '見習い芸人', '人を魅了する者', '🎭', 'apprentice', NULL, '{"CHA": 2}', NULL, '{"CHA": 1}', 1.05),
('athlete_apprentice', '見習いアスリート', '体を鍛える者', '🏃', 'apprentice', NULL, '{"VIT": 2}', NULL, '{"VIT": 1}', 1.05);

-- ===== Journeyman (職人) =====
INSERT INTO jobs (id, name, description, icon, tier, required_level, required_stats, required_jobs, stat_bonuses, exp_bonus) VALUES
('warrior', '戦士', '強靭な肉体を持つ者', '🗡️', 'journeyman', 10, '{"STR": 5}', '["warrior_apprentice"]', '{"STR": 2, "VIT": 1}', 1.1),
('scholar', '学者', '深い知識を持つ者', '📚', 'journeyman', 10, '{"INT": 5}', '["scholar_apprentice"]', '{"INT": 2, "MND": 1}', 1.1),
('monk', '僧侶', '心身を修練した者', '🧘', 'journeyman', 10, '{"MND": 5}', '["monk_apprentice"]', '{"MND": 2, "VIT": 1}', 1.1),
('artisan', '職人', '卓越した技術を持つ者', '⚒️', 'journeyman', 10, '{"DEX": 5}', '["artisan_apprentice"]', '{"DEX": 2, "INT": 1}', 1.1),
('bard', '吟遊詩人', '人々を魅了する者', '🎵', 'journeyman', 10, '{"CHA": 5}', '["performer_apprentice"]', '{"CHA": 2, "DEX": 1}', 1.1),
('athlete', 'アスリート', '健康な身体を持つ者', '🏅', 'journeyman', 10, '{"VIT": 5}', '["athlete_apprentice"]', '{"VIT": 2, "STR": 1}', 1.1);

-- ===== Journeyman (複合ステータス系) =====
INSERT INTO jobs (id, name, description, icon, tier, required_level, required_stats, required_jobs, stat_bonuses, exp_bonus) VALUES
('ranger', 'レンジャー', '弓と自然を操る狩人', '🏹', 'journeyman', 10, '{"DEX": 4, "STR": 3}', '["warrior_apprentice", "artisan_apprentice"]', '{"DEX": 2, "STR": 1}', 1.1),
('paladin', 'パラディン', '聖なる力を宿す騎士', '✝️', 'journeyman', 10, '{"STR": 4, "MND": 3}', '["warrior_apprentice", "monk_apprentice"]', '{"STR": 2, "MND": 1}', 1.1),
('ninja', '忍者', '影に潜み、俊敏に動く者', '🥷', 'journeyman', 10, '{"DEX": 4, "INT": 3}', '["artisan_apprentice", "scholar_apprentice"]', '{"DEX": 2, "INT": 1}', 1.1),
('spellblade', '魔法剣士', '剣と魔法を融合させた戦士', '⚔️✨', 'journeyman', 10, '{"STR": 4, "INT": 3}', '["warrior_apprentice", "scholar_apprentice"]', '{"STR": 1, "INT": 1, "DEX": 1}', 1.1),
('dancer', '踊り子', '優雅な舞で仲間を鼓舞する者', '💃', 'journeyman', 10, '{"CHA": 4, "VIT": 3}', '["performer_apprentice", "athlete_apprentice"]', '{"CHA": 1, "VIT": 1, "DEX": 1}', 1.1),
('alchemist', '錬金術師', '物質を変容させる秘術の使い手', '⚗️', 'journeyman', 10, '{"INT": 4, "DEX": 3}', '["scholar_apprentice", "artisan_apprentice"]', '{"INT": 1, "DEX": 1, "MND": 1}', 1.1);

-- ===== Expert (熟練者) =====
INSERT INTO jobs (id, name, description, icon, tier, required_level, required_stats, required_jobs, stat_bonuses, exp_bonus) VALUES
('knight', '騎士', '武芸に優れた勇者', '🛡️', 'expert', 20, '{"STR": 10, "VIT": 5}', '["warrior"]', '{"STR": 3, "VIT": 2, "CHA": 1}', 1.15),
('sage', '賢者', '深い知恵を持つ者', '🔮', 'expert', 20, '{"INT": 10, "MND": 5}', '["scholar"]', '{"INT": 3, "MND": 2, "DEX": 1}', 1.15),
('high_priest', '大僧正', '神聖な力を極めた者', '☸️', 'expert', 20, '{"MND": 10, "VIT": 5}', '["monk"]', '{"MND": 3, "VIT": 2, "INT": 1}', 1.15),
('master_artisan', '匠', '技術の頂点に立つ者', '🔨', 'expert', 20, '{"DEX": 10, "INT": 5}', '["artisan"]', '{"DEX": 3, "INT": 2, "STR": 1}', 1.15),
('maestro', '楽聖', '音楽の極致を知る者', '🎼', 'expert', 20, '{"CHA": 10, "MND": 5}', '["bard"]', '{"CHA": 3, "MND": 2, "DEX": 1}', 1.15),
('champion', 'チャンピオン', '頂点に立つアスリート', '🏆', 'expert', 20, '{"VIT": 10, "STR": 5}', '["athlete"]', '{"VIT": 3, "STR": 2, "DEX": 1}', 1.15);

-- ===== Master (達人) =====
INSERT INTO jobs (id, name, description, icon, tier, required_level, required_stats, required_jobs, stat_bonuses, exp_bonus) VALUES
('warlord', '覇王', '戦いを極めし者', '👑', 'master', 30, '{"STR": 15, "VIT": 10, "DEX": 5}', '["knight"]', '{"STR": 4, "VIT": 2, "DEX": 2}', 1.2),
('archmage', '大魔導師', '魔法の頂点に立つ者', '🧙', 'master', 30, '{"INT": 15, "MND": 10, "CHA": 5}', '["sage"]', '{"INT": 4, "MND": 2, "CHA": 2}', 1.2),
('oracle', '神託者', '神の声を聞く者', '🕊️', 'master', 30, '{"MND": 15, "INT": 10, "VIT": 5}', '["high_priest"]', '{"MND": 4, "INT": 2, "VIT": 2}', 1.2),
('grand_artisan', '大匠', '全ての技術を極めた者', '⚙️', 'master', 30, '{"DEX": 15, "INT": 10, "STR": 5}', '["master_artisan"]', '{"DEX": 4, "INT": 2, "STR": 2}', 1.2),
('virtuoso', '芸術の極致', '究極の表現者', '🎨', 'master', 30, '{"CHA": 15, "DEX": 10, "MND": 5}', '["maestro"]', '{"CHA": 4, "DEX": 2, "MND": 2}', 1.2),
('legend', '生ける伝説', '肉体を極限まで鍛えた者', '⚡', 'master', 30, '{"VIT": 15, "STR": 10, "DEX": 5}', '["champion"]', '{"VIT": 4, "STR": 2, "DEX": 2}', 1.2);

-- ===== Grandmaster (極致) =====
INSERT INTO jobs (id, name, description, icon, tier, required_level, required_stats, required_jobs, required_achievements, stat_bonuses, exp_bonus) VALUES
('hero', '英雄', '全てを極めし者', '🦸', 'grandmaster', 50, '{"STR": 20, "INT": 15, "MND": 15, "DEX": 15, "CHA": 15, "VIT": 20}', '["warlord", "archmage", "oracle", "grand_artisan", "virtuoso", "legend"]', '["level_50", "total_500"]', '{"STR": 5, "INT": 3, "MND": 3, "DEX": 3, "CHA": 3, "VIT": 5}', 1.3),
('habit_master', '習慣の極致', '習慣を完全に制御した者', '✨', 'grandmaster', 99, '{"STR": 30, "INT": 30, "MND": 30, "DEX": 30, "CHA": 30, "VIT": 30}', '["hero"]', '["level_99", "total_1000", "streak_100"]', '{"STR": 10, "INT": 10, "MND": 10, "DEX": 10, "CHA": 10, "VIT": 10}', 2.0);

COMMIT;

-- ============================================================================
-- Seed Data Summary
-- ============================================================================
-- Achievements: 33 entries
--   - First: 2
--   - Streak: 6
--   - Total: 5
--   - Level: 5
--   - Stat: 6
--   - Category: 7
--
-- Jobs: 34 entries
--   - Novice: 1
--   - Apprentice: 6
--   - Journeyman: 12
--   - Expert: 6
--   - Master: 6
--   - Grandmaster: 2
-- ============================================================================
