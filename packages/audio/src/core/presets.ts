import { createBendDown } from "./effects";
import {
  createBellEnv,
  createPadEnv,
  createPercussiveEnv,
  createPluckedEnv,
} from "./envelope";
import { createLowpass } from "./filters";
import {
  createDetuned,
  createHarmonics,
  createSawOsc,
  createSineOsc,
  createSquareOsc,
} from "./oscillators";
import {
  EnvelopeSpec,
  FilterSpec,
  OscillatorSpec,
  PitchBendSpec,
} from "./types";

export const createSimpleSynth = (frequency: number): {
  oscillators: OscillatorSpec[];
  envelope: EnvelopeSpec;
  filter: FilterSpec;
} => ({
  oscillators: [createSawOsc(frequency)],
  envelope: createPluckedEnv(0.8),
  filter: createLowpass(2000, 2),
});

export const createRichPad = (frequency: number): {
  oscillators: OscillatorSpec[];
  envelope: EnvelopeSpec;
  filter: FilterSpec;
} => ({
  oscillators: createDetuned(createSawOsc(frequency, { gain: 0.4 }), 5),
  envelope: createPadEnv(0.6),
  filter: createLowpass(1500, 1),
});

export const createBell = (frequency: number): {
  oscillators: OscillatorSpec[];
  envelope: EnvelopeSpec;
  filter: FilterSpec;
  pitchBend: PitchBendSpec;
} => ({
  oscillators: createHarmonics(createSineOsc(frequency), [2, 3, 4]),
  envelope: createBellEnv(0.5),
  filter: createLowpass(4000, 0.5),
  pitchBend: createBendDown(frequency, 2, 0.1),
});

export const createBass = (frequency: number): {
  oscillators: OscillatorSpec[];
  envelope: EnvelopeSpec;
  filter: FilterSpec;
} => ({
  oscillators: [
    createSawOsc(frequency, { gain: 0.7 }),
    createSquareOsc(frequency * 0.5, { gain: 0.3 }),
  ],
  envelope: createPercussiveEnv(1.0),
  filter: createLowpass(800, 3),
});
