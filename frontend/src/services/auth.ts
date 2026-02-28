/**
 * Auth Service - Supabase Auth版
 */

import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

import { getSupabaseClient } from '../lib/supabase'

export const authService = {
  /**
   * サインアップ
   */
  async signUp(email: string, password: string, displayName: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) {
      console.error('Sign up error:', error)
      return { user: null, error }
    }

    return { user: data.user, error: null }
  },

  /**
   * サインイン
   */
  async signIn(email: string, password: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Sign in error:', error)
      return { user: null, error }
    }

    return { user: data.user, error: null }
  },

  /**
   * サインアウト
   */
  async signOut() {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out error:', error)
      return false
    }

    return true
  },

  /**
   * パスワードリセット
   */
  async resetPassword(email: string) {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      return false
    }

    return true
  },

  /**
   * 現在のセッションを取得
   */
  async getSession() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Get session error:', error)
      return null
    }

    return data.session
  },

  /**
   * 認証状態の変更を監視
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const supabase = getSupabaseClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        callback(event, session)
      }
    )

    return subscription
  },
}

export default authService
