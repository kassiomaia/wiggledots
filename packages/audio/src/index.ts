import {
  createEnvelope,
  createFilter,
  createFilterSweep,
  createPitchBend,
  createSawOsc,
  createSineOsc,
  createSquareOsc,
  createTriangleOsc,
  EnvelopeSpec,
  FilterSpec,
  FilterSweepSpec,
  OscillatorSpec,
  PitchBendSpec,
} from "./core";

// Legacy types for compatibility
export interface SoundOptions {
  frequency: number;
  type?: "sine" | "square" | "sawtooth" | "triangle";
  duration?: number;
  gain?: number;
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  detune?: number;
  pitchBend?: { start: number; end: number; time: number };
  filter?: {
    type: "lowpass" | "highpass" | "bandpass" | "notch";
    frequency: number;
    q?: number;
    sweep?: { start: number; end: number; time: number };
  };
  oscillators?: Array<{
    type: "sine" | "square" | "sawtooth" | "triangle";
    frequencyOffset: number;
    gain: number;
  }>;
}

export interface SoundSource {
  oscillator: OscillatorNode;
  oscGain: GainNode;
}

export type SoundName =
  | "hover"
  | "click"
  | "spawn"
  | "death"
  | "victory"
  | string;
export type SoundFunction = () => void;
export type SoundsCollection = Record<SoundName, SoundFunction>;

// Sound definitions using the new API
const createSoundDefinitions = () => ({
  hover: {
    oscillators: [createSineOsc(1000)],
    envelope: createEnvelope(0.01, 0.08, 0.5, 0.06, 0.1),
    duration: 0.15,
    pitchBend: createPitchBend(800, 1200, 0.05),
  },

  click: {
    oscillators: [createSquareOsc(700, { detune: 50 })],
    envelope: createEnvelope(0.005, 0.05, 0, 0.04, 0.15),
    duration: 0.1,
  },

  spawn: {
    oscillators: [
      createTriangleOsc(400),
      createSineOsc(500, { gain: 0.5 }),
    ],
    envelope: createEnvelope(0.1, 0.2, 0.5, 0.2, 0.1),
    duration: 0.5,
    pitchBend: createPitchBend(300, 800, 0.3),
    filter: createFilter("lowpass", 2000, { q: 1 }),
    filterSweep: createFilterSweep(500, 4000, 0.4),
  },

  death: {
    oscillators: [createSawOsc(600)],
    envelope: createEnvelope(0.01, 0.15, 0.3, 0.2, 0.12),
    duration: 0.4,
    pitchBend: createPitchBend(700, 200, 0.2),
    filter: createFilter("lowpass", 1000, { q: 2 }),
    filterSweep: createFilterSweep(2000, 300, 0.3),
  },

  victory: {
    oscillators: [
      createSawOsc(830.61 / 2, { gain: 0.8 }),
      createSawOsc(440, { gain: 0.8 }),
      createSawOsc(554.37, { gain: 0.8 }),
      createSawOsc(830.61, { gain: 0.8 }),
      createSawOsc(880, { gain: 0.8 }),
      createSawOsc(880 + 440, { gain: 0.8 }),

      createTriangleOsc(830.61 * 2, { gain: 0.8 }),
      createTriangleOsc(880 + 880 + 440, { gain: 0.8 }),
    ],
    envelope: createEnvelope(0.1, 0.5, 0.05, 0.5, 0.9),
    duration: 0.8,
    pitchBend: createPitchBend(830.61, 880, 0.1),
    filter: createFilter("lowpass", 1440, { q: 5 }),
    filterSweep: createFilterSweep(100, 1000, 0.9),
  },
});

const applyRetroTheme = (soundDef: any) => ({
  ...soundDef,
  oscillators: soundDef.oscillators.map((osc: OscillatorSpec) =>
    createSquareOsc(osc.frequency * 0.8, { gain: osc.gain })
  ),
});

const applySoftTheme = (soundDef: any) => ({
  ...soundDef,
  envelope: createEnvelope(
    soundDef.envelope.attack,
    soundDef.envelope.decay,
    soundDef.envelope.sustain,
    soundDef.envelope.release,
    soundDef.envelope.gain * 0.5,
  ),
});

