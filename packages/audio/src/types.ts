export interface PitchBendOptions {
  start: number;
  end: number;
  time?: number;
}

export interface FilterSweepOptions {
  start: number;
  end: number;
  time?: number;
}

export interface FilterOptions {
  type: BiquadFilterType;
  frequency: number;
  q: number;
  sweep?: FilterSweepOptions;
}

export interface OscillatorConfig {
  type?: OscillatorType;
  frequencyOffset?: number;
  gain?: number;
}

export interface SoundOptions {
  frequency: number;
  type?: OscillatorType;
  duration: number;
  gain: number;
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  detune?: number;
  pitchBend?: PitchBendOptions;
  filter?: FilterOptions;
  oscillators?: OscillatorConfig[];
}

export interface SoundSource {
  oscillator: OscillatorNode;
  oscGain: GainNode;
}

export type SoundFunction = () => void;

export interface SoundsCollection {
  [key: string]: SoundFunction;
}
