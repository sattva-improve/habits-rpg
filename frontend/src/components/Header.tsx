import { useState } from 'react';
import { Shield, LogOut, Loader2, Pencil, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CharacterImage, getCharacterImagePath } from '@/components/common';
import { LEVEL_THRESHOLDS } from '@/constants/game';
import { userService } from '@/services';
import { toast } from 'sonner';

// レベルに必要な経験値を計算
function getExpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level > LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[level - 1];
}

export function Header() {
  const { signOut } = useAuth();
  const { userData, jobs, isLoading, refreshUserData } = useUser();
  
  // 名前編集の状態
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('サインアウトエラー:', error);
    }
  };

  // 名前編集を開始
  const startEditingName = () => {
    setEditedName(userData?.displayName ?? '');
    setIsEditingName(true);
  };

  // 名前を保存
  const saveDisplayName = async () => {
    if (!userData || !editedName.trim()) return;
    
    const trimmedName = editedName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 20) {
      toast.error('ユーザー名は2〜20文字で入力してください');
      return;
    }

    setIsSavingName(true);
    try {
      await userService.updateUser(userData.userId, { displayName: trimmedName });
      await refreshUserData();
      toast.success('ユーザー名を変更しました！');
      setIsEditingName(false);
    } catch (error) {
      console.error('名前の更新に失敗:', error);
      toast.error('ユーザー名の変更に失敗しました');
    } finally {
      setIsSavingName(false);
    }
  };

  // 名前編集をキャンセル
  const cancelEditingName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  // 現在のジョブ名を取得
  const getCurrentJobName = () => {
    if (!userData?.currentJobId || userData.currentJobId === 'beginner') {
      return 'みならい';
    }
    const job = jobs.find(j => j.jobId === userData.currentJobId);
    return job?.name ?? 'みならい';
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
      
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Left: Avatar (Extra Large) - Character Image */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center shadow-xl relative overflow-hidden border-4 border-amber-500/50">
            {/* Pixel grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_3px,rgba(0,0,0,0.1)_3px),linear-gradient(to_right,transparent_3px,rgba(0,0,0,0.1)_3px)] bg-[length:8px_8px] pointer-events-none z-20"></div>
            {/* キャラクター画像 */}
            <CharacterImage
              src={getCharacterImagePath(userData?.currentJobId, userData?.gender ?? 'male')}
              width={160}
              height={160}
              className="relative z-10"
              alt="キャラクター"
            />
          </div>
        </div>

        {/* Center: User Info */}
        <div className="flex-1 text-center md:text-left">
          {/* User Name - Large Display with Edit */}
          <div className="mb-4">
            {isEditingName ? (
              <div className="flex items-center gap-2 max-w-md">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-2xl md:text-3xl font-bold bg-slate-800/80 border-amber-600 text-amber-100 h-14"
                  maxLength={20}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveDisplayName();
                    if (e.key === 'Escape') cancelEditingName();
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={saveDisplayName}
                  disabled={isSavingName}
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30"
                >
                  {isSavingName ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={cancelEditingName}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 group cursor-pointer" onClick={startEditingName}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 drop-shadow-lg">
                  {userData?.displayName ?? 'ぼうけんしゃ'}
                </h1>
                <Pencil className="w-5 h-5 text-amber-400/50 group-hover:text-amber-300 transition-colors" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
            <span className="text-lg font-bold text-amber-300 bg-amber-950/50 px-4 py-2 rounded border border-amber-600/50">
              Lv.{level}
            </span>
            <span className="text-amber-400/80 text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              {getCurrentJobName()}
            </span>
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
