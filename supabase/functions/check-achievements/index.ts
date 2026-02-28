// Supabase Edge Function: Check Achievements & Jobs
// アチーブメント＆ジョブ解放判定（習慣完了時に非同期で実行）

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Service role for batch updates
    )

    const { userId, newLevel, newStreak, totalCompletions } = await req.json()

    // 1. ユーザー情報取得
    const { data: user } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    // 2. 全アチーブメント取得
    const { data: achievements } = await supabaseClient
      .from('achievements')
      .select('*')

    // 3. ユーザーの進捗取得
    const { data: userProgress } = await supabaseClient
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)

    const unlockedAchievements = new Set(
      userProgress?.filter(p => p.type === 'achievement' && p.is_unlocked)
        .map(p => p.reference_id) || []
    )

    const newlyUnlocked: any[] = []
    let totalExpBonus = 0

    // 4. アチーブメントチェック
    for (const achievement of achievements || []) {
      if (unlockedAchievements.has(achievement.id)) continue

      let isAchieved = false

      switch (achievement.type) {
        case 'first':
          if (achievement.id === 'first_completion') {
            isAchieved = totalCompletions >= 1
          }
          break
        case 'streak':
          isAchieved = (user.max_streak || 0) >= achievement.target_value
          break
        case 'total':
          isAchieved = totalCompletions >= achievement.target_value
          break
        case 'level':
          isAchieved = (user.level || 1) >= achievement.target_value
          break
        case 'stat':
          if (achievement.target_stat_type) {
            const statField = {
              VIT: 'vitality', INT: 'intelligence', MND: 'mental',
              DEX: 'dexterity', CHA: 'charisma', STR: 'strength',
            }[achievement.target_stat_type]
            isAchieved = (user[statField] || 1) >= achievement.target_value
          }
          break
      }

      if (isAchieved) {
        // Upsert user_progress
        await supabaseClient
          .from('user_progress')
          .upsert({
            user_id: userId,
            type: 'achievement',
            reference_id: achievement.id,
            is_unlocked: true,
            unlocked_at: new Date().toISOString(),
            current_value: achievement.target_value,
          }, { onConflict: 'user_id,type,reference_id' })

        newlyUnlocked.push(achievement)
        totalExpBonus += achievement.exp_reward || 0
      }
    }

    // 5. 経験値ボーナス付与
    if (totalExpBonus > 0) {
      const newTotalExp = user.total_exp + totalExpBonus
      await supabaseClient
        .from('users')
        .update({ total_exp: newTotalExp })
        .eq('id', userId)
    }

    // 6. ジョブチェック
    const { data: jobs } = await supabaseClient
      .from('jobs')
      .select('*')

    const unlockedJobs = new Set(
      userProgress?.filter(p => p.type === 'job' && p.is_unlocked)
        .map(p => p.reference_id) || []
    )
    unlockedJobs.add('beginner') // Always unlocked

    const unlockedAchievementIds = new Set(
      userProgress?.filter(p => p.type === 'achievement' && p.is_unlocked)
        .map(p => p.reference_id) || []
    )

    const newlyUnlockedJobs: any[] = []

    for (const job of jobs || []) {
      if (unlockedJobs.has(job.id)) continue

      const requirements = job.requirements || {}
      let allMet = true

      // Level check
      if (requirements.level && user.level < requirements.level) {
        allMet = false
      }

      // Stats check
      if (requirements.stats && allMet) {
        const userStats = {
          VIT: user.vitality, INT: user.intelligence, MND: user.mental,
          DEX: user.dexterity, CHA: user.charisma, STR: user.strength,
        }
        for (const [stat, required] of Object.entries(requirements.stats)) {
          if ((userStats[stat] || 0) < required) {
            allMet = false
            break
          }
        }
      }

      // Jobs check
      if (requirements.jobs && allMet) {
        for (const reqJob of requirements.jobs) {
          if (!unlockedJobs.has(reqJob)) {
            allMet = false
            break
          }
        }
      }

      // Achievements check
      if (requirements.achievements && allMet) {
        for (const reqAch of requirements.achievements) {
          if (!unlockedAchievementIds.has(reqAch)) {
            allMet = false
            break
          }
        }
      }

      if (allMet) {
        await supabaseClient
          .from('user_progress')
          .upsert({
            user_id: userId,
            type: 'job',
            reference_id: job.id,
            is_unlocked: true,
            unlocked_at: new Date().toISOString(),
            is_equipped: false,
          }, { onConflict: 'user_id,type,reference_id' })

        newlyUnlockedJobs.push(job)
        unlockedJobs.add(job.id)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        newAchievements: newlyUnlocked,
        newJobs: newlyUnlockedJobs,
        expBonus: totalExpBonus,
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
