import { Line } from "line";
import { Circle } from "circle";
import { isPointInCircle, LineIntersection, SegmentIntersection } from "collision";
import { InputEvents } from "input-events";

let c, ctx, timer, events;
let selected = null;
let creating = null;
const lines = [];
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

  document.querySelector('select').addEventListener('change', handleselectchange);
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

    for (let j=0; j<lines.length; j++) 
    {
      if (i === j) continue;
      const key = `${i}x${j}`
      if (checked[key]) continue;

      // mark this and its opposite
      checked[key] = true;
      checked[`${j}x${i}`] = true;
      
      let intersect;
      if (method === "segment")
      {
        intersect = SegmentIntersection(line.a, line.b, lines[j].a, lines[j].b);
      }
      else // line
      {
        intersect = LineIntersection(line.a, line.b, lines[j].a, lines[j].b); 
      }
      if (intersect)
      {
        const c = Circle.toCircle(intersect, 15);
        c.draw(ctx, "red");
      }
    }
    
  }

  if (creating)
  {
    creating.draw(ctx, "orange", 2);
  }
  
  timer = window.requestAnimationFrame(draw);
}

// event handlers
function handleselectchange(e) {
  e.stopPropagation();
  e.stopImmediatePropagation();
  e.preventDefault();
  
  const {value} = e.target;
  method = value;
  draw();
  window.cancelAnimationFrame(timer);
}
function handlemousemove(e) {
  if (selected)
  {
    selected.point = e.target.position.Sub(selected.offset);
  }
  else if (creating)
  {
    creating.b.set(e.target.position);
  }
}
function handlemousedown(e) {
  // check if selection is free 
  for (const line of lines)
  {
    if (isPointInCircle(e.target.position, Circle.toCircle(line.a, 10)))
    {
      selected = {
        point: line.a,
        line,
        offset: e.target.position.Sub(line.a),
      }
    }
    else if (isPointInCircle(e.target.position, Circle.toCircle(line.b, 10)))
    {
      selected = {
        point: line.b,
        line,
        offset: e.target.position.Sub(line.b),
      }
    }
  }

  if (!selected)
  {
    creating = new Line(
      e.target.position.copy(),
      e.target.position.copy(),
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