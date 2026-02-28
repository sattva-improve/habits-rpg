import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

type UsersRow = {
  id: string
  auth_user_id: string
  email: string
  display_name: string
  timezone: string
  gender: string
  vitality: number
  intelligence: number
  mental: number
  dexterity: number
  charisma: number
  strength: number
  level: number
  total_exp: number
  current_job_id: string
  max_streak: number
  current_streak: number
  created_at: string
  updated_at: string
}

type UsersInsert = Omit<UsersRow, 'id' | 'created_at' | 'updated_at'>
type UsersUpdate = Partial<UsersInsert>

type HabitsRow = {
  id: string
  user_id: string
  name: string
  description: string | null
  icon: string
  color: string
  category: string
  group_category: string
  stat_type: string
  frequency_type: string
  difficulty: string
  reminder_enabled: boolean
  reminder_time: string | null
  current_streak: number
  best_streak: number
  total_completions: number
  is_active: boolean
  is_archived: boolean
  last_completed_at: string | null
  created_at: string
  updated_at: string
}

type HabitsInsert = Omit<HabitsRow, 'id' | 'created_at' | 'updated_at'>
type HabitsUpdate = Partial<HabitsInsert>

type HabitRecordsRow = {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  completed: boolean
  note: string | null
  exp_earned: number
  streak_at_completion: number
  created_at: string
}

type HabitRecordsInsert = Omit<HabitRecordsRow, 'id' | 'created_at'>
type HabitRecordsUpdate = Partial<HabitRecordsInsert>

type AchievementsRow = {
  id: string
  name: string
  description: string
  icon: string
  type: string
  rarity: string
  exp_reward: number
  is_hidden: boolean
  target_value: number
  target_stat_type: string | null
  created_at: string
}

type JobsRow = {
  id: string
  name: string
  description: string
  icon: string
  tier: string
  requirements: unknown
  stat_bonuses: unknown
  exp_bonus: number
  created_at: string
}

type UserProgressRow = {
  id: string
  user_id: string
  type: 'achievement' | 'job'
  reference_id: string
  is_unlocked: boolean
  unlocked_at: string | null
  current_value: number
  is_equipped: boolean
  created_at: string
}

type UserProgressInsert = Omit<UserProgressRow, 'id' | 'created_at'>
type UserProgressUpdate = Partial<UserProgressInsert>

export type Database = {
  public: {
    Tables: {
      users: { Row: UsersRow; Insert: UsersInsert; Update: UsersUpdate }
      habits: { Row: HabitsRow; Insert: HabitsInsert; Update: HabitsUpdate }
      habit_records: { Row: HabitRecordsRow; Insert: HabitRecordsInsert; Update: HabitRecordsUpdate }
      achievements: { Row: AchievementsRow }
      jobs: { Row: JobsRow }
      user_progress: { Row: UserProgressRow; Insert: UserProgressInsert; Update: UserProgressUpdate }
    }
  }
}

let supabaseClient: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)')
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}
