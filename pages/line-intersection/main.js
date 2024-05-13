import { Line } from "line";
import { Vector } from "vector";
let c, ctx;

window.onload = () => {
  c = document.querySelector('canvas');
  ctx = c.getContext('2d');

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  draw();
}

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);

  const line = Line.DirectionLine(new Vector(500, 300), new Vector(5, 2));
  
  line.draw(ctx);
}