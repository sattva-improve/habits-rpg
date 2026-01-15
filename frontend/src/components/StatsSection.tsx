import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { LEVEL_THRESHOLDS, EXP_CONFIG } from '@/constants/game';

// レベルに必要な経験値を計算
function getExpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level > LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[level - 1];
}

export function StatsSection() {
  const { userData, isLoading } = useUser();

  // レベルと経験値
  const level = userData?.level ?? 1;
  const totalExp = userData?.totalExp ?? 0;
  const currentLevelExp = getExpForLevel(level);
  const nextLevelExp = getExpForLevel(level + 1);
  const expProgress = nextLevelExp > currentLevelExp 
    ? Math.min(((totalExp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100, 100)
    : 100;

  // ステータスデータを構築（ドラクエ風日本語名）
  const rawStats = [
    { stat: 'たいりょく', key: 'vitality', value: userData?.vitality ?? 1 },
    { stat: 'かしこさ', key: 'intelligence', value: userData?.intelligence ?? 1 },
    { stat: 'せいしん', key: 'mental', value: userData?.mental ?? 1 },
    { stat: 'きようさ', key: 'dexterity', value: userData?.dexterity ?? 1 },
    { stat: 'みりょく', key: 'charisma', value: userData?.charisma ?? 1 },
    { stat: 'ちから', key: 'strength', value: userData?.strength ?? 1 },
  ];
  
  // 最大値を動的に計算（最大ステータスが10以上なら10刻みで拡張）
  const maxStatValue = Math.max(...rawStats.map(s => s.value));
  const chartMax = maxStatValue <= 10 ? 10 : Math.ceil(maxStatValue / 10) * 10;
  
  const stats = rawStats.map(s => ({ ...s, fullMark: chartMax }));

  // ストリーク情報
  const currentStreak = userData?.currentStreak ?? 0;
  const maxStreak = userData?.maxStreak ?? 0;

  if (isLoading) {
    return (
      <section className="mb-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      {/* Experience Progress Bar */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 mb-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-amber-300">けいけんち</span>
          <span className="text-sm font-bold text-amber-400">
            {totalExp - currentLevelExp} / {nextLevelExp - currentLevelExp}
          </span>
        </div>
        <div className="w-full bg-slate-900/60 border border-amber-900/30 rounded-full h-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-full transition-all duration-500 relative"
            style={{ width: `${expProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
        
        {/* Streak Info */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-amber-300">🔥 れんぞく:</span>
            <span className="font-bold text-amber-400">{currentStreak}にち</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-300">⭐ さいこうきろく:</span>
            <span className="font-bold text-amber-400">{maxStreak}にち</span>
          </div>
        </div>
      </div>

      {/* Radar Chart for Stats */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-amber-300 mb-4 text-center">ステータス</h2>
        <div className="w-full" style={{ height: '400px', minHeight: '400px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={400}>
            <RadarChart data={stats}>
              <PolarGrid stroke="#78716c" strokeOpacity={0.3} />
              <PolarAngleAxis 
                dataKey="stat" 
                tick={{ fill: '#fbbf24', fontSize: 14, fontWeight: 'bold' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, chartMax]} 
                tick={{ fill: '#d97706', fontSize: 12 }}
              />
              <Radar 
                name="Stats" 
                dataKey="value" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.6}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '2px solid #d97706',
                  borderRadius: '8px',
                  color: '#fbbf24'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {stats.map((stat, index) => {
            // 各ステータスの経験値情報を取得
            const expKey = `${stat.key}Exp` as keyof typeof userData;
            const currentStatExp = userData?.[expKey] ?? 0;
            
            return (
              <div key={index} className="bg-slate-900/40 border border-amber-800/30 rounded px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-amber-200">{stat.stat}</span>
                  <span className="text-sm font-bold text-amber-400">{stat.value}</span>
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((Number(currentStatExp) / 100) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
