import {AudioSystem} from "@wiggledots/audio";
import {WebGLSystem} from "@wiggledots/webgl";
import {Asleep, Awake} from "./Cell";
import {createFilterObject} from "./FilterObject";
import {Renderer} from "./Renderer";
import {State} from "./State";
import {Engine, EngineOptions} from "./types";

class EngineObject implements Engine {
  private renderer: Renderer | null = null;
  private running: boolean = false;
  private executedAt: number = 0;
  private state!: State;
  private listeners: Set<(state: State) => void> = new Set();
  
  private readonly audioSystem: AudioSystem;
  private readonly webglSystem: WebGLSystem;
  
  constructor(el: HTMLCanvasElement, private options: EngineOptions) {
    this.audioSystem = new AudioSystem();
    this.webglSystem = new WebGLSystem(el);
    
    el.addEventListener("click", (e) => {
      // grabby the mouse position in the webgl canvas
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // NDC (Normalized Device Coordinates) conversion
      // convert to normalized device coordinates (-1 to 1)
      const ndcX = (x / rect.width) * 2 - 1;
      const ndcY = 1 - (y / rect.height) * 2; // Invert Y axis for WebGL
      
      // Randomize the state at the clicked position
      const cell = this.state.getCell(
        Math.floor((ndcX + 1) * this.state.width / 2),
        Math.floor((ndcY + 1) * this.state.height / 2),
      );
      
      if (cell.isAlive()) {
        this.state.setCell(
          Math.floor((ndcX + 1) * this.state.width / 2),
          Math.floor((ndcY + 1) * this.state.height / 2),
          new Asleep(),
        );
        this.audioSystem.playSound("death");
      } else {
        this.state.setCell(
          Math.floor((ndcX + 1) * this.state.width / 2),
          Math.floor((ndcY + 1) * this.state.height / 2),
          new Awake(),
        );
        this.audioSystem.playSound("spawn");
      }
      
      this.state.next();
      this.renderer?.update(this.state);
    });
    
    this.init();
  }
  
  public subscribe(stateChange: (state: State) => void): () => void {
    if (!this.listeners.has(stateChange)) {
      this.listeners.add(stateChange);
    }
    
    return () => this.listeners.delete(stateChange);
  }
  
  public start(): void {
    this.running = true;
    this.audioSystem.playSound("spawn");
  }
  
  public pause(): void {
    this.running = false;
    this.audioSystem.playSound("spawn");
  }
  
  public reset(): void {
    this.running = false;
    this.randomizeState();
  }
  
  public isRunning(): boolean {
    return this.running;
  }
  
  public destroy(): void {
    this.running = false;
  }
  
  public filter(kernel: number[][]): void {
    if (!this.renderer) {
      console.error("Renderer not initialized");
      return;
    }
    
    this.state.applyFilter(createFilterObject('convolution', kernel));
  }
  
  private randomizeState() {
    this.state.randomize(this.options.rand?.probability);
  }
  
  private notify() {
    for (const listener of this.listeners) {
      // Enqueue execution
      Promise.resolve().then(() => listener(this.state));
    }
  }
  
  private init(): void {
    if (!this.webglSystem.getGL()) {
      console.error("Failed to initialize WebGL");
      return;
    }
    
    const {width, height} = this.webglSystem.getCanvas();
    this.state = new State(width, height);
    this.renderer = new Renderer(this.webglSystem);
    
    if (!this.renderer.init()) {
      console.error("Failed to initialize renderer");
      return;
    }
    
    this.randomizeState();
    
    if ("window" in globalThis) {
      globalThis.addEventListener("resize", () => this.recover());
    }
    
    // Initialize the first scene
    this.state.next();
    this.renderer.update(this.state);
    
    this.run();
  }
  
  private render(time: DOMHighResTimeStamp): void {
    if (!this.renderer) return;
    
    if (this.running && time - this.executedAt > (1000 / this.options.fps)) {
      this.state.next();
      this.renderer.update(this.state);
      this.executedAt = time;
      this.notify();
    }
    
    this.renderer.render();
    requestAnimationFrame((time: DOMHighResTimeStamp) => this.render(time));
  }
  
  private run(): void {
    requestAnimationFrame((time: DOMHighResTimeStamp) => this.render(time));
  }
  
  private recover() {
    const {width, height} = this.webglSystem.getCanvas();
    this.webglSystem.resize();
    this.state = new State(width, height);
    this.randomizeState();
  }
}

export const createEngine = (
  element: HTMLCanvasElement,
  options: EngineOptions,
): Engine => {
  return new EngineObject(element, options);
};
