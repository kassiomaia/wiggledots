# Digital Audio Theory: From Waves to Sound

A comprehensive guide to understanding the fundamental concepts behind digital
audio synthesis, covering oscillators, envelopes, filters, and effects.

## 🌊 The Nature of Sound

### What is Sound?

Sound is a mechanical wave that propagates through a medium (like air) as
variations in pressure. These pressure waves have several key characteristics:

- **Amplitude**: The strength or intensity of the wave (perceived as loudness)
- **Frequency**: How many cycles occur per second, measured in Hertz (Hz)
  (perceived as pitch)
- **Phase**: The position of the wave in its cycle at a given moment
- **Waveform**: The shape of the wave, which determines timbre (tone quality)

### From Analog to Digital

In the analog world, sound waves are continuous. Digital audio represents these
continuous waves as a series of discrete samples taken at regular intervals:

- **Sample Rate**: How many samples per second (e.g., 44,100 Hz means 44,100
  samples per second)
- **Bit Depth**: How many bits represent each sample's amplitude (e.g., 16-bit,
  24-bit)
- **Nyquist Theorem**: The sample rate must be at least twice the highest
  frequency you want to reproduce

## 🎵 Fundamental Frequencies and Musical Notes

### The Physics of Pitch

Musical notes correspond to specific frequencies:

- **A4** (middle A) = 440 Hz
- Each octave doubles the frequency: A5 = 880 Hz, A3 = 220 Hz
- There are 12 semitones in an octave
- Each semitone is a frequency ratio of 2^(1/12) ≈ 1.059

### Equal Temperament

Modern Western music uses equal temperament, where:

```
frequency = 440 × 2^((note - 69) / 12)
```

Where `note` is the MIDI note number (A4 = 69).

## 🌊 Oscillators: The Building Blocks of Sound

### What is an Oscillator?

An oscillator generates a repeating waveform at a specific frequency. It's the
primary sound source in synthesis. The mathematical representation of a basic
oscillator is:

```
output(t) = amplitude × waveform(2π × frequency × t + phase)
```

### Common Waveforms

#### 1. Sine Wave

- **Mathematical Form**: `sin(2πft)`
- **Characteristics**: Pure tone, single frequency component
- **Harmonic Content**: Only the fundamental frequency
- **Sound**: Smooth, flute-like, "pure"
- **Use Cases**: Sub-bass, pure tones, modulation sources

#### 2. Square Wave

- **Mathematical Form**: `sign(sin(2πft))`
- **Characteristics**: Alternates between +1 and -1
- **Harmonic Content**: Odd harmonics (1st, 3rd, 5th, 7th...)
- **Sound**: Hollow, woody, like a clarinet
- **Use Cases**: Leads, basses, retro video game sounds

#### 3. Sawtooth Wave

- **Mathematical Form**: Linear ramp from -1 to +1, then instant reset
- **Characteristics**: Contains all harmonics
- **Harmonic Content**: All integer multiples of fundamental (1st, 2nd, 3rd,
  4th...)
- **Sound**: Bright, buzzy, rich
- **Use Cases**: Strings, brass, aggressive leads, classic analog synth sounds

#### 4. Triangle Wave

- **Mathematical Form**: Linear ramp up, then linear ramp down
- **Characteristics**: Similar to square but softer
- **Harmonic Content**: Odd harmonics, but weaker than square wave
- **Sound**: Softer than square, warmer than sine
- **Use Cases**: Mellow leads, sub-bass, vintage computer sounds

### Advanced Oscillator Concepts

#### Harmonics and Timbre

The timbre (tone color) of a sound comes from its harmonic content:

- **Fundamental**: The lowest frequency, determines perceived pitch
- **Harmonics**: Integer multiples of the fundamental that give character
- **Overtones**: Non-integer multiples (rare in simple oscillators)

#### Phase Relationships

When combining multiple oscillators:

- **In Phase**: Waves align, amplitudes add (louder)
- **Out of Phase**: Waves cancel, can create nulls or different timbres
- **Phase Modulation**: Using one oscillator to modulate another's phase

