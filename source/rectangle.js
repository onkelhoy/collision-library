export class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(ctx, color = "black") {
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = color;
    ctx.stroke();
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