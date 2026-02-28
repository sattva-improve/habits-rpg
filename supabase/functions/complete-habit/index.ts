// Supabase Edge Function: Complete Habit
// 習慣完了処理（経験値計算、ストリーク更新、ステータス更新）

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ステータスタイプマッピング
const CATEGORY_TO_STAT: Record<string, string> = {
  exercise: 'VIT', sleep: 'VIT', health: 'VIT',
  reading: 'INT', study: 'INT', learning: 'INT',
  meditation: 'MND', journaling: 'MND', gratitude: 'MND', mindfulness: 'MND',
  music: 'DEX', art: 'DEX', craft: 'DEX', hobby: 'DEX',
  communication: 'CHA', social: 'CHA', grooming: 'CHA',
  workout: 'STR', sports: 'STR', fitness: 'STR',
  other: 'VIT',
}

const STAT_TO_FIELD: Record<string, string> = {
  VIT: 'vitality', INT: 'intelligence', MND: 'mental',
  DEX: 'dexterity', CHA: 'charisma', STR: 'strength',
}

// ストリークボーナス計算
function getStreakMultiplier(streak: number): number {
  if (streak >= 60) return 2.5
  if (streak >= 30) return 2.0
  if (streak >= 14) return 1.5
  if (streak >= 7) return 1.25
  if (streak >= 3) return 1.1
  return 1.0
}

// 経験値計算
function calculateExp(streak: number): number {
  const baseExp = 15
  return Math.floor(baseExp * getStreakMultiplier(streak))
}

// レベル計算
function calculateLevelFromExp(totalExp: number): number {
  let level = 1
  while (level < 99) {
    const baseExp = 100
    const growth = 1.5
    let total = 0
    for (let i = 1; i < level + 1; i++) {
      total += Math.floor(baseExp * Math.pow(growth, i - 1))
    }
    if (totalExp < total) break
    level++
  }
  return level
}

// ステータスレベル計算
function calculateStatLevel(statExp: number): number {
  return Math.floor(statExp / 100) + 1
}

// 連続日チェック
function isConsecutiveDay(previousDate: string, currentDate: string): boolean {
  const prev = new Date(previousDate)
  const curr = new Date(currentDate)
  prev.setHours(0, 0, 0, 0)
  curr.setHours(0, 0, 0, 0)
  const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays === 1
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // ユーザー認証確認
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !authUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { habitId, date, note } = await req.json()

    // 1. 習慣情報取得
    const { data: habit, error: habitError } = await supabaseClient
      .from('habits')
      .select('*, users!inner(id, auth_user_id)')
      .eq('id', habitId)
      .single()

    if (habitError || !habit) {
      return new Response(JSON.stringify({ error: 'Habit not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 権限チェック
    if (habit.users.auth_user_id !== authUser.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const userId = habit.user_id

    // 2. ユーザー情報取得
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. 最終完了日取得
    const { data: lastRecord } = await supabaseClient
      .from('habit_records')
      .select('completed_date')
      .eq('habit_id', habitId)
      .eq('completed', true)
      .order('completed_date', { ascending: false })
      .limit(1)
      .single()

    // 4. ストリーク計算
    let newStreak: number
    if (!lastRecord) {
      newStreak = 1
    } else if (lastRecord.completed_date === date) {
      return new Response(JSON.stringify({ error: 'Already completed today' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else if (isConsecutiveDay(lastRecord.completed_date, date)) {
      newStreak = habit.current_streak + 1
    } else {
      newStreak = 1
    }

    const newBestStreak = Math.max(newStreak, habit.best_streak)

    // 5. 経験値計算
    const expGained = calculateExp(newStreak)

    // 6. 記録作成（トランザクション開始）
    const { data: record, error: recordError } = await supabaseClient
      .from('habit_records')
      .insert({
        habit_id: habitId,
        user_id: userId,
        completed_date: date,
        completed: true,
        note,
        exp_earned: expGained,
        streak_at_completion: newStreak,
      })
      .select()
      .single()

    if (recordError) {
      return new Response(JSON.stringify({ error: 'Failed to create record', details: recordError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 7. 習慣更新
    await supabaseClient
      .from('habits')
      .update({
        current_streak: newStreak,
        best_streak: newBestStreak,
        total_completions: habit.total_completions + 1,
        last_completed_at: new Date().toISOString(),
      })
      .eq('id', habitId)

    // 8. ユーザー更新（経験値、レベル、ステータス）
    const newTotalExp = user.total_exp + expGained
    const newLevel = calculateLevelFromExp(newTotalExp)
    const levelUp = newLevel > user.level

    // ステータス更新
    const statType = habit.stat_type || CATEGORY_TO_STAT[habit.category] || 'VIT'
    const statField = STAT_TO_FIELD[statType] || 'vitality'
    
    // 現在のステータスEXPを計算（レベル → EXP逆算）
    const currentStatLevel = user[statField] || 1
    const currentStatExp = (currentStatLevel - 1) * 100
    const newStatExp = currentStatExp + expGained
    const newStatLevel = calculateStatLevel(newStatExp)

    // ユーザーストリーク更新
    const { data: allHabits } = await supabaseClient
      .from('habits')
      .select('current_streak')
      .eq('user_id', userId)
      .eq('is_archived', false)

    const maxCurrentStreak = Math.max(newStreak, ...(allHabits?.map(h => h.current_streak) || []))
    const maxBestStreak = Math.max(user.max_streak, maxCurrentStreak)

    const userUpdate: any = {
      total_exp: newTotalExp,
      level: newLevel,
      current_streak: maxCurrentStreak,
      max_streak: maxBestStreak,
    }
    userUpdate[statField] = Math.min(newStatLevel, 99)

    await supabaseClient
      .from('users')
      .update(userUpdate)
      .eq('id', userId)

    // 9. アチーブメント・ジョブチェック（非同期呼び出し）
    // Note: 別のEdge Functionで処理するため、ここではトリガーのみ
    supabaseClient.functions.invoke('check-achievements', {
      body: { userId, newLevel, newStreak, totalCompletions: habit.total_completions + 1 }
    }).catch(e => console.error('Achievement check failed:', e))

    return new Response(
      JSON.stringify({
        success: true,
        record,
        expGained,
        levelUp,
        newLevel,
        newStreak,
        statType,
        newStatLevel,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
