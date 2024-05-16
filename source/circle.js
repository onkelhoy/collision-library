import { Vector } from "vector";

export class Circle extends Vector {
  constructor(x, y, r) {
    super(x, y);
    this.r = r;
  }

  draw(ctx, strokecolor = "black", fillcolor="rgba(0,0,0,0.1)") {
    ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = strokecolor;
      ctx.fillStyle = fillcolor;
      ctx.strokeWeight = 1;
      ctx.stroke();
      ctx.fill();
    ctx.closePath();
  }

  static toCircle(v, r) {
    const c = new Circle(v);
    c.r = r;

    return c;
  }
}