export const SoundThemes = {
  DEFAULT: createSoundDefinitions(),
  RETRO: Object.fromEntries(
    Object.entries(createSoundDefinitions()).map((
      [name, def],
    ) => [name, applyRetroTheme(def)]),
  ),
  SOFT: Object.fromEntries(
    Object.entries(createSoundDefinitions()).map((
      [name, def],
    ) => [name, applySoftTheme(def)]),
  ),
} as const;

export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private sounds: SoundsCollection = {};
  private currentTheme: keyof typeof SoundThemes = "DEFAULT";

  constructor(theme: keyof typeof SoundThemes = "DEFAULT") {
    this.currentTheme = theme;
    this.init();
  }

  /**
   * Plays a sound by its registered name.
   */
  public playSound(soundName: SoundName): void {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    } else {
      console.warn(`Sound '${soundName}' not found.`);
    }
  }

  /**
   * Changes the sound theme and reinitializes sounds
   */
  public setTheme(theme: keyof typeof SoundThemes): void {
    this.currentTheme = theme;
    this.initializeSounds();
  }

  /**
   * Gets the current sound theme
   */
  public getCurrentTheme(): keyof typeof SoundThemes {
    return this.currentTheme;
  }

  /**
   * Gets all available sound names
   */
  public getAvailableSounds(): string[] {
    return Object.keys(SoundThemes[this.currentTheme]);
  }

  /**
   * Registers a custom sound using the new component-based approach
   */
  public registerSound(
    name: string,
    config: {
      oscillators: OscillatorSpec[];
      envelope: EnvelopeSpec;
      duration: number;
      filter?: FilterSpec;
      pitchBend?: PitchBendSpec;
      filterSweep?: FilterSweepSpec;
    },
  ): void {
    if (this.audioContext) {
      this.sounds[name] = this.createSoundFromComponents(config);
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  public registerLegacySound(name: string, options: SoundOptions): void {
    if (this.audioContext) {
      this.sounds[name] = this.createLegacySound(options);
    }
  }

  private init(): void {
    try {
      this.audioContext =
        new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initializeSounds();
    } catch (e) {
      console.log("Audio not available:", e);
    }
  }

  private initializeSounds(): void {
    if (!this.audioContext) return;

    const soundDefinitions = SoundThemes[this.currentTheme];
    this.sounds = {};

    Object.entries(soundDefinitions).forEach(([name, config]) => {
      this.sounds[name] = this.createSoundFromComponents(config);
    });
  }

  /**
   * Creates a sound using the new component-based approach
   */
  private createSoundFromComponents(config: {
    oscillators: OscillatorSpec[];
    envelope: EnvelopeSpec;
    duration: number;
    filter?: FilterSpec;
    pitchBend?: PitchBendSpec;
    filterSweep?: FilterSweepSpec;
  }): SoundFunction {
    return (): void => {
      if (!this.audioContext) return;

      try {
        const now = this.audioContext.currentTime;
        const {
          oscillators,
          envelope,
          duration,
          filter,
          pitchBend,
          filterSweep,
        } = config;

        // Create master gain with envelope
        const gainControl = this.createGainWithEnvelope(
          envelope,
          now,
          duration,
        );

        // Setup filter chain if needed
        const lastNode = this.setupFilterNode(
          filter,
          filterSweep,
          gainControl,
          now,
          duration,
        );

        // Create and connect oscillators
        const sources = this.createOscillatorSources(
          oscillators,
          pitchBend,
          now,
          duration,
        );
        this.connectAndStartOscillators(sources, lastNode, now, duration);
      } catch (e) {
        console.error("Error playing sound:", e);
      }
    };
  }

  private createGainWithEnvelope(
    envelope: EnvelopeSpec,
    now: number,
    duration: number,
  ): GainNode {
    const gainControl = this.audioContext!.createGain();
    gainControl.connect(this.audioContext!.destination);

    // Apply ADSR envelope
    gainControl.gain.setValueAtTime(0, now);
    gainControl.gain.linearRampToValueAtTime(
      envelope.gain,
      now + envelope.attack,
    );

    const decayEndTime = now + envelope.attack + envelope.decay;
    gainControl.gain.exponentialRampToValueAtTime(
      envelope.sustain * envelope.gain,
      decayEndTime,
    );

    const releaseStartTime = now + duration - envelope.release;
    if (releaseStartTime > decayEndTime) {
      gainControl.gain.linearRampToValueAtTime(
        envelope.sustain * envelope.gain,
        releaseStartTime,
      );
    }

    gainControl.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    return gainControl;
  }

  private setupFilterNode(
    filter: FilterSpec | undefined,
    filterSweep: FilterSweepSpec | undefined,
    gainControl: GainNode,
    now: number,
    duration: number,
  ): AudioNode {
    if (!filter) return gainControl;

    const filterNode = this.audioContext!.createBiquadFilter();
    filterNode.type = filter.type;
    filterNode.frequency.setValueAtTime(filter.frequency, now);
    filterNode.Q.setValueAtTime(filter.q || 1, now);
    if (filter.gain !== undefined) {
      filterNode.gain.setValueAtTime(filter.gain, now);
    }

    // Apply filter sweep if specified
    if (filterSweep) {
      filterNode.frequency.setValueAtTime(filterSweep.start, now);
      filterNode.frequency.linearRampToValueAtTime(
        filterSweep.end,
        now + filterSweep.time,
      );
    }

    filterNode.connect(gainControl);
    return filterNode;
  }

  private createOscillatorSources(
    oscillators: OscillatorSpec[],
    pitchBend: PitchBendSpec | undefined,
    now: number,
    duration: number,
  ): SoundSource[] {
    return oscillators.map((oscSpec) => {
      const oscillator = this.audioContext!.createOscillator();
      oscillator.type = oscSpec.type;
      oscillator.frequency.setValueAtTime(
        oscSpec.frequency + (oscSpec.frequencyOffset || 0),
        now,
      );

      if (oscSpec.detune) {
        oscillator.detune.setValueAtTime(oscSpec.detune, now);
      }

      // Apply pitch bend if specified
      if (pitchBend) {
        oscillator.frequency.setValueAtTime(pitchBend.start, now);
        oscillator.frequency.linearRampToValueAtTime(
          pitchBend.end,
          now + pitchBend.time,
        );
      }

      const oscGain = this.audioContext!.createGain();
      oscGain.gain.setValueAtTime(oscSpec.gain || 1, now);
      oscillator.connect(oscGain);

      return { oscillator, oscGain };
    });
  }

  private connectAndStartOscillators(
    sources: SoundSource[],
    destination: AudioNode,
    now: number,
    duration: number,
  ): void {
    sources.forEach((source) => {
      source.oscGain.connect(destination);
      source.oscillator.start(now);
      source.oscillator.stop(now + duration);
    });
  }

  /**
   * Legacy sound creation for backward compatibility
   */
  private createLegacySound(options: SoundOptions): SoundFunction {
    // Convert legacy options to new component format
    const oscillators: OscillatorSpec[] = options.oscillators
      ? options.oscillators.map((osc) => ({
        type: osc.type,
        frequency: options.frequency + osc.frequencyOffset,
        gain: osc.gain,
        detune: options.detune,
      }))
      : [{
        type: options.type || "sine",
        frequency: options.frequency,
        gain: 1,
        detune: options.detune,
      }];

    const envelope: EnvelopeSpec = createEnvelope(
      options.attack || 0.01,
      options.decay || 0.1,
      options.sustain || 0.5,
      options.release || 0.1,
      options.gain || 0.1,
    );

    const config = {
      oscillators,
      envelope,
      duration: options.duration || 0.2,
      filter: options.filter
        ? createFilter(
          options.filter.type,
          options.filter.frequency,
          { q: options.filter.q },
        )
        : undefined,
      pitchBend: options.pitchBend
        ? createPitchBend(
          options.pitchBend.start,
          options.pitchBend.end,
          options.pitchBend.time,
        )
        : undefined,
      filterSweep: options.filter?.sweep
        ? createFilterSweep(
          options.filter.sweep.start,
          options.filter.sweep.end,
          options.filter.sweep.time,
        )
        : undefined,
    };

    return this.createSoundFromComponents(config);
  }
}
