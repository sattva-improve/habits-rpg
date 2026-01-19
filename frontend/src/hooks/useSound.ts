/**
 * サウンド再生用カスタムフック
 * 習慣完了時などにフィードバックサウンドを再生
 */

import { useCallback, useRef } from 'react';

// サウンドタイプの定義
export type SoundType = 'complete' | 'levelUp' | 'achievement' | 'click' | 'jobUnlock' | 'menuOpen' | 'error' | 'success';

// 各サウンドの設定
const SOUND_CONFIG: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; volume: number }[]> = {
  // 習慣完了時の気持ちいい音（上昇するチャイム風）
  complete: [
    { frequency: 523.25, duration: 0.1, type: 'sine', volume: 0.3 },  // C5
    { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.3 },  // E5
    { frequency: 783.99, duration: 0.15, type: 'sine', volume: 0.3 }, // G5
    { frequency: 1046.50, duration: 0.25, type: 'sine', volume: 0.25 }, // C6
  ],
  // レベルアップ時のファンファーレ風
  levelUp: [
    { frequency: 523.25, duration: 0.15, type: 'square', volume: 0.2 },
    { frequency: 659.25, duration: 0.15, type: 'square', volume: 0.2 },
    { frequency: 783.99, duration: 0.15, type: 'square', volume: 0.2 },
    { frequency: 1046.50, duration: 0.3, type: 'square', volume: 0.25 },
    { frequency: 1318.51, duration: 0.4, type: 'square', volume: 0.2 },
  ],
  // 称号獲得時
  achievement: [
    { frequency: 392.00, duration: 0.1, type: 'triangle', volume: 0.3 },
    { frequency: 523.25, duration: 0.1, type: 'triangle', volume: 0.3 },
    { frequency: 659.25, duration: 0.1, type: 'triangle', volume: 0.3 },
    { frequency: 783.99, duration: 0.2, type: 'triangle', volume: 0.35 },
    { frequency: 1046.50, duration: 0.35, type: 'triangle', volume: 0.3 },
  ],
  // クリック音（シンプル）
  click: [
    { frequency: 800, duration: 0.05, type: 'sine', volume: 0.15 },
  ],
  // 職業解放時（勇壮なファンファーレ）
  jobUnlock: [
    { frequency: 293.66, duration: 0.12, type: 'square', volume: 0.25 }, // D4
    { frequency: 369.99, duration: 0.12, type: 'square', volume: 0.25 }, // F#4
    { frequency: 440.00, duration: 0.12, type: 'square', volume: 0.25 }, // A4
    { frequency: 587.33, duration: 0.2, type: 'square', volume: 0.3 },   // D5
    { frequency: 739.99, duration: 0.15, type: 'square', volume: 0.28 }, // F#5
    { frequency: 880.00, duration: 0.35, type: 'square', volume: 0.25 }, // A5
  ],
  // メニュー開閉音
  menuOpen: [
    { frequency: 600, duration: 0.06, type: 'sine', volume: 0.12 },
    { frequency: 900, duration: 0.08, type: 'sine', volume: 0.1 },
  ],
  // エラー音（低音で短い）
  error: [
    { frequency: 200, duration: 0.15, type: 'sawtooth', volume: 0.2 },
    { frequency: 150, duration: 0.2, type: 'sawtooth', volume: 0.15 },
  ],
  // 成功音（短い上昇音）
  success: [
    { frequency: 440, duration: 0.08, type: 'sine', volume: 0.2 },
    { frequency: 660, duration: 0.12, type: 'sine', volume: 0.18 },
  ],
};

// AudioContextをシングルトンで管理
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API is not supported in this browser');
      return null;
    }
  }
  
  // サスペンド状態の場合は再開
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  return audioContext;
}

/**
 * Web Audio APIを使ってサウンドを生成・再生
 */
function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  startTime: number
): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  // フェードイン・フェードアウトでなめらかに
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(volume * 0.8, startTime + duration * 0.7);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

// グローバルで再生中かどうかのフラグ
let isGlobalPlaying = false;

/**
 * グローバルサウンド再生関数（Context外でも使用可能）
 */
export function playSoundGlobal(type: SoundType): void {
  // 連続再生を防ぐ
  if (isGlobalPlaying) return;
  
  const ctx = getAudioContext();
  if (!ctx) return;

  const sounds = SOUND_CONFIG[type];
  if (!sounds) return;

  isGlobalPlaying = true;

  let currentTime = ctx.currentTime;
  
  for (const sound of sounds) {
    playTone(ctx, sound.frequency, sound.duration, sound.type, sound.volume, currentTime);
    currentTime += sound.duration * 0.8;
  }

  const totalDuration = sounds.reduce((sum, s) => sum + s.duration, 0);
  setTimeout(() => {
    isGlobalPlaying = false;
  }, totalDuration * 1000);
}

/**
 * サウンド再生カスタムフック
 */
export function useSound() {
  const isPlayingRef = useRef(false);

  const playSound = useCallback((type: SoundType) => {
    // 連続再生を防ぐ
    if (isPlayingRef.current) return;
    
    const ctx = getAudioContext();
    if (!ctx) return;

    const sounds = SOUND_CONFIG[type];
    if (!sounds) return;

    isPlayingRef.current = true;

    let currentTime = ctx.currentTime;
    
    for (const sound of sounds) {
      playTone(ctx, sound.frequency, sound.duration, sound.type, sound.volume, currentTime);
      currentTime += sound.duration * 0.8; // 少しオーバーラップさせてなめらかに
    }

    // 再生完了後にフラグをリセット
    const totalDuration = sounds.reduce((sum, s) => sum + s.duration, 0);
    setTimeout(() => {
      isPlayingRef.current = false;
    }, totalDuration * 1000);
  }, []);

  return { playSound };
}

export default useSound;
