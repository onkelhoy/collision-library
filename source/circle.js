import { Vector } from "vector";

export class Circle extends Vector {
  constructor(x, y, r) {
    super(x, y);
    this.r = r;
  }

  draw(ctx, color) {
    super.draw(ctx, color, this.r);
  }

  static toCircle(v, r) {
    const c = new Circle(v);
    c.r = r;

    return c;
  }
}