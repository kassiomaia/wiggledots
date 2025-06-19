# Audio Components API

A powerful TypeScript library for creating and manipulating audio components
including oscillators, envelopes, filters, and effects. Build complex sounds by
combining simple, composable audio building blocks.

## 📦 Installation

```bash
npm install audio-components-api
```

## 🎵 Quick Start

```typescript
import { createSimpleSynth, noteToFreq } from "audio-components-api";

// Create a simple synthesizer sound at middle C
const synth = createSimpleSynth(noteToFreq("C4"));
console.log(synth);
// Output: { oscillators, envelope, filter }
```

## 🏗️ Core Components

### Oscillators

Generate the fundamental waveforms that form the basis of all sounds.

**Basic Oscillators:**

- `createSineOsc()` - Pure, smooth sine wave
- `createSquareOsc()` - Square wave with rich harmonics
- `createSawOsc()` - Sawtooth wave, great for leads and basses
- `createTriangleOsc()` - Triangle wave, softer than square

**Advanced Oscillator Techniques:**

- `createDetuned()` - Create chorus/unison effects
- `createHarmonics()` - Add harmonic content for richer sounds
- `createOscillatorBank()` - Combine multiple oscillators

### Envelopes

Control how sounds evolve over time with Attack, Decay, Sustain, Release (ADSR).

**Envelope Presets:**

- `createPercussiveEnv()` - Sharp attack, quick decay (drums, plucks)
- `createPluckedEnv()` - Guitar/harp-like envelope
- `createPadEnv()` - Slow attack, sustained (strings, pads)
- `createOrganEnv()` - Instant on/off (organ, accordion)
- `createBellEnv()` - Bell-like decay curve

### Filters

Shape the frequency content of your sounds.

**Filter Types:**

- `createLowpass()` - Remove high frequencies (warm, muffled)
- `createHighpass()` - Remove low frequencies (thin, bright)
- `createBandpass()` - Keep only middle frequencies
- `createNotch()` - Remove specific frequency range
- `createPeaking()` - Boost/cut specific frequencies

### Effects

Add movement and expression to your sounds.

**Pitch Effects:**

- `createPitchBend()` - Bend from one frequency to another
- `createVibrato()` - Oscillating pitch modulation
- `createBendUp()` / `createBendDown()` - Convenient pitch bends

**Filter Effects:**

- `createFilterSweep()` - Animate filter cutoff frequency
- `createSweepUp()` / `createSweepDown()` - Filter sweep shortcuts

## 🎹 How-To Guides

### Creating Your First Sound

Start with a simple sine wave and add character:

```typescript
import {
  createLowpass,
  createPluckedEnv,
  createSineOsc,
  noteToFreq,
} from "audio-components-api";

// 1. Choose your fundamental frequency
const frequency = noteToFreq("A4"); // 440 Hz

// 2. Create an oscillator
const oscillator = createSineOsc(frequency, { gain: 0.8 });

// 3. Add an envelope for natural sound evolution
const envelope = createPluckedEnv(0.6);

// 4. Apply filtering to shape the tone
const filter = createLowpass(2000, 1.5);

// Your first sound is ready!
const mySound = {
  oscillators: [oscillator],
  envelope,
  filter,
};
```

### Building Rich, Layered Sounds

Combine multiple oscillators for complexity:

```typescript
import {
  createDetuned,
  createLowpass,
  createPadEnv,
  createSawOsc,
  createSquareOsc,
} from "audio-components-api";

// Create a rich pad sound
const baseFreq = noteToFreq("C3");

// Layer 1: Detuned sawtooth waves for width
const sawLayer = createDetuned(
  createSawOsc(baseFreq, { gain: 0.4 }),
  7, // Detune by 7 cents
);

// Layer 2: Sub bass with square wave
const bassLayer = createSquareOsc(baseFreq * 0.5, { gain: 0.3 });

// Combine all oscillators
const richPad = {
  oscillators: [...sawLayer, bassLayer],
  envelope: createPadEnv(0.7),
  filter: createLowpass(1800, 0.8),
};
```

### Creating Expressive Lead Sounds

Add pitch bends and filter sweeps for expression:

```typescript
import {
  createBendUp,
  createLowpass,
  createPluckedEnv,
  createSawOsc,
  createSweepUp,
  noteToFreq,
} from "audio-components-api";

const leadFreq = noteToFreq("E5");

const expressiveLead = {
  oscillators: [createSawOsc(leadFreq, { gain: 0.9 })],
  envelope: createPluckedEnv(1.0),
  filter: createLowpass(1000, 2.0),

  // Add a quarter-tone pitch bend up over 0.2 seconds
  pitchBend: createBendUp(leadFreq, 0.5, 0.2),

  // Sweep the filter up for brightness
  filterSweep: createSweepUp(1000, 3000, 0.5),
};
```

