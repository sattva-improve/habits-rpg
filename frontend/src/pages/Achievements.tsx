import { useState } from 'react';
import { Trophy, Crown, Lock, Check, Loader2, Sword, User, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import type { Gender } from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ImageWithFallback } from '@/components/common';
import { checkJobRequirements, getJobUnlockProgress } from '@/utils/jobRequirements';

export function Achievements() {
  const { 
    achievements, 
    userAchievements, 
    jobs, 
    userJobs, 
    userData,
    selectJob,
    changeGender,
    isLoading 
  } = useUser();
  
  const [isSelectingJob, setIsSelectingJob] = useState<string | null>(null);
  const [isChangingGender, setIsChangingGender] = useState(false);

  // 性別変更ハンドラー
  const handleChangeGender = async (gender: Gender) => {
    if (userData?.gender === gender) return;
    
    setIsChangingGender(true);
    const success = await changeGender(gender);
    setIsChangingGender(false);
    
    if (success) {
      const genderLabel = gender === 'male' ? '男性' : '女性';
      toast.success(`👤 性別を「${genderLabel}」に変更しました！`, {
        description: 'キャラクターの見た目が変わりました',
      });
    } else {
      toast.error('性別の変更に失敗しました', {
        description: 'もう一度お試しください',
      });
    }
  };

  // 職業選択ハンドラー
  const handleSelectJob = async (jobId: string, jobName: string) => {
    setIsSelectingJob(jobId);
    const success = await selectJob(jobId);
    setIsSelectingJob(null);
    
    if (success) {
      toast.success(`⚔️ 職業を「${jobName}」に変更しました！`, {
        description: '新しい冒険の始まりです！',
      });
    } else {
      toast.error('職業の変更に失敗しました', {
        description: 'もう一度お試しください',
      });
    }
  };

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

  // ユーザーのジョブ状態をマージ（新しいユーティリティ関数を使用）
  const mergedJobs = jobs.map(job => {
    const userJob = userJobs.find(uj => uj.jobId === job.jobId);
    const isUnlocked = userJob?.isUnlocked ?? (job.jobId === 'beginner');
    
    let requirementResults = undefined;
    let progress = undefined;
    
    if (userData) {
      requirementResults = checkJobRequirements(
        job.requirements,
        userData,
        userJobs,
        userAchievements,
        jobs.map(j => ({ jobId: j.jobId, name: j.name })),
        achievements.map(a => ({ achievementId: a.achievementId, name: a.name }))
      );
      
      progress = getJobUnlockProgress(
        job.requirements,
        userData,
        userJobs,
        userAchievements
      );
    }
    
    return {
      id: job.jobId,
      title: job.name,
      description: job.description,
      requirements: job.requirements,
      requirementResults,
      progress,
      isUnlocked,
      isEquipped: userData?.currentJobId === job.jobId,
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
          <h1 className="text-3xl font-bold text-amber-300">称号</h1>
        </div>

        {displayAchievements.length === 0 ? (
          <p className="text-amber-200/70 text-center py-8">
            データをよみこみちゅう...さいしょのログインじにマスターデータがとうにゅうされます
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {displayAchievements.map((achievement) => (
              <Popover key={achievement.id}>
                <PopoverTrigger asChild>
                  <div
                    className={`relative overflow-hidden rounded-lg border-2 p-2 transition-all cursor-pointer ${
                      achievement.isUnlocked
                        ? 'bg-gradient-to-br from-amber-950/60 to-amber-900/60 border-amber-600/50 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-900/30'
                        : 'bg-slate-900/40 border-slate-700/50 opacity-60'
                    }`}
                  >
                    {/* Icon */}
                    <div className="relative">
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
                          <span className="text-2xl md:text-4xl relative z-10">{achievement.iconType}</span>
                        ) : (
                          <Lock className="w-6 h-6 md:w-10 md:h-10 text-slate-500 relative z-10" />
                        )}
                      </div>

                      {/* Unlocked Badge */}
                      {achievement.isUnlocked && (
                        <div className="absolute -top-1 -right-1 bg-green-600 border border-green-400 rounded-full p-0.5">
                          <Check className="w-2 h-2 md:w-3 md:h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Title (compact) */}
                    <div className="mt-1">
                      <h3
                        className={`font-bold text-[10px] md:text-xs truncate ${
                          achievement.isUnlocked ? 'text-amber-200' : 'text-slate-400'
                        }`}
                      >
                        {achievement.title}
                      </h3>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-slate-900 border border-amber-600/50 p-3">
                  <div className="space-y-2">
                    <h4 className="font-bold text-amber-200">{achievement.title}</h4>
                    <p className="text-sm text-amber-300/80">{achievement.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-700/50">
                        {achievement.unlockCondition}
                      </span>
                      <span className="text-yellow-400">+{achievement.expReward} EXP</span>
                    </div>
                    {!achievement.isUnlocked && (
                      <p className="text-xs text-slate-400 mt-2">※ まだ解放されていません</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
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
          <div className="grid grid-cols-4 gap-2">
            {displayJobs.map((job) => {
              // ジョブのスプライト画像パスを生成
              const gender = userData?.gender || 'male';
              const jobSpritePath = `/sprites/${gender}/${job.id}.png`;
              const fallbackSpritePath = `/sprites/${gender}/beginner.png`;
              
              return (
                <Popover key={job.id}>
                  <PopoverTrigger asChild>
                    <div
                      className={`relative overflow-hidden rounded-lg border-2 p-2 transition-all cursor-pointer ${
                        job.isUnlocked
                          ? 'bg-gradient-to-br from-purple-950/60 to-purple-900/60 border-purple-600/50 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/30'
                          : 'bg-slate-900/40 border-slate-700/50 opacity-60'
                      }`}
                    >
                      {/* Icon */}
                      <div className="relative">
                        <div
                          className={`w-full aspect-square rounded-lg flex items-center justify-center border-2 overflow-hidden ${
                            job.isUnlocked
                              ? 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500/50'
                              : 'bg-slate-800/60 border-slate-700/50'
                          }`}
                        >
                          {/* Pixel grid effect */}
                          <div className="absolute inset-0 bg-[linear-gradient(transparent_3px,rgba(0,0,0,0.1)_3px),linear-gradient(to_right,transparent_3px,rgba(0,0,0,0.1)_3px)] bg-[length:8px_8px] rounded-lg z-10"></div>
                          
                          {job.isUnlocked ? (
                            <ImageWithFallback
                              src={jobSpritePath}
                              fallbackSrc={fallbackSpritePath}
                              alt={job.title}
                              className="w-full h-full object-contain [image-rendering:pixelated]"
                            />
                          ) : (
                            <Lock className="w-6 h-6 md:w-10 md:h-10 text-slate-500 relative z-10" />
                          )}
                        </div>

                        {/* Progress Badge (for locked jobs) */}
                        {!job.isUnlocked && job.progress && (
                          <div className="absolute top-1 left-1 bg-slate-900/90 border border-purple-600/50 rounded px-1.5 py-0.5">
                            <span className="text-[10px] text-purple-400">
                              {job.progress.percentage}%
                            </span>
                          </div>
                        )}

                        {/* Unlocked/Equipped Badge */}
                        {job.isUnlocked && (
                          <div className={`absolute -top-1 -right-1 ${job.isEquipped ? 'bg-yellow-600 border-yellow-400' : 'bg-green-600 border-green-400'} border rounded-full p-0.5`}>
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Title (compact) */}
                      <div className="mt-1">
                        <h3
                          className={`font-bold text-[10px] md:text-xs truncate ${
                            job.isUnlocked ? 'text-purple-200' : 'text-slate-400'
                          }`}
                        >
                          {job.title}
                        </h3>
                        {job.isEquipped && (
                          <span className="text-[8px] md:text-[10px] bg-yellow-600 text-white px-1 rounded">
                            そうび
                          </span>
                        )}
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-slate-900 border border-purple-600/50 p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-purple-200">{job.title}</h4>
                        {job.isEquipped && (
                          <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">
                            そうびちゅう
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-purple-300/80">{job.description}</p>
                      
                      {!job.isUnlocked && job.requirementResults && job.requirementResults.length > 0 && (
                        <div className="space-y-2 border-t border-purple-800/30 pt-3">
                          <div className="text-xs text-purple-400 font-semibold">解放条件:</div>
                          
                          {job.requirementResults.map((req, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className={req.isMet ? 'text-green-400' : 'text-slate-400'}>
                                  {req.label}: {req.current} / {req.required}
                                </span>
                                {req.isMet ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <X className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    req.isMet 
                                      ? 'bg-gradient-to-r from-green-600 to-green-400' 
                                      : 'bg-gradient-to-r from-purple-600 to-purple-400'
                                  }`}
                                  style={{ width: `${Math.min(req.percentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                          
                          {job.progress && (
                            <div className="border-t border-purple-800/30 pt-3">
                              <div className="text-xs text-purple-400 mb-2">
                                達成: {job.progress.completed} / {job.progress.total} ({job.progress.percentage}%)
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
                                  style={{ width: `${job.progress.percentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {job.isUnlocked && !job.isEquipped && (
                        <button
                          onClick={() => handleSelectJob(job.id, job.title)}
                          disabled={isSelectingJob !== null}
                          className="w-full flex items-center justify-center gap-1 text-xs font-semibold px-3 py-2 rounded border bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSelectingJob === job.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sword className="w-3 h-3" />
                          )}
                          <span>そうびする</span>
                        </button>
                      )}
                      
                      {!job.isUnlocked && (
                        <p className="text-xs text-slate-400 text-center pt-2">
                          ※ まだ解放されていません
                        </p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })}
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

      {/* キャラクター設定 - 性別選択 */}
      <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 border-2 border-cyan-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-cyan-300">キャラクター設定</h2>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-cyan-200 mb-3">性別</div>
            <div className="flex gap-4">
              <button
                onClick={() => handleChangeGender('male')}
                disabled={isChangingGender}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg border-2 transition-all ${
                  userData?.gender === 'male' || (!userData?.gender && true)
                    ? 'bg-gradient-to-br from-cyan-600 to-cyan-800 border-cyan-400 text-white shadow-lg shadow-cyan-900/30'
                    : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:border-cyan-600/50 hover:bg-slate-800/40'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isChangingGender ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="text-2xl">👨</span>
                    <span className="font-semibold">男性</span>
                    {(userData?.gender === 'male' || !userData?.gender) && (
                      <Check className="w-5 h-5 text-cyan-200" />
                    )}
                  </>
                )}
              </button>
              <button
                onClick={() => handleChangeGender('female')}
                disabled={isChangingGender}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg border-2 transition-all ${
                  userData?.gender === 'female'
                    ? 'bg-gradient-to-br from-cyan-600 to-cyan-800 border-cyan-400 text-white shadow-lg shadow-cyan-900/30'
                    : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:border-cyan-600/50 hover:bg-slate-800/40'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isChangingGender ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="text-2xl">👩</span>
                    <span className="font-semibold">女性</span>
                    {userData?.gender === 'female' && (
                      <Check className="w-5 h-5 text-cyan-200" />
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-cyan-400/60">
            ※ 性別を変更するとキャラクターのドット絵が変わります
          </p>
        </div>
      </div>
    </div>
  );
}
