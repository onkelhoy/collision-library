import { Vector } from "vector";
import { InputEvents } from "input-events";
import { isPointInPolygonTriangles, SAT, TSAT } from "collision";
import { Polygon } from "polygon";

let c, ctx, timer;

let selected = null;
let creating = null;
let events = null;
const polygons = [];
let method = "normal";

window.onload = () => {
  c = document.querySelector('canvas');
  ctx = c.getContext('2d');

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  events = new InputEvents(c, { pointerlock: false });
  // mouse events
  events.mouse.on('up', handlemouseup);
  events.mouse.on('down', handlemousedown);
  events.mouse.on('move', handlemousemove);
  // keyboard events
  events.keyboard.on('enter-up', handleenter);

  document.querySelector('select').addEventListener('change', handleselectchange);
}

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);
  const checked = {};
  const collisions = {};
  for (let i=0; i<polygons.length; i++) {
    const polygon = polygons[i];

    for (let j=0; j<polygons.length; j++) 
    {
      if (i === j) continue;
      const key = `${i}x${j}`
      if (checked[key]) continue;

      // mark this and its opposite
      checked[key] = true;
      checked[`${j}x${i}`] = true;
      
      if (method === "normal")
      {
        const intersection = SAT(polygon, polygons[j])
        if (intersection)
        {
          // console.log(intersection);
          // polygon.move()
          collisions[i] = true;
          collisions[j] = true;
        }
      } 
      else 
      {
        if (TSAT(polygon, polygons[j]))
        {
          // polygon.move()
          collisions[i] = true;
          collisions[j] = true;
        }
      }
      // const intersectionrec = AABB(rec, polygons[j]);
      // if (intersectionrec)
      // {
      //   const r = new Rectangle(intersectionrec);
      //   r.draw(ctx, "red", "rgba(0, 255, 0, 0.5)");
      // }
    }

    if (selected && selected.polygon === polygon)
    {
      polygon.draw(ctx, "blue", "rgba(0, 0, 255, 0.1)");
    }
    else if (collisions[i])
    {
      polygon.draw(ctx, "green", "rgba(0, 255, 0, 0.1)");
    }
    else 
    {
      polygon.draw(ctx);
    }
  }

  if (creating)
  {
    creating.draw(ctx, "blue", "rgba(0, 0, 255, 0.1)");
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
    const add = e.target.position.Sub(selected.mouse);
    selected.polygon.verticies.forEach((v, i) => {
      v.x = selected.original[i].x + add.x;
      v.y = selected.original[i].y + add.y;
    })
  }
  // else if (creating)
  // {
  //   creating.b.x = e.clientX;
  //   creating.b.y = e.clientY;
  // }
}
function handlemousedown(e) {
  if (!creating)
  {
    // check if selection is free 
    for (const polygon of polygons)
    {
      if (isPointInPolygonTriangles(e.target.position, polygon))
      {
        selected = {
          polygon,
          mouse: e.target.position.copy(),
          original: polygon.verticies.map(v => v.copy())
        }
        break;
      }
    }
  
    if (!selected)
    {
      creating = new Polygon();
    }
  }

  draw();
}
function handlemouseup(e) {
  if (creating)
  {
    if (creating.verticies.length > 1 && Vector.Distance(e.target.position, creating.verticies[0]) <= 20)
    {
      // loop it 
      creating.recalculate();
      polygons.push(creating);
      creating = null;
    }
    else 
    {
      creating.verticies.push(e.target.position.copy());
    }
    // polygons.push(creating);
    // creating.recalculate();
    // creating = null;
  }
  else if (selected) 
  {
    selected = null;
  }

  setTimeout(() => {
    window.cancelAnimationFrame(timer);
  }, 100);
}
function handleenter(e) {
  if (creating)
  {
    creating.recalculate();
    polygons.push(creating);
    creating = null;
    draw();
    setTimeout(() => {
      window.cancelAnimationFrame(timer);
    }, 100);
  }
}