import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { DialogueLine, DifficultyLevel } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize GenAI client
const ai = new GoogleGenAI({ apiKey: API_KEY });

const dialogueSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      speaker: {
        type: Type.STRING,
        enum: ['Speaker A', 'Speaker B'],
        description: "The speaker identifier."
      },
      text: {
        type: Type.STRING,
        description: "The spoken line of text."
      }
    },
    required: ['speaker', 'text'],
    propertyOrdering: ['speaker', 'text']
  }
};

const getLengthInstruction = (level: DifficultyLevel): string => {
  if (level.includes('A2')) return "Keep it short and simple. Between 4 to 6 exchanges total.";
  if (level.includes('B1') || level.includes('B2')) return "Moderate length. Between 8 to 12 exchanges total.";
  if (level.includes('C1') || level.includes('C2')) return "In-depth discussion. Between 12 to 16 exchanges total.";
  return "Between 6 to 10 exchanges.";
};

export const generateDialogueText = async (
  topic: string,
  level: DifficultyLevel,
  grammar?: string,
  vocabulary?: string
): Promise<DialogueLine[]> => {
  if (!API_KEY) throw new Error("API Key is missing");

  const lengthInstruction = getLengthInstruction(level);

  const prompt = `
    Create a realistic conversation dialogue in English between two people (Speaker A and Speaker B).
    
    Context/Topic: ${topic}
    English CEFR Level: ${level}
    ${grammar ? `Target Grammar Structures (MUST INCLUDE): ${grammar}` : ''}
    ${vocabulary ? `Target Vocabulary (MUST INCLUDE): ${vocabulary}` : ''}
    
    Instructions:
    1. ${lengthInstruction}
    2. Ensure the vocabulary and grammar strictly match the requested CEFR level (${level}).
    3. If target grammar or vocabulary was provided, try to incorporate it naturally into the conversation.
    4. Make it natural and educational for students.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: dialogueSchema,
        temperature: 0.7,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No content generated");

    const parsedData = JSON.parse(jsonText);
    return parsedData as DialogueLine[];
  } catch (error) {
    console.error("Text Generation Error:", error);
    throw error;
  }
};

export const generateDialogueAudio = async (
  lines: DialogueLine[], 
  voiceA: string = 'Kore', 
  voiceB: string = 'Fenrir'
): Promise<string> => {
  if (!API_KEY) throw new Error("API Key is missing");

  // Format the script for the TTS model
  // The model works best when lines are prefixed with speaker names for multi-speaker config
  const script = lines.map(line => `${line.speaker}: ${line.text}`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: script }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Speaker A',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voiceA } 
                }
              },
              {
                speaker: 'Speaker B',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voiceB } 
                }
              }
            ]
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data returned");
    }

    return base64Audio;
  } catch (error) {
    console.error("Audio Generation Error:", error);
    throw error;
  }
};