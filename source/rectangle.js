import { Vector } from "vector";

export class Rectangle extends Vector {
  constructor(x, y, w, h) {
    super(x, y);
    if (typeof x === "object")
    {
      this.w = x.w;
      this.h = x.h;
    }
    else 
    {
      this.w = w;
      this.h = h;
    }
  }

  draw(ctx, strokecolor = "black", fillcolor = "rgba(0,0,0,0.1)") {
    ctx.beginPath();
      ctx.rect(this.x, this.y, this.w, this.h);
      ctx.strokeStyle = strokecolor;
      ctx.stroke();
      ctx.fillStyle = fillcolor;
      ctx.fill();
    ctx.closePath();
  }
}

// export class Box extends Rectangle {
//   constructor(x, y, w, h, angle) {
//     super(x, y, w, h);

//     this.rotation = angle;
//   } 

//   draw(ctx, color = "black") {
//     const dw = this.w/2;
//     const dh = this.h/2;
//     const center = {x: this.x + dw, y: this.y + dh};

//     ctx.beginPath();
//     ctx.moveTo()
//     ctx.rect(this.x, this.y, this.w, this.h);
//     ctx.strokeStyle = color;
//     ctx.stroke();
//     ctx.closePath();
//   }
// }