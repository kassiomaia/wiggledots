import {Asleep, Awake, Cell} from "./Cell";
import {FilterObject} from "./FilterObject";

export class State {
  public readonly width: number;
  public readonly height: number;
  public cells: Cell[][];
  private filters: FilterObject[] = [];
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = this.emptyGrid();
  }
  
  /**
   * Randomizes the grid with a given probability of alive cells
   * @param prob - Probability of a cell being alive (default: 0.05)
   */
  public randomize(prob?: number): void {
    const probability: number = prob || 0.5;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x] = Math.random() < probability
          ? new Awake()
          : new Asleep();
      }
    }
  }
  
  /**
   * Gets the cell at the specified coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns The cell at the coordinates, or a dead cell if out of bounds
   */
  public getCell(x: number, y: number): Cell {
    if (!this.inBounds(x, y)) return new Asleep();
    return this.cells[y][x];
  }
  
  /**
   * Sets the cell at the specified coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param cell - The cell to place
   */
  public setCell(x: number, y: number, cell: Cell): void {
    if (this.inBounds(x, y)) {
      this.cells[y][x] = cell;
    }
  }
  
  /**
   * Advances the simulation to the next generation using Conway's Game of Life rules
   */
  public next(): void {
    let grid = this.emptyGrid();
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const current = this.getCell(x, y);
        const awakeNeighbors = this.countAwakeNeighbors(x, y);
        
        if (current instanceof Awake) {
          if (awakeNeighbors < 2 || awakeNeighbors > 3) {
            grid[y][x] = new Asleep();
          } else {
            grid[y][x] = new Awake();
          }
        } else {
          if (awakeNeighbors === 3) {
            grid[y][x] = new Awake();
          } else {
            grid[y][x] = new Asleep();
          }
        }
      }
    }
    
    // NOTE: Apply filters after the next state is computed
    // This allows filters to modify the state after the rules have been applied
    if (this.filters.length > 0) {
      for (let i = 0; i < this.filters.length; i++) {
        // Apply each filter in sequence
        const filter = this.filters[i];
        grid = this.convolve(grid, filter.kernel);
      }
    }
    
    this.cells = grid;
  }
  
  /**
   * Gets statistics about the current state of the simulation
   * @returns Object containing alive and dead cell counts
   */
  public getStats() {
    let alive = 0;
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.isAlive?.()) alive++;
      }
    }
    const total = this.width * this.height;
    return {alive, dead: total - alive};
  }
  
  public applyFilter(filterObject: FilterObject) {
    this.filters.push(filterObject);
  }
  
  private convolve(
    grid: Cell[][],
    kernel: number[][]
  ): Cell[][] {
    
    // BUG: The Idea here is to apply the kernel to each cell in the grid to filter out cells based on the kernel's values.
    // but there is a issue with the current implementation, and the filter is not working as expected.
    
    return grid;
    /*
    const newGrid: Cell[][] = this.emptyGrid();
    
    const sum = kernel.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0);
    const ignore = new Map<string, Cell>();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        
        let awakeNeighbors = 0;
        const neighbors = new Map<string,  Cell>();
        for (let ky = 0; ky < kernel.length; ky++) {
          for (let kx = 0; kx < kernel[ky].length; kx++) {
            const nx = x + kx - Math.floor(kernel[ky].length / 2);
            const ny = y + ky - Math.floor(kernel.length / 2);
            
            const value = kernel[ky][nx];
            if (grid[ny] === undefined || grid[ny][nx] === undefined) continue;
            
            const neighbor = grid[ny][nx];
            if (neighbor.isAlive()) {
              neighbors.set(`${nx},${ny}`, neighbor);
              awakeNeighbors += value;
            } else {
              awakeNeighbors -= value;
            }
          }
        }
        

        if (awakeNeighbors === sum) {
          for (const [key, neighbor] of neighbors) {
            const [nx, ny] = key.split(',').map(Number);
            if (this.inBounds(nx, ny)) {
              newGrid[ny][nx] = new Asleep()
            }
            
            ignore.set(`${nx},${ny}`, neighbor);
          }
          
          newGrid[y][x] = new Awake();
        } else if (!ignore.has(`${x},${y}`)) {
          newGrid[y][x] = grid[y][x];
        }
      }
    }
    
    return newGrid;
     */
  }
  
  /**
   * Creates an empty grid filled with dead cells
   * @returns 2D array of dead cells
   */
  private emptyGrid(): Cell[][] {
    return Array.from(
      {length: this.height},
      () => Array.from({length: this.width}, () => new Asleep()),
    );
  }
  
  /**
   * Checks if the given coordinates are within the grid bounds
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns True if coordinates are within bounds
   */
  private inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
  
  /**
   * Counts the number of alive neighbors around a cell
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns Number of alive neighbors
   */
  private countAwakeNeighbors(x: number, y: number): number {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = this.getCell(x + dx, y + dy);
        if (neighbor.isAlive?.()) count++;
      }
    }
    return count;
  }
}
