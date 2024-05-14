import { Line } from "line";
import { Circle } from "circle";
import { Vector } from "vector";
import { isPointInCircle } from "collision";

let c, ctx, timer;
let selected = null;
let creating = null;
const lines = [];

window.onload = () => {
  c = document.querySelector('canvas');
  ctx = c.getContext('2d');

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  window.addEventListener("mousemove", handlemousemove);
  window.addEventListener("mousedown", handlemousedown);
  window.addEventListener("mouseup", handlemouseup);
}

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);
  const checked = {};
  for (let i=0; i<lines.length; i++) {
    const line = lines[i];
    if (selected && selected.line === line)
    {
      line.draw(ctx, "blue", 2);
    }
    else 
    {
      line.draw(ctx);
    }

    // for (let j=0; j<rectangles.length; j++) 
    // {
    //   if (i === j) continue;
    //   const key = `${i}x${j}`
    //   if (checked[key]) continue;

    //   // mark this and its opposite
    //   checked[key] = true;
    //   checked[`${j}x${i}`] = true;
      
    //   const intersectionrec = AABB(rec, rectangles[j]);
    //   if (intersectionrec)
    //   {
    //     const r = new Rectangle(intersectionrec);
    //     r.draw(ctx, "red", "rgba(255, 0, 0, 0.5)");
    //   }
    // }
    
  }

  if (creating)
  {
    creating.draw(ctx, "orange", 2);
  }
  
  timer = window.requestAnimationFrame(draw);
}

// event handlers
function handlemousemove(e) {
  if (selected)
  {
    selected.point.x = e.clientX - selected.offset.x;
    selected.point.y = e.clientY - selected.offset.y;
  }
  else if (creating)
  {
    creating.b.x = e.clientX;
    creating.b.y = e.clientY;
  }
}
function handlemousedown(e) {
  // check if selection is free 
  const p = {x:e.clientX,y:e.clientY};
  for (const line of lines)
  {
    if (isPointInCircle(p, Circle.toCircle(line.a, 10)))
    {
      selected = {
        point: line.a,
        line,
        offset: new Vector(e.clientX - line.a.x, e.clientY - line.a.y),
      }
    }
    else if (isPointInCircle(p, Circle.toCircle(line.b, 10)))
    {
      selected = {
        point: line.b,
        line,
        offset: new Vector(e.clientX - line.b.x, e.clientY - line.b.y),
      }
    }
  }

  if (!selected)
  {
    creating = new Line(
      new Vector(e.clientX, e.clientY),
      new Vector(e.clientX, e.clientY),
    );
  }

  draw();
}
function handlemouseup(e) {
  if (creating)
  {
    lines.push(creating);
    creating = null;
  }
  else if (selected) 
  {
    selected = null;
  }

  setTimeout(() => {
    window.cancelAnimationFrame(timer);
  }, 100);
}