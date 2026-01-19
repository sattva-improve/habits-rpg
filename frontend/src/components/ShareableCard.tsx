import { forwardRef, useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getCharacterImagePath } from '@/components/common';
import { LEVEL_THRESHOLDS } from '@/constants/game';

// レベルに必要な経験値を計算
function getExpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level > LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[level - 1];
}

export interface ShareableCardProps {
  width?: number;
  height?: number;
  variant?: 'twitter' | 'instagram';
  completedCount?: number;
  totalHabits?: number;
}

/**
 * SNS投稿用のシェアカードコンポーネント
 * html2canvasで画像化するための表示用コンポーネント
 */
export const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  ({ width = 1200, height = 630, variant = 'twitter', completedCount = 0, totalHabits = 0 }, ref) => {
    const { userData, jobs } = useUser();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>('');

    // データ取得
    const level = userData?.level ?? 1;
    const totalExp = userData?.totalExp ?? 0;
    const currentLevelExp = getExpForLevel(level);
    const nextLevelExp = getExpForLevel(level + 1);
    const expProgress = nextLevelExp > currentLevelExp 
      ? Math.min(((totalExp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100, 100)
      : 100;

    const displayName = userData?.displayName ?? '冒険者';
    const currentStreak = userData?.currentStreak ?? 0;
    const maxStreak = userData?.maxStreak ?? 0;
    const gender = userData?.gender ?? 'male';
    const currentJobId = userData?.currentJobId ?? 'beginner';

    // ジョブ名取得
    const getCurrentJobName = () => {
      if (!userData?.currentJobId || userData.currentJobId === 'beginner') {
        return 'みならい';
      }
      const job = jobs.find(j => j.jobId === userData.currentJobId);
      return job?.name ?? 'みならい';
    };

    // ステータス
    const stats = [
      { stat: 'たいりょく', value: userData?.vitality ?? 1 },
      { stat: 'かしこさ', value: userData?.intelligence ?? 1 },
      { stat: 'せいしん', value: userData?.mental ?? 1 },
      { stat: 'きようさ', value: userData?.dexterity ?? 1 },
      { stat: 'みりょく', value: userData?.charisma ?? 1 },
      { stat: 'ちから', value: userData?.strength ?? 1 },
    ];

    // キャラクター画像パス
    const characterPath = getCharacterImagePath(currentJobId, gender);

    // 画像をBase64に変換してhtml2canvasで確実にレンダリング
    useEffect(() => {
      const loadImage = async () => {
        try {
          const response = await fetch(characterPath);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageSrc(reader.result as string);
            setImageLoaded(true);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Failed to load character image:', error);
          setImageLoaded(true); // エラーでも処理を続行
        }
      };
      loadImage();
    }, [characterPath]);

    // Instagram用の正方形レイアウト
    const isSquare = variant === 'instagram';
    const containerWidth = isSquare ? 1080 : width;
    const containerHeight = isSquare ? 1080 : height;

    return (
      <div
        ref={ref}
        style={{
          width: containerWidth,
          height: containerHeight,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
          padding: isSquare ? 60 : 40,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '"Hiragino Sans", "Meiryo", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景装飾 */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* ヘッダー部分 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isSquare ? 40 : 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* ロゴ */}
            <div
              style={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
              }}
            >
              ⚔️
            </div>
            <div>
              <div style={{ color: '#fbbf24', fontSize: 28, fontWeight: 'bold' }}>
                Habits RPG
              </div>
              <div style={{ color: '#94a3b8', fontSize: 14 }}>
                習慣を冒険に変える
              </div>
            </div>
          </div>
          <div style={{ color: '#64748b', fontSize: 16 }}>
            {new Date().toLocaleDateString('ja-JP')}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            gap: isSquare ? 50 : 40,
            flexDirection: isSquare ? 'column' : 'row',
          }}
        >
          {/* 左側: キャラクター情報 */}
          <div
            style={{
              flex: isSquare ? undefined : '0 0 320px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* キャラクター画像 */}
            <div
              style={{
                width: isSquare ? 200 : 180,
                height: isSquare ? 200 : 180,
                background: 'linear-gradient(135deg, #374151, #1f2937)',
                borderRadius: 20,
                border: '3px solid #d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                overflow: 'hidden',
              }}
            >
              {imageLoaded && imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Character"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(217, 119, 6, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 48,
                  }}
                >
                  ⚔️
                </div>
              )}
            </div>

            {/* 名前とジョブ */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: '#fbbf24',
                  fontSize: isSquare ? 32 : 28,
                  fontWeight: 'bold',
                  marginBottom: 8,
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: isSquare ? 20 : 18,
                  marginBottom: 16,
                }}
              >
                {getCurrentJobName()}
              </div>
              
              {/* レベルバッジ */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  padding: '8px 20px',
                  borderRadius: 30,
                }}
              >
                <span style={{ fontSize: 20 }}>⭐</span>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                  Lv. {level}
                </span>
              </div>
            </div>
          </div>

          {/* 右側: ステータスとストリーク */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* 経験値バー */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '2px solid rgba(217, 119, 6, 0.5)',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>けいけんち</span>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                  {totalExp - currentLevelExp} / {nextLevelExp - currentLevelExp}
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 20,
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${expProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>

            {/* ストリーク情報 */}
            <div
              style={{
                display: 'flex',
                gap: 20,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 150,
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '2px solid rgba(217, 119, 6, 0.5)',
                  borderRadius: 12,
                  padding: 16,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>🔥</div>
                <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 28 }}>
                  {currentStreak}日
                </div>
                <div style={{ color: '#94a3b8', fontSize: 14 }}>れんぞく</div>
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 150,
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '2px solid rgba(217, 119, 6, 0.5)',
                  borderRadius: 12,
                  padding: 16,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>⭐</div>
                <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 28 }}>
                  {maxStreak}日
                </div>
                <div style={{ color: '#94a3b8', fontSize: 14 }}>さいこうきろく</div>
              </div>
              {totalHabits > 0 && (
                <div
                  style={{
                    flex: 1,
                    minWidth: 150,
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '2px solid rgba(217, 119, 6, 0.5)',
                    borderRadius: 12,
                    padding: 16,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 4 }}>✅</div>
                  <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 28 }}>
                    {completedCount}/{totalHabits}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 14 }}>きょうのクエスト</div>
                </div>
              )}
            </div>

            {/* ステータス一覧 */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '2px solid rgba(217, 119, 6, 0.5)',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div
                style={{
                  color: '#fbbf24',
                  fontWeight: 'bold',
                  marginBottom: 16,
                  fontSize: 18,
                }}
              >
                ステータス
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isSquare ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                  gap: 12,
                }}
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: 8,
                      padding: '10px 14px',
                    }}
                  >
                    <span style={{ color: '#94a3b8', fontSize: 14 }}>{stat.stat}</span>
                    <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 18 }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            paddingTop: 20,
            borderTop: '1px solid rgba(100, 116, 139, 0.3)',
          }}
        >
          <span style={{ color: '#64748b', fontSize: 14 }}>
            #HabitsRPG #習慣化 #ゲーミフィケーション
          </span>
        </div>
      </div>
    );
  }
);

ShareableCard.displayName = 'ShareableCard';
