"use client";

import { useState, useRef, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';

interface ListeningAudioPlayerProps {
  src: string;
  fallbackSrc?: string;
  title?: string;
  onProgressUpdate?: (progress: number) => void;
  onComplete?: () => void;
  maxPlays?: number;
  autoPlay?: boolean;
}

export default function ListeningAudioPlayer({
  src,
  fallbackSrc,
  title,
  onProgressUpdate,
  onComplete,
  maxPlays = 1,
  autoPlay = false
}: ListeningAudioPlayerProps) {
  const [playCount, setPlayCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasPlayed, setHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset state when src changes
  useEffect(() => {
    setPlayCount(0);
    setIsCompleted(false);
    setIsPlaying(false);
    setCurrentSrc(src);
    setHasPlayed(false);
  }, [src]);

  // Only increment play count when playback actually starts
  const handlePlay = () => {
    if (!hasPlayed && playCount < maxPlays) {
      setPlayCount(prev => prev + 1);
      setHasPlayed(true);
    }
    setIsPlaying(true);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasPlayed(false);
    if (playCount >= maxPlays) {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    const progress = (currentTime / duration) * 100;
    onProgressUpdate?.(progress);
  };

  const handleError = () => {
    if (fallbackSrc && currentSrc === src) {
      console.log('Switching to fallback audio source');
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <div className="space-y-4">
      <AudioPlayer
        src={currentSrc}
        title={title}
        autoPlay={autoPlay}
        onPlay={handlePlay}
        onEnded={handleEnded}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        disabled={playCount >= maxPlays && !isPlaying}
      />
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Plays remaining: {Math.max(0, maxPlays - playCount)}
        </span>
        {isCompleted && (
          <span className="text-green-600 font-medium">
            Audio completed
          </span>
        )}
      </div>
    </div>
  );
} 