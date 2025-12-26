import React, { useState, useEffect } from 'react';
import { Controls } from './components/Controls';
import { DialogueView } from './components/DialogueView';
import { Logo } from './components/Logo';
import { DialogueLine, DifficultyLevel, VoiceName } from './types';
import { generateDialogueText, generateDialogueAudio } from './services/geminiService';
import { pcmToWavBlobUrl } from './utils/audioUtils';

export default function App() {
  const [topic, setTopic] = useState('');
  const [grammar, setGrammar] = useState('');
  const [vocabulary, setVocabulary] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.B1);
  const [voiceA, setVoiceA] = useState<VoiceName>('Kore');
  const [voiceB, setVoiceB] = useState<VoiceName>('Fenrir');
  
  const [dialogueLines, setDialogueLines] = useState<DialogueLine[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleGenerateDialogue = async () => {
    setIsGeneratingText(true);
    setError(null);
    setAudioUrl(null); // Reset audio when generating new text
    setDialogueLines([]);
    
    try {
      const lines = await generateDialogueText(topic, difficulty, grammar, vocabulary);
      setDialogueLines(lines);
    } catch (err: any) {
      setError(err.message || "Error al generar el diálogo. Por favor intenta de nuevo.");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (dialogueLines.length === 0) return;
    
    setIsGeneratingAudio(true);
    setError(null);
    
    try {
      const base64Audio = await generateDialogueAudio(dialogueLines, voiceA, voiceB);
      const url = pcmToWavBlobUrl(base64Audio);
      setAudioUrl(url);
    } catch (err: any) {
      setError(err.message || "Error al generar el audio. Por favor intenta de nuevo.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-12 transition-colors duration-300">
      {/* Header - Professional Dark Theme */}
      <header className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10 drop-shadow-md" />
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight leading-tight">Listening2Go</h1>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block uppercase tracking-wider">Teacher's AI Suite</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <button 
                onClick={toggleDarkMode}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
                aria-label="Toggle Dark Mode"
             >
               {darkMode ? (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
               ) : (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                 </svg>
               )}
             </button>
             <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">v1.1.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <Controls
              topic={topic}
              setTopic={setTopic}
              grammar={grammar}
              setGrammar={setGrammar}
              vocabulary={vocabulary}
              setVocabulary={setVocabulary}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              voiceA={voiceA}
              setVoiceA={setVoiceA}
              voiceB={voiceB}
              setVoiceB={setVoiceB}
              onGenerate={handleGenerateDialogue}
              isGenerating={isGeneratingText}
            />
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Guía de Uso</h4>
              </div>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3 list-disc list-inside marker:text-blue-500">
                <li><span className="font-medium text-slate-700 dark:text-slate-300">Tema:</span> Contexto claro.</li>
                <li><span className="font-medium text-slate-700 dark:text-slate-300">Nivel:</span> Define vocabulario y <span className="italic">longitud</span>.</li>
                <li><span className="font-medium text-slate-700 dark:text-slate-300">Voces:</span> Tonos contrastantes.</li>
                <li><span className="font-medium text-slate-700 dark:text-slate-300">Práctica:</span> Genera audio final.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8">
            {dialogueLines.length > 0 ? (
              <DialogueView
                lines={dialogueLines}
                onGenerateAudio={handleGenerateAudio}
                isGeneratingAudio={isGeneratingAudio}
                audioUrl={audioUrl}
              />
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 h-[32rem] flex flex-col items-center justify-center text-center p-8 transition-colors">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
                  <Logo className="w-12 h-12 opacity-50 grayscale" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Área de Trabajo</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Configura los parámetros en el panel izquierdo para generar un nuevo recurso didáctico.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}