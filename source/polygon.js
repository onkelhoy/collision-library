import {Vector} from "vector";

export class Polygon {

  constructor(...verticies) {
    this.verticies = [];
    this.triangles = [];

    for (let v of verticies) {
      this.verticies.push(new Vector(v));
    }
  }

  draw(ctx, color = "black", r = 1) {
    ctx.strokeStyle = color;
    
    this.verticies.forEach((v, i) => {
      v.draw(ctx, color, r * 3);

      ctx.fillText(i, v.x, v.y - 10);
    });
    
    ctx.lineWidth = r / 2;
    for (let i=0; i<this.triangles.length; i+=3) {
      const a = this.verticies[this.triangles[i]];
      const b = this.verticies[this.triangles[i + 1]];
      const c = this.verticies[this.triangles[i + 2]];

      ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(a.x, a.y);
        ctx.stroke();
      ctx.closePath();
    }

    ctx.lineWidth = r;
    if (this.verticies.length > 1)
    {
      ctx.beginPath();
      for (let i=0; i<this.verticies.length; i++) {
        if (i === 0)
        {
          ctx.moveTo(this.verticies[i].x, this.verticies[i].y);
        }
        else 
        {
          ctx.lineTo(this.verticies[i].x, this.verticies[i].y);
        }
      }
  
      ctx.lineTo(this.verticies[0].x, this.verticies[0].y);
  
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.1)"
      ctx.fill();
      ctx.closePath();
    }
    
  }
}