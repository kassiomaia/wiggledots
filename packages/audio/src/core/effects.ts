import { FilterSweepSpec, PitchBendSpec } from "./types";

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
