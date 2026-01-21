import html2canvas from 'html2canvas';

export type ImageVariant = 'twitter' | 'instagram';

export interface GenerateImageOptions {
  element: HTMLElement;
  variant: ImageVariant;
  filename?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * 各バリアントの画像サイズ
 */
export const IMAGE_DIMENSIONS: Record<ImageVariant, ImageDimensions> = {
  twitter: { width: 1200, height: 630 },
  instagram: { width: 1080, height: 1080 },
};

/**
 * DOM要素から画像を生成してCanvasを返す
 */
export async function generateCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  const canvas = await html2canvas(element, {
    scale: 2, // 高解像度
    useCORS: true,
    allowTaint: false, // taintを許可しない（CORSエラー防止）
    backgroundColor: '#0f172a',
    logging: false,
    imageTimeout: 15000, // 画像読み込みのタイムアウトを延長
    onclone: (clonedDoc, clonedElement) => {
      // クローンされた要素を可視状態にする
      clonedElement.style.visibility = 'visible';
      clonedElement.style.position = 'static';
      clonedElement.style.left = '0';
      clonedElement.style.top = '0';
    },
  });
  
  return canvas;
}

/**
 * DOM要素からBlobを生成
 */
export async function generateImageBlob(element: HTMLElement): Promise<Blob> {
  const canvas = await generateCanvas(element);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('画像の生成に失敗しました'));
      }
    }, 'image/png');
  });
}

/**
 * DOM要素からDataURLを生成
 */
export async function generateImageDataUrl(element: HTMLElement): Promise<string> {
  const canvas = await generateCanvas(element);
  return canvas.toDataURL('image/png');
}

/**
 * 画像をダウンロード
 */
export async function downloadImage(options: GenerateImageOptions): Promise<void> {
  const { element, variant, filename } = options;
  
  const canvas = await generateCanvas(element);
  const dataUrl = canvas.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.download = filename ?? `habits-rpg-${variant}-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Web Share APIでシェア
 */
export async function shareImage(element: HTMLElement, title?: string): Promise<boolean> {
  // Web Share APIが利用可能か確認
  if (!navigator.share || !navigator.canShare) {
    return false;
  }

  try {
    const blob = await generateImageBlob(element);
    const file = new File([blob], 'habits-rpg-share.png', { type: 'image/png' });

    // canShareでファイルシェアがサポートされているか確認
    if (!navigator.canShare({ files: [file] })) {
      return false;
    }

    await navigator.share({
      title: title ?? 'Habits RPG - 今日の冒険の成果',
      text: '#HabitsRPG #習慣化 #ゲーミフィケーション\n習慣を冒険に変えよう！',
      files: [file],
    });

    return true;
  } catch (error) {
    // ユーザーがキャンセルした場合はエラーにしない
    if (error instanceof Error && error.name === 'AbortError') {
      return false;
    }
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Web Share APIが利用可能かどうか
 */
export function isShareSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share && typeof navigator.canShare === 'function';
}

/**
 * プレビュー用にDataURLを生成
 */
export async function generatePreview(element: HTMLElement): Promise<string> {
  return generateImageDataUrl(element);
}
