import { EnvelopeSpec } from "./types";

export const createEnvelope = (
  attack: number = 0.01,
  decay: number = 0.1,
  sustain: number = 0.5,
  release: number = 0.1,
  gain: number = 1,
): EnvelopeSpec => ({
  attack,
  decay,
  sustain,
  release,
  gain,
});

export const createPercussiveEnv = (gain: number = 1): EnvelopeSpec =>
  createEnvelope(0.001, 0.1, 0, 0.05, gain);

export const createPluckedEnv = (gain: number = 1): EnvelopeSpec =>
  createEnvelope(0.002, 0.3, 0.1, 0.2, gain);

export const createPadEnv = (gain: number = 1): EnvelopeSpec =>
  createEnvelope(0.5, 0.2, 0.7, 1.0, gain);

export const createOrganEnv = (gain: number = 1): EnvelopeSpec =>
  createEnvelope(0.01, 0.01, 1.0, 0.01, gain);

export const createBellEnv = (gain: number = 1): EnvelopeSpec =>
  createEnvelope(0.01, 0.8, 0.2, 0.5, gain);