#### Aliasing

In digital systems, frequencies above half the sample rate "fold back" as lower
frequencies:

- **Anti-aliasing**: Techniques to prevent unwanted frequencies
- **Oversampling**: Using higher internal sample rates to reduce aliasing
- **Band-limited oscillators**: Oscillators designed to avoid aliasing

## 📈 Envelopes: Shaping Sound Over Time

### The ADSR Model

An envelope controls how a parameter (usually amplitude) changes over time. The
classic ADSR envelope has four stages:

#### Attack (A)

- **Duration**: Time from note-on to peak level
- **Shape**: Usually exponential curve upward
- **Musical Effect**: Determines how "punchy" or "soft" the attack feels
- **Real-world Examples**:
  - Piano: Very fast attack (~1-5ms)
  - Strings: Slower attack (50-500ms)
  - Pad sounds: Very slow attack (500ms-2s)

#### Decay (D)

- **Duration**: Time from peak to sustain level
- **Shape**: Usually exponential decay
- **Musical Effect**: Adds natural feel, prevents static sounds
- **Real-world Examples**:
  - Plucked strings: Notable decay phase
  - Brass: Minimal decay phase

#### Sustain (S)

- **Level**: The amplitude maintained while note is held
- **Characteristic**: Unlike other stages, this is a level, not a time
- **Musical Effect**: Determines how the sound behaves while holding a key
- **Real-world Examples**:
  - Organ: Full sustain (100%)
  - Piano: No sustain (0%)
  - Strings: Partial sustain (20-70%)

#### Release (R)

- **Duration**: Time from note-off to silence
- **Shape**: Usually exponential decay
- **Musical Effect**: Natural tail-off, prevents clicks
- **Real-world Examples**:
  - Piano: Long release (1-3 seconds)
  - Staccato instruments: Very short release

### Mathematical Representation

A simple exponential envelope can be modeled as:

```
attack: level(t) = 1 - e^(-t/τ_attack)
decay: level(t) = sustain + (1-sustain) × e^(-t/τ_decay)
release: level(t) = sustain × e^(-t/τ_release)
```

Where τ (tau) represents the time constant.

### Advanced Envelope Concepts

#### Multi-stage Envelopes

Beyond ADSR, you can have:

- **AHDSR**: Attack, Hold, Decay, Sustain, Release
- **Multi-point**: Any number of time/level pairs
- **Looping envelopes**: For tremolo or complex modulation

#### Envelope Curves

- **Linear**: Straight lines between points
- **Exponential**: Natural-sounding curves (most common)
- **Logarithmic**: Inverse of exponential
- **S-curves**: Smooth acceleration and deceleration

## 🎛️ Filters: Sculpting Frequency Content

### What Filters Do

Filters selectively attenuate (reduce) or boost certain frequencies in a signal.
They're essential for:

- Removing unwanted frequencies
- Creating movement and expression
- Emulating acoustic instrument characteristics
- Creative sound design

### Filter Parameters

#### Cutoff Frequency

- **Definition**: The frequency at which the filter begins to take effect
- **Measured in**: Hz or sometimes as a MIDI note number
- **Effect**: Determines which frequencies are affected

#### Resonance (Q Factor)

- **Definition**: Emphasis at the cutoff frequency
- **Effect**:
  - Low Q: Gentle, musical filtering
  - High Q: Sharp, resonant peak that can self-oscillate
- **Mathematical**: Q = center_frequency / bandwidth

#### Filter Slope

- **Definition**: How steeply the filter cuts frequencies (measured in
  dB/octave)
- **Common slopes**: 6dB/oct, 12dB/oct, 18dB/oct, 24dB/oct
- **Effect**: Steeper slopes = more dramatic filtering

### Filter Types

#### Low-pass Filter

- **Function**: Allows low frequencies through, cuts high frequencies
- **Cutoff behavior**: Frequencies below cutoff pass, above cutoff are
  attenuated
- **Sound effect**: Warmer, darker, more muffled
- **Use cases**: Removing harshness, simulating distance, analog warmth
- **Mathematical**: `H(f) = 1 / (1 + j(f/fc))`

