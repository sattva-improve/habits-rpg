/**
 * プロフィール設定ページ
 * Google OAuth等のSSO認証後に新規ユーザーがユーザー名を設定するための画面
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { userService } from '@/services';
import { fetchUserAttributes } from 'aws-amplify/auth';

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!displayName.trim()) {
      setError('ユーザー名を入力してください');
      return;
    }

    if (displayName.length < 2 || displayName.length > 20) {
      setError('ユーザー名は2〜20文字で入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('ユーザー情報を取得できません');
      }

      // ユーザー属性からメールアドレスを取得
      let email = user.signInDetails?.loginId;
      if (!email) {
        try {
          const attributes = await fetchUserAttributes();
          email = attributes.email ?? `${user.userId}@example.com`;
        } catch {
          email = `${user.userId}@example.com`;
        }
      }

      // ユーザーが既に存在するか確認
      const existingUser = await userService.getUser(user.userId);
      
      if (existingUser) {
        // 既存ユーザーの場合は更新
        await userService.updateUser(user.userId, {
          displayName: displayName.trim(),
        });
      } else {
        // 新規ユーザーの場合は作成
        await userService.createUser({
          userId: user.userId,
          email,
          displayName: displayName.trim(),
        });
      }

      // ダッシュボードへリダイレクト
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to setup profile:', err);
      setError(err instanceof Error ? err.message : 'プロフィールの設定に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">🎮 プロフィール設定</CardTitle>
          <CardDescription className="text-slate-400">
            Habits RPGへようこそ！<br />
            冒険で使うユーザー名を決めましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-slate-200">ユーザー名</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="冒険者の名前"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                maxLength={20}
                required
                autoFocus
              />
              <p className="text-xs text-slate-500">2〜20文字で入力してください</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
              disabled={isLoading}
            >
              {isLoading ? '設定中...' : '冒険を始める！'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
