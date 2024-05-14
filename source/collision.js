import { Vector } from "vector";

/**
 * 
 * @param {vector} p 
 * @param {vector[]} triangle 
 */
export function isPointInTriangle(p, ...triangle) {
  if (triangle.length !== 3) throw new Error(`${triangle} is not a triangle`);

  if (!pointintriangle_helper(p, triangle, 0)) return false; // a -> p
  if (!pointintriangle_helper(p, triangle, 1)) return false; // b -> p
  if (!pointintriangle_helper(p, triangle, 2)) return false; // c -> p

  return true;
}

function pointintriangle_helper(p, triangle, index) {
  const ab = Vector.Subtract(triangle[(index + 1) % triangle.length], triangle[index]); // b - a 
  const ap = Vector.Subtract(p, triangle[index]); // p - a 

  if (Vector.Cross(ab, ap) > 0) return false;

  return true;
}

/**
 * 
 * @param {Rectangle} a 
 * @param {Rectangle} b 
 * @returns boolean|rectangle
 */
export function AABB(a, b) {
  const x = AABBhelper(a, b, 'x');
  if (x === false) return false;

  const y = AABBhelper(a, b, 'y');
  if (y === false) return false
  
  return {...x, ...y};
} 
const aabb_map = {x: 'w', y: 'h'};
function AABBhelper(a, b, type = "x") {
  const min = Math.min(a[type], b[type]);
  const max = Math.max(a[type] + a[aabb_map[type]], b[type] + b[aabb_map[type]]);
  
  const global = a[aabb_map[type]] + b[aabb_map[type]];
  const local = max - min;
  if (local <= global)
  {
    return { [type]: Math.max(a[type], b[type]), [aabb_map[type]]: global - local };
  }

  return false;
}

/**
 * 
 * @param {Vector} p 
 * @param {Rectangle} rec 
 * @returns boolean
 */
export function isPointInRectangle(p, rec) {
  return p.x >= rec.x && p.x <= rec.x + rec.w && p.y >= rec.y && p.y <= rec.y + rec.h;
}

/**
 * 
 * @param {Circle} a 
 * @param {Circle} b 
 * @returns boolean|Circle
 */
export function CircleCircle(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dr = Math.sqrt(dx*dx + dy*dy);

  if (dr <= a.r + b.r) 
  {
    return {
      x: dx,
      y: dy,
      r: dr,
    }
  }

  return false;
}

/**
 * 
 * @param {Vector} p
 * @param {Circle} a 
 * @returns boolean
 */
export function isPointInCircle(p, a) {
  const dx = p.x - a.x;
  const dy = p.y - a.y;
  const dr = Math.sqrt(dx*dx + dy*dy);

  return dr <= a.r;
}

function LineLineIntersection(a, b) {
  
}