#### High-pass Filter

- **Function**: Allows high frequencies through, cuts low frequencies
- **Cutoff behavior**: Frequencies above cutoff pass, below cutoff are
  attenuated
- **Sound effect**: Thinner, brighter, more present
- **Use cases**: Removing muddiness, creating thin/radio effects, clearing low
  end

#### Band-pass Filter

- **Function**: Allows a band of frequencies around the cutoff to pass
- **Parameters**: Center frequency and bandwidth (or Q)
- **Sound effect**: Hollow, vocal-like, telephone-like
- **Use cases**: Vocal formants, special effects, isolating frequency ranges

#### Band-reject (Notch) Filter

- **Function**: Removes a narrow band of frequencies around the cutoff
- **Effect**: Opposite of band-pass
- **Use cases**: Removing specific problem frequencies, phaser effects

#### Shelving Filters

- **Low-shelf**: Boosts or cuts all frequencies below the cutoff by a fixed
  amount
- **High-shelf**: Boosts or cuts all frequencies above the cutoff by a fixed
  amount
- **Use cases**: Tone controls, EQ, brightening/darkening

#### Peaking Filter

- **Function**: Boosts or cuts frequencies around the cutoff point
- **Shape**: Bell curve around the center frequency
- **Use cases**: EQ, emphasizing specific frequency ranges

### Advanced Filter Concepts

#### Filter Modulation

Filters become expressive when their parameters change over time:

- **Envelope modulation**: Filter sweeps that follow note dynamics
- **LFO modulation**: Cyclic filter movement for wobble effects
- **Keyboard tracking**: Filter cutoff follows note pitch

#### Series vs Parallel Filtering

- **Series**: Signal passes through filters one after another (steeper slopes)
- **Parallel**: Signal is split and filtered separately, then mixed (complex
  frequency responses)

#### State-variable Filters

Provide multiple filter types simultaneously from the same circuit:

- All filter types available at once
- Often used in analog synthesizer designs
- Better control over resonance and stability

## 🎭 Pitch Bends and Modulation

### Understanding Pitch Bend

Pitch bend smoothly transitions the frequency of a sound from one value to
another, creating expressive musical effects.

#### Mathematical Foundation

Pitch bend is typically measured in semitones:

```
new_frequency = original_frequency × 2^(semitones/12)
```

For example, bending up 2 semitones:

```
new_freq = 440 Hz × 2^(2/12) = 440 Hz × 1.122 = 493.88 Hz
```

### Types of Pitch Modulation

#### Static Pitch Bend

- **Linear**: Frequency changes at a constant rate
- **Exponential**: Smooth acceleration/deceleration
- **Use cases**: Guitar bends, slide effects, portamento

#### Vibrato

- **Definition**: Periodic pitch modulation
- **Parameters**:
  - Rate (how fast): typically 4-7 Hz for musical vibrato
  - Depth (how much): usually 5-50 cents (1 semitone = 100 cents)
- **Mathematical**:
  `frequency(t) = base_freq × (1 + depth × sin(2π × rate × t))`
- **Natural examples**: Human voice, string instruments

#### Portamento/Glide

- **Definition**: Smooth transition between two discrete pitches
- **Time-based**: Controlled by glide time rather than bend rate
- **Use cases**: Synthesizer leads, vocal effects, smooth bass lines

### Advanced Pitch Modulation

#### Pitch Envelopes

Pitch can have its own envelope, independent of amplitude:

- **Initial bend**: Start at one pitch, quickly move to target
- **Pitch decay**: Gradual frequency settling
- **Common in**: Bell sounds, mallets, some ethnic instruments

#### Frequency Modulation (FM)

- **Concept**: Using one oscillator to modulate another's frequency
- **Simple FM**:
  `carrier_freq + (modulator_amplitude × sin(2π × modulator_freq × t))`
- **Complex timbres**: Can create bell-like, metallic, or inharmonic sounds
- **Sidebands**: FM creates additional frequencies at carrier ± modulator
  frequencies

#### Phase Modulation

