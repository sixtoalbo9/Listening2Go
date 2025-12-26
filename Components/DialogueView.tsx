import React, { useRef, useEffect, useState } from 'react';
import { DialogueLine } from '../types';
import { Button } from './Button';

interface DialogueViewProps {
  lines: DialogueLine[];
  onGenerateAudio: () => void;
  isGeneratingAudio: boolean;
  audioUrl: string | null;
}

const formatTime = (seconds: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const DialogueView: React.FC<DialogueViewProps> = ({
  lines,
  onGenerateAudio,
  isGeneratingAudio,
  audioUrl
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Reset state when audioUrl changes
  useEffect(() => {
    if (audioUrl) {
      setIsPlaying(true);
      setCurrentTime(0);
      setPlaybackRate(1.0);
      if (audioRef.current) {
        audioRef.current.volume = volume;
        audioRef.current.playbackRate = 1.0;
        audioRef.current.play().catch(e => {
          console.log("Auto-play prevented", e);
          setIsPlaying(false);
        });
      }
    }
  }, [audioUrl]);

  // Handle audio events
  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsPlaying(true); 
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const onEnded = () => setIsPlaying(false);

  // Controls logic
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  if (lines.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transition-colors">
      
      {/* Audio Player Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 dark:text-white">Resultado Generado</h3>
          {audioUrl && <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded border border-green-100 dark:border-green-800">Audio Listo</span>}
        </div>

        {audioUrl ? (
          <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-600 p-4 shadow-sm">
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              onEnded={onEnded}
              className="hidden"
            />
            
            {/* Top Row: Play/Pause and Progress */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={togglePlay}
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                ) : (
                  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>

              <div className="flex-grow">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
                />
              </div>
            </div>

            {/* Bottom Row: Secondary Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
              
              <div className="flex items-center gap-6">
                {/* Speed Control */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-md p-1">
                  {[0.75, 1, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                        playbackRate === rate
                          ? 'bg-white dark:bg-slate-600 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 group">
                  <button onClick={toggleMute} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {isMuted || volume === 0 ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600 opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Download Button */}
              <a
                href={audioUrl}
                download="dialogue.wav"
                className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Descargar audio"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar
              </a>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
             <Button 
              variant="secondary" 
              onClick={onGenerateAudio} 
              isLoading={isGeneratingAudio}
              className="text-sm py-2 px-8 shadow-sm border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40"
            >
              <span className="mr-2 text-lg">🎧</span> Generar Audio
            </Button>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6 bg-white dark:bg-slate-800 min-h-[400px] max-h-[600px] overflow-y-auto">
        {lines.map((line, index) => {
          const isSpeakerA = line.speaker === 'Speaker A';
          return (
            <div 
              key={index} 
              className={`flex w-full ${isSpeakerA ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[85%] flex gap-3 ${isSpeakerA ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1
                    ${isSpeakerA 
                      ? 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200' 
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    }
                  `}>
                  {isSpeakerA ? 'A' : 'B'}
                </div>
                
                <div 
                  className={`
                    p-4 shadow-sm relative text-sm leading-relaxed border
                    ${isSpeakerA 
                      ? 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-none border-slate-200 dark:border-slate-600' 
                      : 'bg-blue-600 dark:bg-blue-700 text-white rounded-2xl rounded-tr-none border-blue-600 dark:border-blue-700'
                    }
                  `}
                >
                  <p>{line.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};