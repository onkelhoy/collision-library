export class Vector {
  constructor(x, y, z = 0) {
    if (typeof x === "object")
    {
      this.x = x.x || 0;
      this.y = x.y || 0;
      this.z = x.z || 0;
    }
    else 
    {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  subtractFrom(b) {
    const v = Vector.toVector(b);

    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
  }
  addFrom(b) {
    const v = Vector.toVector(b);

    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }
  multiplyFrom(b) {
    const v = Vector.toVector(b);

    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
  }


  subtract(b) {
    const v = Vector.Copy(this);

    v.x -= b.x;
    v.y -= b.y;
    v.z -= b.z;

    return v;
  }
  add(b) {
    const v = Vector.Copy(this);

    v.x += b.x;
    v.y += b.y;
    v.z += b.z;

    return v;
  }
  multiply(b) {
    const v = Vector.Copy(this);

    v.x *= b.x;
    v.y *= b.y;
    v.z *= b.z;

    return v;
  }

  draw(ctx, color = "black", r = 1) {
    return Vector.Draw(this, ctx, color, r);
  }
  
  // helper function 
  static toVector(v) {
    if (typeof v === "number") 
    {
      return new Vector(v, v);
    }

    if (v instanceof Vector) 
    {
      return v;
    }
    if (typeof v === "object")
    {
      return new Vector(v);
    }

    throw new Error(`This ${v} could not be reshaped into a vector`);
  }

  static Multiply(a, b) {
    return Vector.Copy(Vector.toVector(a)).multiplyFrom(b);
  }
  static Add(a, b) {
    return Vector.Copy(Vector.toVector(a)).addFrom(b);
  }
  static Subtract(a, b) {
    const v = Vector.Copy(Vector.toVector(a));
    v.subtractFrom(b);
    return v;
  }

  static Copy(v) {
    return new Vector(v);
  }

  static CrossProduct(a, b) {
    return new Vector(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.y * b.x - a.x * b.y,
    )
  }
  static Cross(a, b) {
    return a.y * b.x - a.x * b.y;
  }

  static Draw(v, ctx, color = "black", r = 1) {
    v = Vector.toVector(v);
    ctx.beginPath();
      ctx.arc(v.x, v.y, r/2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    ctx.closePath();
  }
}