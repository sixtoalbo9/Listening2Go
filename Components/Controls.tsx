import React from 'react';
import { DifficultyLevel, AVAILABLE_VOICES, VoiceName } from '../types';
import { Button } from './Button';

interface ControlsProps {
  topic: string;
  setTopic: (t: string) => void;
  grammar: string;
  setGrammar: (g: string) => void;
  vocabulary: string;
  setVocabulary: (v: string) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (l: DifficultyLevel) => void;
  voiceA: VoiceName;
  setVoiceA: (v: VoiceName) => void;
  voiceB: VoiceName;
  setVoiceB: (v: VoiceName) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const LEVEL_GUIDES: Record<DifficultyLevel, { grammar: string; vocabulary: string }> = {
  [DifficultyLevel.A2]: {
    grammar: "Past Simple, Present Continuous (future), Comparatives, 'Going to', Adverbs of frequency",
    vocabulary: "Daily routines, family, shopping, weather, transport, hobbies"
  },
  [DifficultyLevel.B1]: {
    grammar: "Present Perfect, First/Second Conditional, Passive Voice (simple), Used to, Relative clauses",
    vocabulary: "Travel, health, feelings, education, work, entertainment"
  },
  [DifficultyLevel.B2]: {
    grammar: "Third Conditional, Future Continuous, Reported Speech, Modals of Deduction, Passive with modals",
    vocabulary: "Environment, technology, social issues, media, personality traits, crime"
  },
  [DifficultyLevel.C1]: {
    grammar: "Inversion, Mixed Conditionals, Cleft Sentences, Participle Clauses, Wishes/Regrets",
    vocabulary: "Idioms, phrasal verbs, abstract nouns, academic vocabulary, nuance"
  },
  [DifficultyLevel.C2]: {
    grammar: "Subjunctive, Stylistic Inversion, Discourse Markers, Hedging, Fronting",
    vocabulary: "Nuanced collocations, register-specific lexis, sophisticated idioms, archaic forms"
  }
};

export const Controls: React.FC<ControlsProps> = ({
  topic,
  setTopic,
  grammar,
  setGrammar,
  vocabulary,
  setVocabulary,
  difficulty,
  setDifficulty,
  voiceA,
  setVoiceA,
  voiceB,
  setVoiceB,
  onGenerate,
  isGenerating
}) => {
  const currentGuide = LEVEL_GUIDES[difficulty];

  const labelClasses = "block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5";
  const inputClasses = "block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border transition-colors bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100";

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-5">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Configuración</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Define los parámetros del diálogo.</p>
      </div>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="topic" className={labelClasses}>
            Tema / Situación
          </label>
          <textarea
            id="topic"
            className={`${inputClasses} h-24 resize-none`}
            placeholder="Ej: Dos colegas discutiendo sobre una nueva estrategia de marketing..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="difficulty" className={labelClasses}>
            Nivel CEFR
          </label>
          <select
            id="difficulty"
            className={inputClasses}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
          >
            {Object.values(DifficultyLevel).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="voiceA" className={labelClasses}>
              Speaker A
            </label>
            <select
              id="voiceA"
              className={inputClasses}
              value={voiceA}
              onChange={(e) => setVoiceA(e.target.value as VoiceName)}
            >
              {AVAILABLE_VOICES.map((v) => (
                <option key={v.name} value={v.name}>{v.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="voiceB" className={labelClasses}>
              Speaker B
            </label>
            <select
              id="voiceB"
              className={inputClasses}
              value={voiceB}
              onChange={(e) => setVoiceB(e.target.value as VoiceName)}
            >
              {AVAILABLE_VOICES.map((v) => (
                <option key={v.name} value={v.name}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
          <div className="mb-4">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Contenido Pedagógico</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="grammar" className={labelClasses}>
                Gramática Objetivo
              </label>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded border border-slate-100 dark:border-slate-600">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Sugerencia {difficulty.split(' - ')[0]}:</span> {currentGuide.grammar}
              </div>
              <input
                type="text"
                id="grammar"
                className={inputClasses}
                placeholder="Estructuras específicas..."
                value={grammar}
                onChange={(e) => setGrammar(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="vocabulary" className={labelClasses}>
                Vocabulario Clave
              </label>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded border border-slate-100 dark:border-slate-600">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Sugerencia {difficulty.split(' - ')[0]}:</span> {currentGuide.vocabulary}
              </div>
              <input
                type="text"
                id="vocabulary"
                className={inputClasses}
                placeholder="Palabras clave..."
                value={vocabulary}
                onChange={(e) => setVocabulary(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            onClick={onGenerate} 
            isLoading={isGenerating} 
            disabled={!topic.trim()}
            className="w-full shadow-md"
          >
            Generar Diálogo
          </Button>
        </div>
      </div>
    </div>
  );
};