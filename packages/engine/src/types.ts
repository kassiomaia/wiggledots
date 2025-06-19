import { type State } from "./State";

export interface EngineOptions {
  fps: number;
  rand?: {
    probability: number;
  };
}

// Interface for cell count statistics
export interface Statistics {
  alive: number;
  dead: number;
}

export interface Engine {
  readonly start: () => void;
  readonly reset: () => void;
  readonly pause: () => void;
  readonly isRunning: () => boolean;
  readonly subscribe: (stateChange: (state: State) => void) => () => void;
  readonly filter: (matrix: number[][]) => void;
}
