import { Sword, Shield, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { SpriteAnimation, SPRITE_PRESETS } from '@/components/common';
import { LEVEL_THRESHOLDS } from '@/constants/game';

// スプライト画像のパス（ジョブIDに対応）
// PNG画像が用意できたら .svg を .png に変更する
const SPRITE_PATHS: Record<string, string> = {
  beginner: '/sprites/beginner-idle.png',
  warrior: '/sprites/warrior-idle.png',
  mage: '/sprites/mage-idle.png',
  default: '/sprites/beginner-idle.png',
};

// レベルに必要な経験値を計算
function getExpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level > LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[level - 1];
}

export function Header() {
  const { signOut } = useAuth();
  const { userData, jobs, isLoading } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('サインアウトエラー:', error);
    }
  };

  // 現在のジョブ名を取得
  const getCurrentJobName = () => {
    if (!userData?.currentJobId || userData.currentJobId === 'beginner') {
      return 'みならい';
    }
    const job = jobs.find(j => j.jobId === userData.currentJobId);
    return job?.name ?? 'みならい';
  };

  // 現在のジョブに対応するスプライトパスを取得
  const getSpriteUrl = () => {
    const jobId = userData?.currentJobId ?? 'beginner';
    return SPRITE_PATHS[jobId] ?? SPRITE_PATHS.default;
  };

  // レベルと経験値
  const level = userData?.level ?? 1;
  const totalExp = userData?.totalExp ?? 0;
  const currentLevelExp = getExpForLevel(level);
  const nextLevelExp = getExpForLevel(level + 1);
  const expProgress = nextLevelExp > currentLevelExp 
    ? Math.min(((totalExp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100, 100)
    : 100;

  if (isLoading) {
    return (
      <header className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 mb-6 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 mb-6 relative overflow-hidden backdrop-blur-sm">
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/30"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/30"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/30"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/30"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Left: Avatar (Large) - Sprite Animation */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center shadow-xl relative overflow-hidden border-4 border-amber-500/50">
            {/* Pixel grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_3px,rgba(0,0,0,0.1)_3px),linear-gradient(to_right,transparent_3px,rgba(0,0,0,0.1)_3px)] bg-[length:8px_8px] pointer-events-none z-20"></div>
            {/* スプライトアニメーション */}
            <SpriteAnimation
              src={getSpriteUrl()}
              {...SPRITE_PRESETS.hdIdle}
              scale={1.25}
              className="relative z-10"
            />
          </div>
        </div>

        {/* Center: User Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300">
              Habit RPG
            </h1>
            <Sword className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-sm font-bold text-amber-300 bg-amber-950/50 px-3 py-1 rounded border border-amber-600/50">
              Lv.{level}
            </span>
            <span className="text-amber-100 font-semibold">
              {userData?.displayName ?? 'ぼうけんしゃ'}
            </span>
            <span className="text-amber-400/70 text-sm">• {getCurrentJobName()}</span>
          </div>
          
          {/* EXP Progress mini bar */}
          <div className="mt-2 max-w-xs mx-auto md:mx-0">
            <div className="flex items-center justify-between text-xs text-amber-400/70 mb-1">
              <span>EXP</span>
              <span>{totalExp} / {nextLevelExp}</span>
            </div>
            <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-amber-900/30">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Logout Button */}
        <div className="flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="bg-red-900/30 border-red-600/50 text-red-300 hover:bg-red-900/50 hover:text-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </div>
    </header>
  );
}
