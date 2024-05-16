import {Vector} from "vector";
import {Rectangle} from "rectangle";
import {Triangulate} from "polygon-helper";

export class Polygon {

  constructor(...verticies) {
    this.verticies = [];
    this.triangles = [];
    this.boundary = new Rectangle(0,0,0,0);

    for (let v of verticies) {
      this.verticies.push(new Vector(v));
    }

    if (this.verticies.length > 0)
    {
      this.triangulate();
      this.setBoundary();
    }
  }

  get x() {
    if (this.verticies.length === 0) throw new Error("could not set x of empty polygon");
    return this.verticies[0].x;
  }
  get y() {
    if (this.verticies.length === 0) throw new Error("could not set y of empty polygon");
    return this.verticies[0].y;
  }
  set x(value) {
    this.debouncedmove(value, this.y);
  }
  set y(value) {
    this.debouncedmove(this.x, value);
  }

  debouncedmove(x, y) {

  }

  move(x, y) {

  }

  triangulate() {
    return Triangulate(this);
  }

  setBoundary() {
    let minx = Number.MIN_SAFE_INTEGER;
    let miny = Number.MIN_SAFE_INTEGER;
    let maxx = Number.MAX_SAFE_INTEGER;
    let maxy = Number.MAX_SAFE_INTEGER;

    this.verticies.forEach(v => {
      if (v.x < minx) minx = v.x;
      else if (v.x > maxx) maxx = v.x;
      if (v.y < miny) miny = v.y;
      else if (v.y > maxy) maxy = v.y;
    });

    this.boundary.x = minx;
    this.boundary.y = miny;
    this.boundary.w = maxx - minx;
    this.boundary.h = maxy - miny;
  }

  getTriangle(i) {
    return [
      this.verticies[this.triangles[i * 3]],
      this.verticies[this.triangles[i * 3 + 1]],
      this.verticies[this.triangles[i * 3 + 2]],
    ]
  }
  getTriangles() {
    const triangles = [];
    for (let i=0; i<(this.triangles.length/3); i++) {
      triangles.push(this.getTriangle(i));
    }

    return triangles;
  }

  draw(ctx, strokecolor="black", fillcolor="rgba(0,0,0,0.1)", r=1) {
    ctx.strokeStyle = strokecolor;
    
    this.verticies.forEach((v, i) => {
      v.draw(ctx, strokecolor, r * 3);

      ctx.fillText(i, v.x, v.y - 10);
    });
    
    ctx.strokeWidth = r / 2;
    ctx.setLineDash([10, 15]);
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

    ctx.setLineDash([]);
    ctx.strokeWidth = r;
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
      ctx.fillStyle = fillcolor;
      ctx.fill();
      ctx.closePath();

      ctx.strokeWidth = r / 2;
      ctx.setLineDash([10, 15]);
      this.boundary.draw(ctx, strokecolor, undefined);
    }
  }
}