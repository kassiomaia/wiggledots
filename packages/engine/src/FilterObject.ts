import { Cell } from "./Cell";

export type FilterObjectType = 'convolution';
export type FilterObject = {
  type: FilterObjectType;
  kernel: number[][];
};
export function createFilterObject(type: FilterObjectType, kernel: number[][]): FilterObject {
  return {
    type,
    kernel,
  };
}
