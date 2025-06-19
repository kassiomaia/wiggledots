# @wiggledots/engine

A high-performance WebGL-based Conway's Game of Life simulation engine with audio feedback and interactive controls.

## Overview

This package provides a complete Game of Life implementation using WebGL for rendering and GPU-accelerated computation. The engine supports real-time interaction, audio feedback, and customizable simulation parameters.

## Features

- **WebGL Rendering**: Hardware-accelerated rendering using WebGL2 with custom shaders
- **Interactive Controls**: Click to toggle cell states with immediate audio feedback
- **Audio Integration**: Sound effects for cell spawn/death events via `@wiggledots/audio`
- **Real-time Statistics**: Live tracking of alive/dead cell counts
- **Customizable Parameters**: Configurable FPS and initial cell probability
- **State Management**: Observable state changes with subscription support
- **Responsive Design**: Automatic canvas resizing and state recovery

## Installation

```bash
# Using pnpm (recommended)
pnpm add @wiggledots/engine

# Using npm
npm install @wiggledots/engine

# Using yarn
yarn add @wiggledots/engine
```

## Dependencies

This package requires the following workspace dependencies:
- `@wiggledots/audio` - Audio system for sound effects
- `@wiggledots/webgl` - WebGL utilities and shader management

## Basic Usage

```typescript
import { createEngine, EngineOptions } from '@wiggledots/engine';

// Get canvas element
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

// Configure engine options
const options: EngineOptions = {
  fps: 60,
  rand: {
    probability: 0.3 // 30% chance for initial alive cells
  }
};

// Create and start the engine
const engine = createEngine(canvas, options);

// Start the simulation
engine.start();

// Subscribe to state changes
const unsubscribe = engine.subscribe((state) => {
  const stats = state.getStats();
  console.log(`Alive: ${stats.alive}, Dead: ${stats.dead}`);
});

// Control the simulation
engine.pause();  // Pause simulation
engine.reset();  // Reset with new random state
engine.start();  // Resume simulation

// Clean up
unsubscribe();
engine.destroy();
```

## API Reference

### `createEngine(element: HTMLCanvasElement, options: EngineOptions): Engine`

Creates a new Game of Life engine instance.

**Parameters:**
- `element`: HTML canvas element for rendering
- `options`: Configuration options for the engine

**Returns:** Engine instance

### `EngineOptions`

```typescript
interface EngineOptions {
  fps: number;           // Target frames per second
  rand?: {
    probability: number; // Initial alive cell probability (0-1)
  };
}
```

### `Engine` Interface

```typescript
interface Engine {
  start(): void;         // Start/resume the simulation
  pause(): void;         // Pause the simulation
  reset(): void;         // Reset with new random state
  isRunning(): boolean;  // Check if simulation is running
  subscribe(callback: (state: State) => void): () => void; // Subscribe to state changes
  destroy(): void;       // Clean up resources
}
```

### `State` Class

The simulation state provides access to the cellular automaton grid:

```typescript
class State {
  readonly width: number;
  readonly height: number;
  
  getCell(x: number, y: number): Cell;
  setCell(x: number, y: number, cell: Cell): void;
  getStats(): { alive: number; dead: number };
  randomize(probability?: number): void;
  next(): void; // Advance one generation
}
```

### `Cell` Interface

```typescript
interface Cell {
  isAlive(): boolean;
}

class Awake implements Cell {
  isAlive(): boolean { return true; }
}

class Asleep implements Cell {
  isAlive(): boolean { return false; }
}
```

## Interactive Controls

- **Mouse Click**: Toggle cell state at clicked position
- **Audio Feedback**:
    - "spawn" sound when cell becomes alive
    - "death" sound when cell dies
- **Automatic Resize**: Canvas and simulation adapt to window resize events

## Technical Architecture

### Rendering Pipeline

1. **State Update**: CPU calculates next generation using Conway's rules
2. **Texture Conversion**: Cell states converted to RGBA texture data
3. **GPU Rendering**: WebGL shaders render the texture to canvas
4. **Frame Management**: Double-buffered textures for smooth animation

### Conway's Game of Life Rules

The simulation implements the classic rules:
- **Survival**: Live cell with 2-3 neighbors survives
- **Death**: Live cell with <2 or >3 neighbors dies
- **Birth**: Dead cell with exactly 3 neighbors becomes alive

### Performance Optimizations

- WebGL GPU rendering for maximum performance
- Efficient texture swapping between frames
- Optimized neighbor counting algorithm
- Canvas-based coordinate system with NDC conversion

## Shader Requirements

The engine expects the following shader files:
- `./shaders/vertex.glsl` - Vertex shader for quad rendering
- `./shaders/render.glsl` - Fragment shader for cell visualization

These are imported as raw strings and compiled at runtime.

## Development

### Building

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm watch

# Type checking
pnpm check-types
```

### Project Structure

```
src/
├── Cell.ts              # Cell interface and implementations
├── Engine.ts            # Main engine class and factory
├── Renderer.ts          # WebGL rendering system
├── State.ts             # Game state management
├── TextureConverter.ts  # State-to-texture conversion
├── types.ts             # TypeScript interfaces
├── index.ts             # Public API exports
└── shaders/
    ├── vertex.glsl      # Vertex shader
    └── render.glsl      # Fragment shader
```

## Browser Compatibility

- Requires WebGL2 support
- Modern browsers (Chrome 56+, Firefox 51+, Safari 15.0+)
- Canvas API support
- RequestAnimationFrame support

## License

ISC

## Contributing

This package is part of the WiggleDots workspace. Ensure all workspace dependencies are properly linked during development.
