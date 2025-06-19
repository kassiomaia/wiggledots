export interface Cell {
  readonly isAlive: () => boolean;
}

export class Awake implements Cell {
  isAlive() {
    return true;
  }
}

export class Asleep implements Cell {
  isAlive() {
    return false;
  }
}