### Designing Percussive Sounds

Create drums and percussion with sharp envelopes:

```typescript
import {
  createBendDown,
  createLowpass,
  createPercussiveEnv,
  createSineOsc,
  createSquareOsc,
} from "audio-components-api";

// Kick drum
const kickDrum = {
  oscillators: [createSineOsc(60, { gain: 1.0 })],
  envelope: createPercussiveEnv(1.0),
  filter: createLowpass(200, 0.5),
  pitchBend: createBendDown(60, 12, 0.1), // Pitch drops an octave quickly
};

// Snare drum (noise-like with filtered square wave)
const snareDrum = {
  oscillators: [
    createSquareOsc(200, { gain: 0.7 }),
    createSquareOsc(150, { gain: 0.5 }),
  ],
  envelope: createPercussiveEnv(0.8),
  filter: createLowpass(4000, 3.0),
};
```

### Building Harmonic Instruments

Use harmonic series for realistic instrument sounds:

```typescript
import {
  createBellEnv,
  createBendDown,
  createHarmonics,
  createLowpass,
  createSineOsc,
} from "audio-components-api";

// Bell sound with natural harmonics
const bellSound = {
  oscillators: createHarmonics(
    createSineOsc(noteToFreq("C5")),
    [2, 3, 4, 5], // Add 2nd, 3rd, 4th, and 5th harmonics
  ),
  envelope: createBellEnv(0.6),
  filter: createLowpass(5000, 0.7),
  pitchBend: createBendDown(noteToFreq("C5"), 1, 0.3), // Slight pitch drop
};
```

### Advanced Sound Design Techniques

#### 1. Creating Movement with Multiple Effects

```typescript
const dynamicLead = {
  oscillators: createDetuned(createSawOsc(noteToFreq("G4")), 10),
  envelope: createPadEnv(0.8),
  filter: createBandpass(1500, 2.0),

  // Multiple modulations for complexity
  pitchBend: createVibrato(noteToFreq("G4"), 5, 0.1), // 5Hz vibrato
  filterSweep: createSweepUp(800, 2500, 1.0),
};
```

#### 2. Frequency Modulation Approach

```typescript
// Create FM-style sounds by using one oscillator to modulate another
const fmBass = {
  oscillators: [
    createSineOsc(noteToFreq("E2"), { gain: 0.8 }),
    createSineOsc(noteToFreq("E2") * 2.1, { gain: 0.3 }), // Slightly detuned carrier
  ],
  envelope: createPluckedEnv(1.0),
  filter: createLowpass(1200, 1.5),
};
```

#### 3. Creating Texture with Oscillator Banks

```typescript
import { combineOscillators, scaleOscillatorGains } from "audio-components-api";

// Create a thick, chorused sound
const chorusSound = {
  oscillators: scaleOscillatorGains(
    combineOscillators(
      createDetuned(createSawOsc(noteToFreq("C4")), 5),
      createDetuned(createSawOsc(noteToFreq("C4")), 12),
      createDetuned(createSawOsc(noteToFreq("C4")), 19),
    ),
    0.3, // Scale down to prevent clipping
  ),
  envelope: createPadEnv(0.5),
  filter: createLowpass(2000, 1.0),
};
```

## 🎛️ Preset Sounds

The library includes several preset combinations to get you started:

- `createSimpleSynth()` - Basic synthesizer sound
- `createRichPad()` - Lush, wide pad sound
- `createBell()` - Realistic bell with harmonics and pitch bend
- `createBass()` - Deep bass sound with sub-harmonic

## 🔧 Utility Functions

- `noteToFreq()` - Convert note names (e.g., 'C4') to frequencies
- `freqToMidi()` - Convert frequency to MIDI note number
- `midiToFreq()` - Convert MIDI note number to frequency
- `transposeOscillators()` - Transpose a bank of oscillators
- `scaleOscillatorGains()` - Adjust the volume of multiple oscillators

## 💡 Sound Design Tips

1. **Start Simple**: Begin with a single oscillator and basic envelope, then add
   complexity
2. **Layer Carefully**: Each oscillator adds CPU load - balance richness with
   performance
3. **Use Envelopes**: Natural sounds always change over time - static sounds
   feel artificial
4. **Filter for Character**: Filters can make the difference between harsh and
   musical
5. **Detune for Width**: Small amounts of detuning (5-20 cents) create width and
   movement
6. **Mind Your Gains**: Multiple oscillators can quickly cause clipping - scale
   gains appropriately

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## 📄 License

MIT License - see LICENSE file for details.
