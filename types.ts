export enum DifficultyLevel {
  A2 = 'A2 - Elementary',
  B1 = 'B1 - Intermediate',
  B2 = 'B2 - Upper Intermediate',
  C1 = 'C1 - Advanced',
  C2 = 'C2 - Proficiency',
}

export interface DialogueLine {
  speaker: 'Speaker A' | 'Speaker B';
  text: string;
}

export interface GeneratedDialogue {
  topic: string;
  level: DifficultyLevel;
  lines: DialogueLine[];
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  hasAudio: boolean;
  error: string | null;
}

export const AVAILABLE_VOICES = [
  { name: 'Puck', label: 'Puck (Masculino - Suave)' },
  { name: 'Charon', label: 'Charon (Masculino - Profundo)' },
  { name: 'Kore', label: 'Kore (Femenino - Calma)' },
  { name: 'Fenrir', label: 'Fenrir (Masculino - Intenso)' },
  { name: 'Zephyr', label: 'Zephyr (Femenino - Brillante)' },
] as const;

export type VoiceName = typeof AVAILABLE_VOICES[number]['name'];