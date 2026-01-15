import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scroll, Sparkles, Save, X, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import type { HabitCategory, HabitDifficulty, FrequencyType, StatType } from '@/types';

// カテゴリー設定
const CATEGORIES: Array<{ value: HabitCategory; label: string; icon: string; statType: StatType }> = [
  { value: 'exercise', label: 'うんどう', icon: '🏃', statType: 'VIT' },
  { value: 'workout', label: 'きたえ', icon: '💪', statType: 'STR' },
  { value: 'study', label: 'べんきょう', icon: '📖', statType: 'INT' },
  { value: 'reading', label: 'どくしょ', icon: '📚', statType: 'INT' },
  { value: 'meditation', label: 'めいそう', icon: '🧘', statType: 'MND' },
  { value: 'health', label: 'けんこう', icon: '❤️', statType: 'VIT' },
  { value: 'sleep', label: 'すいみん', icon: '😴', statType: 'VIT' },
  { value: 'social', label: 'こうりゅう', icon: '👥', statType: 'CHA' },
  { value: 'hobby', label: 'しゅみ', icon: '🎨', statType: 'DEX' },
  { value: 'other', label: 'そのた', icon: '📝', statType: 'DEX' },
];

// アイコン選択
const ICONS = ['📝', '💪', '📚', '❤️', '⚡', '👥', '🌙', '🎨', '🎯', '🏆', '🔥', '⭐'];

// 色選択
const COLORS = [
  { name: 'purple', class: 'bg-purple-500', hex: '#8b5cf6' },
  { name: 'blue', class: 'bg-blue-500', hex: '#3b82f6' },
  { name: 'green', class: 'bg-green-500', hex: '#22c55e' },
  { name: 'red', class: 'bg-red-500', hex: '#ef4444' },
  { name: 'yellow', class: 'bg-yellow-500', hex: '#eab308' },
  { name: 'pink', class: 'bg-pink-500', hex: '#ec4899' },
];

// 難易度
const DIFFICULTIES: Array<{ value: HabitDifficulty; label: string; exp: string; color: string }> = [
  { value: 'easy', label: 'かんたん', exp: '+5', color: 'text-green-400' },
  { value: 'normal', label: 'ふつう', exp: '+10', color: 'text-blue-400' },
  { value: 'hard', label: 'むずかしい', exp: '+15', color: 'text-orange-400' },
  { value: 'very_hard', label: 'とてもむずかしい', exp: '+20', color: 'text-red-400' },
];

export function CreateHabit() {
  const navigate = useNavigate();
  const { createHabit, refreshHabits } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'exercise' as HabitCategory,
    difficulty: 'normal' as HabitDifficulty,
    frequencyType: 'daily' as FrequencyType,
    reminderEnabled: false,
    reminderTime: '09:00',
    icon: '📝',
    color: '#8b5cf6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('クエスト名を入力してください');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // カテゴリーから対応するステータスタイプを取得
      const categoryConfig = CATEGORIES.find(c => c.value === formData.category);
      const statType = categoryConfig?.statType ?? 'DEX';

      const habit = await createHabit({
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        statType,
        difficulty: formData.difficulty,
        frequencyType: formData.frequencyType,
        reminderEnabled: formData.reminderEnabled,
        reminderTime: formData.reminderEnabled ? formData.reminderTime : undefined,
        icon: formData.icon,
        color: formData.color,
      });

      if (habit) {
        await refreshHabits();
        navigate('/');
      } else {
        alert('クエストの作成に失敗しました');
      }
    } catch (error) {
      console.error('Failed to create habit:', error);
      alert('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 mb-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <Scroll className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-amber-300">あたらしいクエストをつくる</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-slate-900/40 border border-amber-800/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              きほんじょうほう
            </h2>
            
            <div className="space-y-4">
              {/* Habit Name */}
              <div>
                <label className="block text-sm font-bold text-amber-200 mb-2">
                  クエストのなまえ *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/60 border border-amber-900/30 rounded px-4 py-2 text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600"
                  placeholder="クエストのなまえをにゅうりょく..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-amber-200 mb-2">
                  せつめい
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900/60 border border-amber-900/30 rounded px-4 py-2 text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600 resize-none"
                  rows={3}
                  placeholder="クエストのせつめい..."
                />
              </div>

              {/* Icon & Color Picker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Icon Picker */}
                <div>
                  <label className="block text-sm font-bold text-amber-200 mb-2">
                    アイコン
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                          formData.icon === icon
                            ? 'border-amber-500 bg-amber-950/50'
                            : 'border-amber-900/30 bg-slate-900/40 hover:border-amber-700'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-bold text-amber-200 mb-2">
                    いろ
                  </label>
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.hex })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${color.class} ${
                          formData.color === color.hex
                            ? 'border-amber-400 scale-110'
                            : 'border-slate-600 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Game Settings */}
          <div className="bg-slate-900/40 border border-amber-800/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-300 mb-4">ゲームせってい</h2>
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-amber-200 mb-2">
                  カテゴリー
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                        formData.category === cat.value
                          ? 'border-amber-500 bg-amber-950/50'
                          : 'border-amber-900/30 bg-slate-900/40 hover:border-amber-700'
                      }`}
                    >
                      <span className="mr-1">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-bold text-amber-200 mb-2">
                  なんいど
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: diff.value })}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.difficulty === diff.value
                          ? 'border-amber-500 bg-amber-950/50'
                          : 'border-amber-900/30 bg-slate-900/40 hover:border-amber-700'
                      }`}
                    >
                      <div className="text-sm font-bold text-amber-100">{diff.label}</div>
                      <div className={`text-xs ${diff.color}`}>{diff.exp}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-amber-400/70 mt-2">
                  ※ なんいどがたかいほど、もらえるけいけんちがふえる
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Schedule */}
          <div className="bg-slate-900/40 border border-amber-800/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-300 mb-4">スケジュール</h2>
            
            <div className="space-y-4">
              {/* Frequency Type */}
              <div>
                <label className="block text-sm font-bold text-amber-200 mb-2">
                  ひんど
                </label>
                <div className="flex gap-4">
                  {(['daily', 'weekly', 'specific_days'] as FrequencyType[]).map((freq) => {
                    const freqLabels: Record<string, string> = {
                      daily: 'まいにち',
                      weekly: 'まいしゅう',
                      specific_days: 'ようびしてい',
                    };
                    return (
                      <label key={freq} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="frequency"
                          value={freq}
                          checked={formData.frequencyType === freq}
                          onChange={(e) => setFormData({ ...formData, frequencyType: e.target.value as FrequencyType })}
                          className="w-4 h-4 accent-amber-600"
                        />
                        <span className="text-sm text-amber-200">
                          {freqLabels[freq]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Reminder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-amber-200">
                    リマインダー
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, reminderEnabled: !formData.reminderEnabled })}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      formData.reminderEnabled ? 'bg-amber-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData.reminderEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {formData.reminderEnabled && (
                  <input
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                    className="w-full bg-slate-900/60 border border-amber-900/30 rounded px-4 py-2 text-amber-100 focus:outline-none focus:border-amber-600"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-900/50"
            >
                          {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  さくせいちゅう...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  クエストをつくる
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-slate-800/60 hover:bg-slate-700/60 text-amber-200 font-bold py-3 px-6 rounded-lg border-2 border-amber-900/30 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              やめる
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
