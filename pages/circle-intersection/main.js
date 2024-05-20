import { Circle } from "circle";
import { Vector } from "vector";
import { isPointInCircle, CircleIntersection } from "collision";
import { InputEvents } from "input-events";

let c, ctx, timer, events;
let selected = null;
let creating = null;
const circles = [];
let method = "segment";

window.onload = () => {
  c = document.querySelector('canvas');
  ctx = c.getContext('2d');

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  events = new InputEvents(c, { pointerlock: false });

  events.on("mouse-up", handlemouseup);
  events.on("mouse-down", handlemousedown);
  events.on("mouse-move", handlemousemove);
}

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);
  const checked = {};
  for (let i=0; i<circles.length; i++) {
    const circle = circles[i];
    if (selected && selected.circle === circle)
    {
      circle.draw(ctx, "blue", "rgba(0, 0, 255, 0.1)");
    }
    else 
    {
      circle.draw(ctx);
    }

    for (let j=0; j<circles.length; j++) 
    {
      if (i === j) continue;
      const key = `${i}x${j}`
      if (checked[key]) continue;

      // mark this and its opposite
      checked[key] = true;
      checked[`${j}x${i}`] = true;
      
      const intersect = CircleIntersection(circle, circles[j]);
      if (intersect)
      {
        const { va, vb, vc } = intersect;
        const c1 = circle;
        const c2 = circles[j];
        va.draw(ctx, "red", 10);
        vb.draw(ctx, "red", 10);
        vc.draw(ctx, "red", 10);

        ctx.beginPath();
          ctx.moveTo(va.x, va.y);
          ctx.arc(c1.x, c1.y, c1.r, Math.atan2(va.y - c1.y, va.x - c1.x), Math.atan2(vb.y - c1.y, vb.x - c1.x));
          ctx.lineTo(vb.x, vb.y);
          ctx.arc(c2.x, c2.y, c2.r, Math.atan2(vb.y - c2.y, vb.x - c2.x), Math.atan2(va.y - c2.y, va.x - c2.x));
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.fill();

        // c.draw(ctx, "red", "rgba(255,0,0,0.1)");
      }
    }
  }

  if (creating)
  {
    creating.draw(ctx, "orange", "rgba(255,165,0,0.1)");
  }
  
  timer = window.requestAnimationFrame(draw);
}

// event handlers
function handlemousemove(e) {
  if (selected)
  {
    selected.circle.set(e.target.position.Sub(selected.offset));
  }
  else if (creating)
  {
    creating.r = Vector.Distance(creating, e.target.position);
  }
}
function handlemousedown(e) {
  // check if selection is free 
  for (const circle of circles)
  {
    if (isPointInCircle(e.target.position, circle))
    {
      selected = {
        circle,
        offset: e.target.position.Sub(circle),
      }
    }
  }

  if (!selected)
  {
    creating = Circle.toCircle(e.target.position, 0);
  }

  draw();
}
function handlemouseup(e) {
  if (creating)
  {
    circles.push(creating);
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