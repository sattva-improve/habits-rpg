import { useRef, useState, useCallback, useEffect } from 'react';
import { Share2, Download, X, Loader2, Twitter, Instagram } from 'lucide-react';
import { ShareableCard } from './ShareableCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  downloadImage,
  shareImage,
  isShareSupported,
  generatePreview,
  IMAGE_DIMENSIONS,
  type ImageVariant,
} from '@/utils/imageGenerator';
import { toast } from 'sonner';

export interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedCount?: number;
  totalHabits?: number;
}

/**
 * シェア画像プレビュー＆ダウンロードモーダル
 */
export function ShareModal({ open, onOpenChange, completedCount = 0, totalHabits = 0 }: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<ImageVariant>('twitter');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const canShare = isShareSupported();
  const dimensions = IMAGE_DIMENSIONS[variant];

  // プレビュー画像を生成
  const updatePreview = useCallback(async () => {
    if (!cardRef.current || !open) return;
    
    setIsLoadingPreview(true);
    try {
      // 画像のロードとDOM更新を待つため十分な時間を確保
      await new Promise(resolve => setTimeout(resolve, 500));
      const dataUrl = await generatePreview(cardRef.current);
      setPreview(dataUrl);
    } catch (error) {
      console.error('Preview generation failed:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  }, [open]);

  // モーダルが開いた時とvariantが変わった時にプレビューを更新
  useEffect(() => {
    if (open) {
      // 画像のロードとDOMが描画されるのを待ってからプレビュー生成
      const timer = setTimeout(() => {
        updatePreview();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [open, variant, updatePreview]);

  // ダウンロード処理
  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      await downloadImage({
        element: cardRef.current,
        variant,
      });
      toast.success('画像をダウンロードしました！');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('ダウンロードに失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // シェア処理
  const handleShare = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const shared = await shareImage(cardRef.current);
      if (!shared) {
        // Web Share APIが使えない場合はダウンロードにフォールバック
        await handleDownload();
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('シェアに失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // クリップボードにコピー（フォールバック）
  const handleCopyToClipboard = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await import('html2canvas').then(m => m.default(cardRef.current!));
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            toast.success('画像をクリップボードにコピーしました！');
          } catch {
            toast.error('クリップボードへのコピーに失敗しました');
          }
        }
        setIsGenerating(false);
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('コピーに失敗しました');
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-slate-900 border-amber-600/50 text-amber-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-300 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            シェア画像を作成
          </DialogTitle>
        </DialogHeader>

        {/* バリアント選択 */}
        <div className="flex gap-3 mb-4">
          <Button
            variant={variant === 'twitter' ? 'default' : 'outline'}
            onClick={() => setVariant('twitter')}
            className={variant === 'twitter' 
              ? 'bg-amber-600 hover:bg-amber-700 text-white' 
              : 'border-amber-600/50 text-amber-300 hover:bg-amber-600/20'
            }
          >
            <Twitter className="w-4 h-4 mr-2" />
            Twitter (1200×630)
          </Button>
          <Button
            variant={variant === 'instagram' ? 'default' : 'outline'}
            onClick={() => setVariant('instagram')}
            className={variant === 'instagram' 
              ? 'bg-amber-600 hover:bg-amber-700 text-white' 
              : 'border-amber-600/50 text-amber-300 hover:bg-amber-600/20'
            }
          >
            <Instagram className="w-4 h-4 mr-2" />
            Instagram (1080×1080)
          </Button>
        </div>

        {/* プレビュー表示 */}
        <div className="relative bg-slate-800 rounded-lg p-4 border border-amber-600/30">
          <div className="text-sm text-amber-400 mb-2">プレビュー</div>
          
          {isLoadingPreview ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <span className="ml-2 text-amber-300">プレビューを生成中...</span>
            </div>
          ) : preview ? (
            <div className="flex justify-center">
              <img 
                src={preview} 
                alt="Share Preview"
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-20 text-amber-500">
              プレビューを読み込んでいます...
            </div>
          )}
        </div>

        {/* 実際のカード（非表示でレンダリング） */}
        <div 
          style={{ 
            position: 'absolute', 
            left: '-9999px', 
            top: '-9999px',
            visibility: 'hidden',
          }}
        >
          <ShareableCard
            ref={cardRef}
            variant={variant}
            width={dimensions.width}
            height={dimensions.height}
            completedCount={completedCount}
            totalHabits={totalHabits}
          />
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3 justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <X className="w-4 h-4 mr-2" />
            閉じる
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCopyToClipboard}
            disabled={isGenerating}
            className="border-amber-600/50 text-amber-300 hover:bg-amber-600/20"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            コピー
          </Button>

          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            ダウンロード
          </Button>

          {canShare && (
            <Button
              onClick={handleShare}
              disabled={isGenerating}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              シェア
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
