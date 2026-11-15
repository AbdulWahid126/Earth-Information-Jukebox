/**
 * Musical Scale Definitions & Quantization Helpers
 * Earth Information Jukebox — Phase 5
 */

import { MusicalScaleDefinition, MusicalScaleId } from '@/types/sonification';

export const MUSICAL_SCALES: Record<MusicalScaleId, MusicalScaleDefinition> = {
  pentatonic_major: {
    id: 'pentatonic_major',
    name: 'Major Pentatonic (Planetary Consonance)',
    description: 'Bright, harmonious, and open. Eliminates half-step dissonance for a serene, uplifting auditory experience.',
    notes: [
      'C3', 'D3', 'E3', 'G3', 'A3',
      'C4', 'D4', 'E4', 'G4', 'A4',
      'C5', 'D5', 'E5', 'G5', 'A5',
      'C6'
    ],
  },
  pentatonic_minor: {
    id: 'pentatonic_minor',
    name: 'Minor Pentatonic (Atmospheric Contemplation)',
    description: 'Reflective, moody, and cinematic. Evokes deep oceanic depths and cooler planetary expanses.',
    notes: [
      'A2', 'C3', 'D3', 'E3', 'G3',
      'A3', 'C4', 'D4', 'E4', 'G4',
      'A4', 'C5', 'D5', 'E5', 'G5',
      'A5'
    ],
  },
  dorian: {
    id: 'dorian',
    name: 'Dorian Mode (Mission Control)',
    description: 'Classic aerospace and sci-fi modal sound with a natural 6th. Serious, focused, and forward-looking.',
    notes: [
      'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
      'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
      'C5', 'D5'
    ],
  },
  lydian: {
    id: 'lydian',
    name: 'Lydian Mode (Orbital Expanse)',
    description: 'Ethereal and expansive with a raised 4th. Suggests looking down on Earth from orbital vantage points.',
    notes: [
      'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4',
      'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5',
      'F5'
    ],
  },
  natural_minor: {
    id: 'natural_minor',
    name: 'Aeolian / Natural Minor (Deep Biosphere)',
    description: 'Rich, solemn, and expressive classical minor scale spanning three full octaves.',
    notes: [
      'C3', 'D3', 'Eb3', 'F3', 'G3', 'Ab3', 'Bb3',
      'C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4',
      'C5'
    ],
  },
};

/**
 * Standard note-to-frequency lookup (A4 = 440 Hz)
 */
const NOTE_OFFSETS: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1,
  D: 2, 'D#': 3, Eb: 3,
  E: 4,
  F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8,
  A: 9, 'A#': 10, Bb: 10,
  B: 11,
};

export function noteToFrequency(note: string): number {
  const match = /^([A-G][b#]?)([0-8])$/.exec(note);
  if (!match) return 440;
  const pitch = match[1];
  const octave = parseInt(match[2], 10);
  const semitone = NOTE_OFFSETS[pitch] ?? 0;
  // MIDI note: C-1 is 0, C4 is 60, A4 is 69
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Quantize a continuous normalized value [0.0, 1.0] to a discrete note in the scale.
 */
export function quantizeValueToScale(normalizedVal: number, scaleNotes: readonly string[]): string {
  if (scaleNotes.length === 0) return 'C4';
  const clamped = Math.max(0, Math.min(1, normalizedVal));
  const index = Math.min(scaleNotes.length - 1, Math.floor(clamped * scaleNotes.length));
  return scaleNotes[index];
}