- **Similar to FM**: But modulates phase instead of frequency
- **Mathematical relationship**: Phase modulation and FM are closely related
- **Digital advantages**: Often easier to implement digitally than true FM

## 🔊 Putting It All Together: Signal Flow

### Typical Synthesis Signal Chain

1. **Oscillator(s)**: Generate the raw waveform(s)
2. **Mixer**: Combine multiple oscillators
3. **Filter**: Shape the frequency content
4. **Amplifier**: Control the final volume
5. **Effects**: Add reverb, delay, chorus, etc.

### Modulation Sources and Destinations

#### Common Modulation Sources

- **Envelopes**: Time-based modulation following note events
- **LFOs** (Low Frequency Oscillators): Cyclic modulation below hearing range
- **Keyboard tracking**: Modulation based on which key is pressed
- **Velocity**: Modulation based on how hard a key is pressed

#### Common Modulation Destinations

- **Oscillator frequency**: Vibrato, pitch bends
- **Oscillator amplitude**: Tremolo, envelope shaping
- **Filter cutoff**: Filter sweeps, expression
- **Filter resonance**: Dynamic filter character
- **Pan position**: Auto-panning effects

### Polyphony Considerations

#### Voice Allocation

- **Monophonic**: One note at a time
- **Polyphonic**: Multiple simultaneous notes
- **Voice stealing**: What happens when you exceed the polyphony limit

#### Per-voice vs Global Parameters

- **Per-voice**: Each note has its own envelope, pitch bend, etc.
- **Global**: Shared parameters like master volume, global effects

## 🧮 Digital Implementation Considerations

### Sample Rate and Aliasing

- **Nyquist frequency**: Maximum representable frequency = sample_rate / 2
- **Aliasing prevention**: Band-limiting, oversampling, anti-aliasing filters
- **CPU vs quality**: Higher sample rates = more CPU usage

### Precision and Quantization

- **Floating point**: Modern systems typically use 32-bit float
- **Fixed point**: Some embedded systems use integer math
- **Quantization noise**: Error introduced by finite precision

### Real-time Constraints

- **Buffer sizes**: Balance between latency and stability
- **CPU usage**: Must process audio faster than real-time
- **Memory management**: Avoid allocations in audio callbacks

## 🎨 Creative Applications

### Sound Design Principles

1. **Start with the right oscillator**: Choose waveforms that match your desired
   character
2. **Shape with envelopes**: Make sounds feel natural and expressive
3. **Filter for character**: Use filtering to create movement and interest
4. **Add modulation**: Make static sounds come alive with pitch and filter
   modulation
5. **Layer thoughtfully**: Combine multiple elements for complex sounds

### Genre-Specific Techniques

#### Electronic Dance Music

- **Super saws**: Multiple detuned sawtooth waves
- **Filter drops**: Dramatic low-pass filter sweeps
- **Side-chain compression**: Rhythmic pumping effects

#### Ambient/Pad Sounds

- **Slow attacks**: Long envelope attack times
- **Multiple layers**: Different timbres at different octaves
- **Subtle modulation**: Gentle pitch and filter movement

#### Bass Sounds

- **Low-pass filtering**: Remove upper harmonics for weight
- **Envelope-controlled filters**: Percussive filter plucks
- **Sub harmonics**: Additional oscillators an octave down

## 📚 Further Study

### Recommended Topics

- **Digital Signal Processing (DSP)**: Mathematical foundations
- **Fourier Analysis**: Understanding frequency domain
- **Psychoacoustics**: How humans perceive sound
- **Advanced Synthesis**: FM, wavetable, granular, physical modeling
- **Audio Effects**: Reverb, delay, modulation effects

### Mathematical Tools

- **Complex numbers**: For understanding frequency domain
- **Trigonometry**: Essential for oscillators and modulation
- **Calculus**: For understanding continuous systems
- **Linear algebra**: For advanced DSP operations

---

Understanding these fundamental concepts will help you create more expressive
and musical sounds, whether you're building synthesizers, composing music, or
exploring the fascinating world of digital audio.
