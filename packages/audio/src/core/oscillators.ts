import { OscillatorSpec, OscillatorType } from "./types";

export const createOscillator = (
  type: OscillatorType = "sine",
  frequency: number = 440,
  options: Partial<OscillatorSpec> = {},
): OscillatorSpec => ({
  type,
  frequency,
  detune: options.detune || 0,
  gain: options.gain || 1,
  frequencyOffset: options.frequencyOffset || 0,
});

export const createSineOsc = (
  frequency: number,
  options?: Partial<OscillatorSpec>,
) => createOscillator("sine", frequency, options);

export const createSquareOsc = (
  frequency: number,
  options?: Partial<OscillatorSpec>,
) => createOscillator("square", frequency, options);

export const createSawOsc = (
  frequency: number,
  options?: Partial<OscillatorSpec>,
) => createOscillator("sawtooth", frequency, options);

export const createTriangleOsc = (
  frequency: number,
  options?: Partial<OscillatorSpec>,
) => createOscillator("triangle", frequency, options);

// Multi-oscillator creation
export const createOscillatorBank = (
  ...oscillators: OscillatorSpec[]
): OscillatorSpec[] => oscillators;

export const createDetuned = (
  baseOsc: OscillatorSpec,
  detuneAmount: number,
): OscillatorSpec[] => [
  baseOsc,
  { ...baseOsc, detune: (baseOsc.detune || 0) + detuneAmount },
  { ...baseOsc, detune: (baseOsc.detune || 0) - detuneAmount },
];

export const createHarmonics = (
  fundamental: OscillatorSpec,
  harmonics: number[],
): OscillatorSpec[] => [
  fundamental,
  ...harmonics.map((harmonic) => ({
    ...fundamental,
    frequency: fundamental.frequency * harmonic,
    gain: (fundamental.gain || 1) / harmonic, // Diminishing amplitude
  })),
];

// Component combination utilities
export const combineOscillators = (
  ...banks: OscillatorSpec[][]
): OscillatorSpec[] => banks.flat();

export const scaleOscillatorGains = (
  oscillators: OscillatorSpec[],
  scale: number,
): OscillatorSpec[] =>
  oscillators.map((osc) => ({ ...osc, gain: (osc.gain || 1) * scale }));

export const transposeOscillators = (
  oscillators: OscillatorSpec[],
  semitones: number,
): OscillatorSpec[] =>
  oscillators.map((osc) => ({
    ...osc,
    frequency: osc.frequency * Math.pow(2, semitones / 12),
  }));
