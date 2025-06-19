export type OscillatorType = "sine" | "square" | "sawtooth" | "triangle";
export type FilterType =
  | "lowpass"
  | "highpass"
  | "bandpass"
  | "lowshelf"
  | "highshelf"
  | "peaking"
  | "notch"
  | "allpass";

export interface OscillatorSpec {
  type: OscillatorType;
  frequency: number;
  detune?: number;
  gain?: number;
  frequencyOffset?: number;
}

export interface EnvelopeSpec {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  gain: number;
}

export interface FilterSpec {
  type: FilterType;
  frequency: number;
  q?: number;
  gain?: number; // For shelving and peaking filters
}

export interface PitchBendSpec {
  start: number;
  end: number;
  time: number;
}

export interface FilterSweepSpec {
  start: number;
  end: number;
  time: number;
}

// Note types
export type NoteName =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Note = `${NoteName}${Octave}`;
