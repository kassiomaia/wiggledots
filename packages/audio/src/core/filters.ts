import {
  FilterSpec,
  FilterSweepSpec,
  FilterType,
  PitchBendSpec,
} from "./types";

export const createFilter = (
  type: FilterType = "lowpass",
  frequency: number = 1000,
  options: Partial<FilterSpec> = {},
): FilterSpec => ({
  type,
  frequency,
  q: options.q || 1,
  gain: options.gain || 0,
});

export const createLowpass = (frequency: number, q: number = 1): FilterSpec =>
  createFilter("lowpass", frequency, { q });

export const createHighpass = (frequency: number, q: number = 1): FilterSpec =>
  createFilter("highpass", frequency, { q });

export const createBandpass = (frequency: number, q: number = 1): FilterSpec =>
  createFilter("bandpass", frequency, { q });

export const createNotch = (frequency: number, q: number = 1): FilterSpec =>
  createFilter("notch", frequency, { q });

export const createLowShelf = (
  frequency: number,
  gain: number = 0,
): FilterSpec => createFilter("lowshelf", frequency, { gain });

export const createHighShelf = (
  frequency: number,
  gain: number = 0,
): FilterSpec => createFilter("highshelf", frequency, { gain });

export const createPeaking = (
  frequency: number,
  q: number = 1,
  gain: number = 0,
): FilterSpec => createFilter("peaking", frequency, { q, gain });

// Pitch bend creation
export const createPitchBend = (
  start: number,
  end: number,
  time: number,
): PitchBendSpec => ({ start, end, time });

export const createBendUp = (
  baseFreq: number,
  semitones: number,
  time: number,
): PitchBendSpec =>
  createPitchBend(baseFreq, baseFreq * Math.pow(2, semitones / 12), time);

export const createBendDown = (
  baseFreq: number,
  semitones: number,
  time: number,
): PitchBendSpec =>
  createPitchBend(baseFreq, baseFreq * Math.pow(2, -semitones / 12), time);

export const createVibrato = (
  baseFreq: number,
  depth: number,
  time: number,
): PitchBendSpec => createPitchBend(baseFreq - depth, baseFreq + depth, time);

// Filter sweep creation
export const createFilterSweep = (
  start: number,
  end: number,
  time: number,
): FilterSweepSpec => ({ start, end, time });

export const createSweepUp = (
  startFreq: number,
  endFreq: number,
  time: number,
): FilterSweepSpec => createFilterSweep(startFreq, endFreq, time);

export const createSweepDown = (
  startFreq: number,
  endFreq: number,
  time: number,
): FilterSweepSpec => createFilterSweep(startFreq, endFreq, time);
