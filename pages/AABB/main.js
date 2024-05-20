import { Rectangle } from "rectangle";
import { isPointInRectangle, AABB } from "collision";
import { InputEvents } from "input-events";

let c, ctx, timer, events;
let selected = null;
let creating = null;
const rectangles = [];

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
  for (let i=0; i<rectangles.length; i++) {
    const rec = rectangles[i];
    if (selected && selected.rectangle === rec)
    {
      rec.draw(ctx, "blue", "rgba(0, 0, 255, 0.1)");
    }
    else 
    {
      rec.draw(ctx);
    }

    for (let j=0; j<rectangles.length; j++) 
    {
      if (i === j) continue;
      const key = `${i}x${j}`
      if (checked[key]) continue;

      // mark this and its opposite
      checked[key] = true;
      checked[`${j}x${i}`] = true;
      
      const intersectionrec = AABB(rec, rectangles[j]);
      if (intersectionrec)
      {
        const r = new Rectangle(intersectionrec);
        r.draw(ctx, "red", "rgba(0, 255, 0, 0.5)");
      }
    }
  }

  if (creating)
  {
    ctx.beginPath();
      ctx.moveTo(creating.a.x, creating.a.y);
      ctx.lineTo(creating.b.x, creating.a.y);
      ctx.lineTo(creating.b.x, creating.b.y);
      ctx.lineTo(creating.a.x, creating.b.y);
      ctx.lineTo(creating.a.x, creating.a.y);
      ctx.stroke();
    ctx.closePath();
  }

  timer = window.requestAnimationFrame(draw);
}

// event handlers
function handlemousemove(e) {
  if (selected)
  {
    selected.rectangle.set(e.target.position.Sub(selected.offset))
  }
  else if (creating)
  {
    creating.b.set(e.target.position)
  }
}
function handlemousedown(e) {
  // check if selection is free 
  for (const rec of rectangles)
  {
    if (isPointInRectangle(e.target.position, rec))
    {
      selected = {
        rectangle: rec,
        offset: e.target.position.Sub(rec),
      }
      break;
    }
  }

  if (!selected)
  {
    creating = {
      a: e.target.position.copy(),
      b: e.target.position.copy(),
    }
  }

  draw();
}
function handlemouseup(e) {
  if (creating)
  {
    rectangles.push(new Rectangle(
      Math.min(creating.a.x, creating.b.x),
      Math.min(creating.a.y, creating.b.y),
      Math.abs(creating.a.x - creating.b.x),
      Math.abs(creating.a.y - creating.b.y)
    ));
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