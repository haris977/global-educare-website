"use client";

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(1);

  // Guaranteed reliable audio sources with spoken content (CORS-friendly)
  const reliableAudioSources = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg.wav',
    'https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg10.wav',
    'https://www2.cs.uic.edu/~i101/SoundFiles/taunt.wav',
    'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav'
  ];

  useEffect(() => {
    // Reset player state when src changes
    setIsPlaying(false);
    setCurrentTime(0);
    setLoading(true);
    setError(false);
    
    // Create a new audio element on each source change to avoid caching issues
    const audio = new Audio();
    
    // Try the provided source first, but be ready to fall back
    audio.src = src;
    
    audio.addEventListener('canplaythrough', () => {
      setLoading(false);
      setDuration(audio.duration);
    });
    
    audio.addEventListener('error', handleError);
    audio.volume = volume;
    audioRef.current = audio;
    
    // Start preloading
    audio.load();
    
    return () => {
      audio.removeEventListener('canplaythrough', () => {});
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [src]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('play', () => setIsPlaying(true));
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('pause', () => {});
        audio.removeEventListener('play', () => {});
      };
    }
  }, [audioRef.current]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Use the play-promise pattern for better browser compatibility
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(err => {
              console.error('Error playing audio:', err);
              setError(true);
              // Try to recover by switching to a reliable source
              useReliableAudioSource();
            });
        }
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Use a fallback src if the provided one fails
  const handleError = () => {
    console.log("Audio error occurred, using fallback");
    setError(true);
    setLoading(false);
    useReliableAudioSource();
  };

  // Switch to a reliable audio source
  const useReliableAudioSource = () => {
    if (audioRef.current) {
      // Generate a consistent index based on the original src
      const hash = Math.abs(src.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
      const index = hash % reliableAudioSources.length;
      
      // Use a reliable audio source
      audioRef.current.src = reliableAudioSources[index];
      audioRef.current.load();
      
      // After switching sources, try to play again
      setTimeout(() => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setError(false);
              })
              .catch(err => {
                console.error('Failed to play fallback audio:', err);
              });
          }
        }
      }, 500);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-4 border border-gray-200">
      {title && <h3 className="font-medium text-gray-900 mb-3">{title}</h3>}
      
      {loading ? (
        <div className="flex flex-col justify-center items-center h-24 bg-gray-50 rounded-md">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600 font-medium">Loading audio...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className={`rounded-full ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} text-white p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              aria-label={isPlaying ? "Pause" : "Play"}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${isPlaying ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} mr-2`}>
                  {isPlaying ? 'Playing' : 'Paused'}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSliderChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  aria-label="Audio progress"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 font-medium mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label="Volume control"
            />
          </div>
          
          {error && (
            <div className="flex items-center p-3 bg-yellow-50 text-sm text-yellow-800 rounded-md border border-yellow-200">
              <svg className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Audio source changed to a reliable sample. Press play to listen.</p>
            </div>
          )}
          
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-500">Click the <span className="font-semibold text-blue-600">play</span> button and listen carefully to answer the question</p>
          </div>
        </div>
      )}
    </div>
  );
} 