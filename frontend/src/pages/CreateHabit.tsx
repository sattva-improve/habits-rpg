import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scroll, Sparkles, Save, X, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import type { HabitCategory, HabitDifficulty, FrequencyType, StatType } from '@/types';

// カテゴリー設定
const CATEGORIES: Array<{ value: HabitCategory; label: string; icon: string; defaultStatType: StatType }> = [
  { value: 'exercise', label: 'うんどう', icon: '🏃', defaultStatType: 'VIT' },
  { value: 'workout', label: '筋トレ', icon: '💪', defaultStatType: 'STR' },
  { value: 'study', label: 'べんきょう', icon: '📖', defaultStatType: 'INT' },
  { value: 'reading', label: 'どくしょ', icon: '📚', defaultStatType: 'INT' },
  { value: 'meditation', label: 'めいそう', icon: '🧘', defaultStatType: 'MND' },
  { value: 'health', label: 'けんこう', icon: '❤️', defaultStatType: 'VIT' },
  { value: 'sleep', label: 'きゅうそく', icon: '😴', defaultStatType: 'VIT' },
  { value: 'social', label: 'こうりゅう', icon: '👥', defaultStatType: 'CHA' },
  { value: 'hobby', label: 'しゅみ', icon: '🎨', defaultStatType: 'DEX' },
  { value: 'other', label: 'そのた', icon: '📝', defaultStatType: 'DEX' },
];

// ステータスタイプ設定
const STAT_TYPES: Array<{ value: StatType; label: string; icon: string; description: string; color: string }> = [
  { value: 'VIT', label: 'たいりょく', icon: '❤️', description: 'HP・スタミナ', color: 'text-red-400' },
  { value: 'STR', label: 'ちから', icon: '💪', description: 'こうげき力', color: 'text-orange-400' },
  { value: 'INT', label: 'かしこさ', icon: '📚', description: '魔法・知識', color: 'text-blue-400' },
  { value: 'MND', label: 'せいしん', icon: '🧘', description: '集中力・意志', color: 'text-purple-400' },
  { value: 'DEX', label: 'きようさ', icon: '🎯', description: 'スキル・技術', color: 'text-green-400' },
  { value: 'CHA', label: 'みりょく', icon: '✨', description: '魅力・コミュ力', color: 'text-pink-400' },
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
    statType: 'VIT' as StatType,
    difficulty: 'normal' as HabitDifficulty,
    frequencyType: 'daily' as FrequencyType,
    icon: '📝',
    color: '#8b5cf6',
  });

  // カテゴリー変更時にデフォルトのステータスタイプを設定
  const handleCategoryChange = (category: HabitCategory) => {
    const categoryConfig = CATEGORIES.find(c => c.value === category);
    setFormData({
      ...formData,
      category,
      statType: categoryConfig?.defaultStatType ?? 'DEX',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('習慣名を入力してください');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const habit = await createHabit({
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        statType: formData.statType,
        difficulty: formData.difficulty,
        frequencyType: formData.frequencyType,
        icon: formData.icon,
        color: formData.color,
      });

      if (habit) {
        await refreshHabits();
        navigate('/');
      } else {
        alert('習慣の作成に失敗しました');
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
          <h1 className="text-3xl font-bold text-amber-300">あたらしい習慣をつくる</h1>
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
                  習慣のなまえ *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/60 border border-amber-900/30 rounded px-4 py-2 text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600"
                  placeholder="習慣のなまえをにゅうりょく..."
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
                  placeholder="習慣のせつめい..."
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
            <h2 className="text-xl font-bold text-amber-300 mb-4">⚔️ ゲームせってい</h2>
            
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-base font-bold text-amber-200 mb-3">
                  📂 カテゴリー
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`flex flex-col items-center justify-center px-3 py-4 rounded-xl border-2 transition-all ${
                        formData.category === cat.value
                          ? 'border-amber-400 bg-amber-950/70 shadow-lg shadow-amber-500/20 scale-105'
                          : 'border-amber-900/40 bg-slate-900/60 hover:border-amber-600 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="text-2xl mb-1">{cat.icon}</span>
                      <span className={`text-sm font-bold ${formData.category === cat.value ? 'text-amber-200' : 'text-amber-300/80'}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stat Type */}
              <div>
                <label className="block text-base font-bold text-amber-200 mb-3">
                  📊 あがるパラメータ
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {STAT_TYPES.map((stat) => (
                    <button
                      key={stat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, statType: stat.value })}
                      className={`px-4 py-4 rounded-xl border-2 transition-all text-left ${
                        formData.statType === stat.value
                          ? 'border-amber-400 bg-amber-950/70 shadow-lg shadow-amber-500/20 scale-105'
                          : 'border-amber-900/40 bg-slate-900/60 hover:border-amber-600 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stat.icon}</span>
                        <div>
                          <div className={`text-base font-bold ${stat.color}`}>{stat.label}</div>
                          <div className="text-xs text-amber-400/70">{stat.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-amber-400/70 mt-3">
                  ※ この習慣を達成すると、選んだパラメータがあがります
                </p>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-base font-bold text-amber-200 mb-3">
                  ⭐ なんいど
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: diff.value })}
                      className={`px-4 py-4 rounded-xl border-2 transition-all ${
                        formData.difficulty === diff.value
                          ? 'border-amber-400 bg-amber-950/70 shadow-lg shadow-amber-500/20 scale-105'
                          : 'border-amber-900/40 bg-slate-900/60 hover:border-amber-600 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="text-base font-bold text-amber-100">{diff.label}</div>
                      <div className={`text-sm font-semibold ${diff.color}`}>{diff.exp}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-amber-400/70 mt-3">
                  ※ なんいどがたかいほど、もらえるけいけんちがふえる
                </p>
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
                  習慣をつくる
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
