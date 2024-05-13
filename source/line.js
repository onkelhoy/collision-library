import {Vector} from "vector";

export class Line {

  /**
   * 
   * @param {Vector} a 
   * @param {Vector} b 
   */
  constructor(a, b) {
    this.a = a;
    if (b)
    {
      this.b = b;
      this.direction = Vector.Subtract(b, a);
    }
  }

  draw(ctx, color="black", r = 1) {
    ctx.strokeStyle = color;
    this.a.draw(ctx, color, r * 5);

    let a = this.a;
    let b = undefined;

    if (this.b) {
      this.b.draw(ctx, color, r * 5);
      b = this.b;
    }
    else 
    {
      a = {x:this.a.x - this.direction.x * 10_000, y:this.a.y - this.direction.y * 10_000}
      b = {x:this.a.x + this.direction.x * 10_000, y:this.a.y + this.direction.y * 10_000}
    }

    ctx.strokeWidth = r;
    ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    ctx.closePath();
  }

  static DirectionLine(a, direction) {
    const l = new Line(a);
    l.direction = direction;

    return l;
  } 
}