import { Asleep, Awake, Cell } from "./Cell";
import { type State } from "./State";

type RGBAColor = [number, number, number, number];

export class TextureConverter {
  /**
   * Converts simulation state to texture data for WebGL rendering
   * @returns Uint8Array containing RGBA pixel data
   * @param state
   */
  static toData(state: State): Uint8Array {
    const { width, height, cells } = state;
    const data = new Uint8Array(width * height * 4);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = cells[y][x];
        const index = (y * width + x) * 4;

        const [r, g, b, a] = TextureConverter.encodeCell(cell);
        data.set([r, g, b, a], index);
      }
    }

    return data;
  }

  /**
   * Encodes a cell into RGBA color values based on its type and state
   * @param cell - The cell to encode
   * @returns RGBA color array [red, green, blue, alpha] with values 0-255
   */
  static encodeCell(cell: Cell): RGBAColor {
    if (cell instanceof Awake) {
      return [255, 255, 255, 255]; // White for alive cells
    } else if (cell instanceof Asleep) {
      return [0, 0, 0, 0]; // Transparent black for dead cells
    }

    // Fallback for unknown cell types (magenta for debugging)
    return [128, 0, 255, 255];
  }
}
