import { Trophy, Crown, Lock, Check, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export function Achievements() {
  const { 
    achievements, 
    userAchievements, 
    jobs, 
    userJobs, 
    isLoading 
  } = useUser();

  // ユーザーのアチーブメント状態をマージ
  const mergedAchievements = achievements.map(ach => {
    const userAch = userAchievements.find(ua => ua.achievementId === ach.achievementId);
    
    // 解除条件の日本語表示
    let unlockCondition = '';
    const typeLabel = {
      first: 'はじめて',
      streak: 'れんぞく',
      total: 'ごうけい',
      level: 'Lv.',
      stat: ach.targetStatType ?? '',
      special: '',
    }[ach.type] || '';
    
    if (ach.type === 'level') {
      unlockCondition = `${typeLabel}${ach.targetValue}`;
    } else if (ach.type === 'stat') {
      const statNames: Record<string, string> = {
        VIT: 'たいりょく',
        INT: 'かしこさ',
        MND: 'せいしん',
        DEX: 'きようさ',
        CHA: 'みりょく',
        STR: 'ちから',
      };
      unlockCondition = `${statNames[ach.targetStatType ?? ''] ?? ''} ${ach.targetValue}`;
    } else if (ach.type === 'streak') {
      unlockCondition = `${ach.targetValue}にち ${typeLabel}`;
    } else if (ach.type === 'total') {
      unlockCondition = `${typeLabel} ${ach.targetValue}かい`;
    } else {
      unlockCondition = typeLabel;
    }

    return {
      id: ach.achievementId,
      title: ach.name,
      description: ach.description,
      unlockCondition,
      isUnlocked: userAch?.isUnlocked ?? false,
      iconType: ach.icon,
      rarity: ach.rarity,
      expReward: ach.expReward,
    };
  });

  // ユーザーのジョブ状態をマージ
  const mergedJobs = jobs.map(job => {
    const userJob = userJobs.find(uj => uj.jobId === job.jobId);
    
    // 要件のJSON形式を解析して日本語化
    let unlockCondition = 'じょうけんをみたすとかいほう';
    if (job.requirements) {
      const reqs = job.requirements as Record<string, unknown>;
      const conditions: string[] = [];
      
      if (reqs.level) {
        conditions.push(`Lv.${reqs.level}`);
      }
      
      if (reqs.stats) {
        const statNames: Record<string, string> = {
          VIT: 'たいりょく',
          INT: 'かしこさ',
          MND: 'せいしん',
          DEX: 'きようさ',
          CHA: 'みりょく',
          STR: 'ちから',
        };
        const statReqs = reqs.stats as Record<string, number>;
        for (const [stat, value] of Object.entries(statReqs)) {
          conditions.push(`${statNames[stat] ?? stat} ${value}`);
        }
      }
      
      unlockCondition = conditions.length > 0 ? conditions.join(', ') : unlockCondition;
    }
    
    return {
      id: job.jobId,
      title: job.name,
      description: job.description,
      unlockCondition,
      isUnlocked: userJob?.isUnlocked ?? (job.jobId === 'beginner'),
      isEquipped: userJob?.isEquipped ?? false,
      iconType: job.icon,
      tier: job.tier,
    };
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // レアリティの日本語表記
  const rarityLabels: Record<string, string> = {
    common: 'ふつう',
    uncommon: 'めずらしい',
    rare: 'レア',
    epic: 'エピック',
    legendary: 'でんせつ',
  };

  // レアリティの色
  const rarityColors: Record<string, string> = {
    common: 'text-gray-400 border-gray-600',
    uncommon: 'text-green-400 border-green-600',
    rare: 'text-blue-400 border-blue-600',
    epic: 'text-purple-400 border-purple-600',
    legendary: 'text-yellow-400 border-yellow-600',
  };

  // アチーブメントタイプの日本語表記
  const typeLabels: Record<string, string> = {
    first: 'はじめて',
    streak: 'れんぞく',
    total: 'ごうけい',
    level: 'レベル',
    stat: 'ステータス',
    special: 'とくべつ',
  };

  // ティアの日本語表記
  const tierLabels: Record<string, string> = {
    novice: 'しょしんしゃ',
    apprentice: 'みならい',
    journeyman: 'いちにんまえ',
    expert: 'たつじん',
    master: 'マスター',
    grandmaster: 'グランドマスター',
  };

  // 実際のデータを使用
  const displayAchievements = mergedAchievements;
  const displayJobs = mergedJobs;

  return (
    <div className="space-y-6">
      {/* Achievements Section */}
      <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-amber-300">きんのほこう</h1>
        </div>

        {displayAchievements.length === 0 ? (
          <p className="text-amber-200/70 text-center py-8">
            データをよみこみちゅう...さいしょのログインじにマスターデータがとうにゅうされます
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`relative overflow-hidden rounded-lg border-2 p-4 transition-all ${
                  achievement.isUnlocked
                    ? 'bg-gradient-to-br from-amber-950/60 to-amber-900/60 border-amber-600/50 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-900/30'
                    : 'bg-slate-900/40 border-slate-700/50 opacity-60'
                }`}
              >
                {/* Icon */}
                <div className="relative mb-4">
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center border-2 ${
                      achievement.isUnlocked
                        ? 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-500/50'
                        : 'bg-slate-800/60 border-slate-700/50'
                    }`}
                  >
                    {/* Pixel grid effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_3px,rgba(0,0,0,0.1)_3px),linear-gradient(to_right,transparent_3px,rgba(0,0,0,0.1)_3px)] bg-[length:8px_8px] rounded-lg"></div>
                    
                    {achievement.isUnlocked ? (
                      <span className="text-5xl relative z-10">{achievement.iconType}</span>
                    ) : (
                      <Lock className="w-16 h-16 text-slate-500 relative z-10" />
                    )}
                  </div>

                  {/* Unlocked Badge */}
                  {achievement.isUnlocked && (
                    <div className="absolute -top-2 -right-2 bg-green-600 border-2 border-green-400 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3
                    className={`font-bold ${
                      achievement.isUnlocked ? 'text-amber-200' : 'text-slate-400'
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      achievement.isUnlocked ? 'text-amber-300/70' : 'text-slate-500'
                    }`}
                  >
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div
                      className={`text-xs font-semibold px-2 py-1 rounded border inline-block ${
                        achievement.isUnlocked
                          ? 'bg-amber-950/40 text-amber-400 border-amber-700/50'
                          : 'bg-slate-800/40 text-slate-500 border-slate-700/50'
                      }`}
                    >
                      {achievement.unlockCondition}
                    </div>
                    <span className="text-xs text-yellow-400">
                      +{achievement.expReward} EXP
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Jobs Section */}
      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-2 border-purple-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <Crown className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-purple-300">職業</h1>
        </div>

        {displayJobs.length === 0 ? (
          <p className="text-purple-200/70 text-center py-8">
            職業はまだありません
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayJobs.map((job) => (
              <div
                key={job.id}
                className={`relative overflow-hidden rounded-lg border-2 p-4 transition-all ${
                  job.isUnlocked
                    ? 'bg-gradient-to-br from-purple-950/60 to-purple-900/60 border-purple-600/50 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/30'
                    : 'bg-slate-900/40 border-slate-700/50 opacity-60'
                }`}
              >
                {/* Icon */}
                <div className="relative mb-4">
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center border-2 ${
                      job.isUnlocked
                        ? 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500/50'
                        : 'bg-slate-800/60 border-slate-700/50'
                    }`}
                  >
                    {/* Pixel grid effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_3px,rgba(0,0,0,0.1)_3px),linear-gradient(to_right,transparent_3px,rgba(0,0,0,0.1)_3px)] bg-[length:8px_8px] rounded-lg"></div>
                    
                    {job.isUnlocked ? (
                      <span className="text-5xl relative z-10">{job.iconType}</span>
                    ) : (
                      <Lock className="w-16 h-16 text-slate-500 relative z-10" />
                    )}
                  </div>

                  {/* Unlocked/Equipped Badge */}
                  {job.isUnlocked && (
                    <div className={`absolute -top-2 -right-2 ${job.isEquipped ? 'bg-yellow-600 border-yellow-400' : 'bg-green-600 border-green-400'} border-2 rounded-full p-1`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-bold ${
                        job.isUnlocked ? 'text-purple-200' : 'text-slate-400'
                      }`}
                    >
                      {job.title}
                    </h3>
                    {job.isEquipped && (
                      <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">
                        そうびちゅう
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      job.isUnlocked ? 'text-purple-300/70' : 'text-slate-500'
                    }`}
                  >
                    {job.description}
                  </p>
                  <div
                    className={`text-xs font-semibold px-2 py-1 rounded border inline-block ${
                      job.isUnlocked
                        ? 'bg-purple-950/40 text-purple-400 border-purple-700/50'
                        : 'bg-slate-800/40 text-slate-500 border-slate-700/50'
                    }`}
                  >
                    {job.unlockCondition}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Summary */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-amber-300 mb-4">進捗度</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/40 border border-amber-800/30 rounded-lg p-4">
            <div className="text-sm text-amber-200 mb-1">解放済みの称号</div>
            <div className="text-3xl font-bold text-amber-400">
              {displayAchievements.filter((a) => a.isUnlocked).length} / {displayAchievements.length}
            </div>
          </div>
          <div className="bg-slate-900/40 border border-purple-800/30 rounded-lg p-4">
            <div className="text-sm text-purple-200 mb-1">解放済みの職業</div>
            <div className="text-3xl font-bold text-purple-400">
              {displayJobs.filter((j) => j.isUnlocked).length} / {displayJobs.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
