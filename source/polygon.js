import {Vector} from "vector";
import {Triangulate} from "polygon-helper";

export class Polygon {

  constructor(...verticies) {
    this.verticies = [];
    this.triangles = [];
    this.boundaryindex = null;

    for (let v of verticies) {
      this.verticies.push(new Vector(v));
    }

    if (this.verticies.length > 0)
    {
      this.triangulate();
      this.setBoundary();
    }
  }

  get boundary() {
    if (!this.boundaryindex) return null;

    return {
      x: this.verticies[this.boundaryindex[0]].x,
      y: this.verticies[this.boundaryindex[1]].y,
      w: this.verticies[this.boundaryindex[2]].x - this.verticies[this.boundaryindex[0]].x, 
      h: this.verticies[this.boundaryindex[3]].y - this.verticies[this.boundaryindex[1]].y, 
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
    this.setBoundary();
    return Triangulate(this);
  }

  setBoundary() {
    let minx = Number.MAX_SAFE_INTEGER;
    let miny = Number.MAX_SAFE_INTEGER;
    let maxx = Number.MIN_SAFE_INTEGER;
    let maxy = Number.MIN_SAFE_INTEGER;

    let minxindex = -1;
    let minyindex = -1;
    let maxxindex = -1;
    let maxyindex = -1;

    this.verticies.forEach((v, index) => {
      if (v.x < minx) 
      {
        minx = v.x;
        minxindex = index;
      }
      if (v.x > maxx) 
      {
        maxx = v.x;
        maxxindex = index;
      }
      if (v.y < miny) 
      {
        miny = v.y;
        minyindex = index;
      }
      if (v.y > maxy) 
      {
        maxy = v.y;
        maxyindex = index;
      }
    });

    this.boundaryindex = [minxindex, minyindex, maxxindex, maxyindex];
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

      const boundary = this.boundary;
      if (boundary)
      {
        ctx.beginPath();
          ctx.strokeWidth = r / 2;
          ctx.setLineDash([10, 15]);
          ctx.rect(boundary.x, boundary.y, boundary.w, boundary.h);
          ctx.stroke();
        ctx.closePath();
      }
    }
  }
}