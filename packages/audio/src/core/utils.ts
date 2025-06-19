import { Note, NoteName } from "./types";

export const convertNoteToFrequency = (note: Note): number => {
  const noteMap: Record<NoteName, number> = {
    "C": 0,
    "C#": 1,
    "Db": 1,
    "D": 2,
    "D#": 3,
    "Eb": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "Gb": 6,
    "G": 7,
    "G#": 8,
    "Ab": 8,
    "A": 9,
    "A#": 10,
    "Bb": 10,
    "B": 11,
  };

  const octave = parseInt(note.slice(-1));
  const noteName = note.slice(0, -1) as NoteName;
  const semitone = noteMap[noteName];

  return 440 * Math.pow(2, (octave - 4) + (semitone - 9) / 12);
};

export const convertFrequencyToMIDI = (frequency: number): number =>
  12 * Math.log2(frequency / 440) + 69;

export const convertMIDIToFrequency = (midiNote: number): number =>
  440 * Math.pow(2, (midiNote - 69) / 12);
