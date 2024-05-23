import {Vector} from "vector";

export class Shape extends Vector {
  constructor(x, y, z) {
    super(x, y, z);
    this.center = this.copy();
  }

  // these needs to be implemented in the classes
  get boundary() {
    throw new Error("to be implemented");
  }

  /**
   * function used by GJK algorithm to determine furthest point
   * @param {Vector} direction 
   * @returns {Vector} support-point
   */
  supportFunction(direction) {
    throw new Error("to be implemented");
  }

  move(x, y, z) {
    this.set(x, y, z);
  }
}