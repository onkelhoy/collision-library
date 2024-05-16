import {Vector} from "vector";

const defaultInitSettings = {
  pointerlock: {
    unadjustedMovement: true, // speed on movement is same
  },
}

const MouseButtonMap = {
  0: "left",
  1: "wheel",
  2: "right",
}

class Mouse extends EventTarget {
  constructor(canvas, config) {
    super();
    // x = 0, y = 0
    this.position = new Vector(0, 0);
    this.movement = new Vector(0, 0);
    this.config = config;

    this.lastpointerlock = performance.now() - 1000;

    this.clicked = false;
    this.click = {
      start: null,
      end: null,
      button: null
    };

    if (config.pointerlock)
    {
      canvas.addEventListener("click", this.handlepointersetup);
      document.addEventListener("pointerlockchange", this.handlepointerlockchange, false);
      document.addEventListener("pointerlockerror", this.handlepointerlockerror, false);
    }
    else
    {
      // this.position.set(canvas.offsetLeft + canvas.width/2, canvas.offsetTop + canvas.height/2);
      document.addEventListener("mousemove", this.handlemousemove);
    }
    canvas.addEventListener("mousedown", this.handlemousedown);
    canvas.addEventListener("mouseup", this.handlemouseup);
  }

  on(eventname, callback) {
    this.addEventListener(eventname, callback);
  }

  handlemousemove = (e) => {
    if (document.pointerLockElement)
    {
      this.position.add(e.movementX, e.movementY);
      this.movement.set(e.movementX, e.movementY);
    }
    else
    {
      const dx = this.position.x - e.clientX;
      const dy = this.position.y - e.clientY;
      this.position.set(e.clientX, e.clientY);
      this.movement.set(dx, dy);
    }
    this.dispatchEvent(new Event("move"));
  }
  handlemousedown = (e) => {
    this.clicked = true;
    this.click.start = performance.now();
    this.click.end = null;
    this.click.button = MouseButtonMap[e.target.button]; // 
    this.dispatchEvent(new Event("down"));
  }
  handlemouseup = (e) => {
    this.clicked = false;
    this.click.end = performance.now();
    this.click.button = null;
    this.dispatchEvent(new Event("up"));
  }

  draw(ctx, strokecolor="black", fillcolor="rgba(0,0,0,0.1)", thickness=1) {
    ctx.fillStyle=fillcolor;
    ctx.strokeStyle=strokecolor;
    ctx.strokeWidth = thickness;

    ctx.beginPath();
    ctx.arc(InputEvents.mouse.x, InputEvents.mouse.y, 10, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
  }

  // event handlers
  handlepointersetup = (e) => {
    if (document.pointerLockElement) return;
    const canvas = e.target;
    const {clientX, clientY} = e;
    const time = Math.max(0, 1500 - (performance.now() - this.lastpointerlock));
    this.position.set(clientX, clientY);

    clearTimeout(this.pointerlocktimer);
    this.pointerlocktimer = setTimeout(() => {
      
      // REFERENCE:: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API#handling_promise_and_non-promise_versions_of_requestpointerlock
      const promise = canvas.requestPointerLock(this.config.pointerlock);
        
      if (!promise && this.config.pointerlock.unadjustedMovement) {
        console.log("disabling mouse acceleration is not supported");
        return;
      }
    
      promise
        .then(() => {
          console.log("pointer-lock")
        })
        .catch((error) => {
          console.log('pointer lock error', error)
          if (error.name === "NotSupportedError" && this.config.pointerlock.unadjustedMovement) {
            // Some platforms may not support unadjusted movement.
            // You can request again a regular pointer lock.
            return canvas.requestPointerLock();
          }
        });
    }, time)
  }
  handlepointerlockchange = (e) => {
    this.lastpointerlock = performance.now();
    if (document.pointerLockElement) {
      console.log("The pointer lock status is now locked");
      document.addEventListener("mousemove", this.handlemousemove);
    } else {
      console.log("The pointer lock status is now unlocked");
      document.removeEventListener("mousemove", this.handlemousemove, false);
    }
  }
  handlepointerlockerror = (e) => {
    console.error('pointer lock failed', e);
  }
}
class Keyboard extends EventTarget {
  constructor() {
    super();

    this.keys = {};

    document.addEventListener("keydown", this.handlekeydown);
    document.addEventListener("keyup", this.handlekeyup);
  }

  on(key, callback) {
    this.addEventListener(key, callback);
  }
  key(name) {
    return this.keys[name];
  }

  handlekeydown = (e) => {
    const name = (e.key || e.code).toLowerCase();

    if (!this.keys[name])
    {
      this.keys[name] = {clicked: false};
    }

    if (this.keys[name].clicked === false)
    {
      this.keys[name].start = performance.now();
    }

    this.keys[name].clicked = true;
    this.keys[name].stop = null;

    // this.dispatchEvent(new CustomEvent('key', { detail: {
    //   name,
    //   value: this.keys[name]
    // }}));
    this.dispatchEvent(new CustomEvent(`${name}-down`, { detail: {
      name,
      value: this.keys[name]
    }}));
    this.dispatchEvent(new CustomEvent(name, {
      name,
      value: this.keys[name]
    }));
  }
  handlekeyup = (e) => {
    const name = (e.key || e.code).toLowerCase();
    if (!this.keys[name])
    {
      throw new Error("keyup event fired but no key registered: " + name);
    }

    this.keys[name].clicked = false;
    this.keys[name].stop = performance.now();

    this.dispatchEvent(new CustomEvent(`${name}-up`, { detail: {
      name,
      value: this.keys[name]
    }}));
    this.dispatchEvent(new CustomEvent(name, {
      name,
      value: this.keys[name]
    }));
  }
}
export class InputEvents extends EventTarget {
  constructor(canvas, settings) {
    super();
    this.config = getSettings(settings);

    this.mouse = new Mouse(canvas, this.config);
    this.keyboard = new Keyboard();
    this.setupTouch(canvas);
  }

  // setups
  setupTouch(canvas) {
    // register touch events
    canvas.addEventListener("touchstart", this.handletouchstart);
    canvas.addEventListener("touchend",this. handletouchend);
    canvas.addEventListener("touchmove", this.handletouchmove);
    canvas.addEventListener("touchcancel", this.handletouchcancel);
  }

  handletouchstart = (e) => {

  }
  handletouchend = (e) => {

  }
  handletouchmove = (e) => {

  }
  handletouchcancel = (e) => {

  }
  //#endregion
}

// helper functions
function getSettings(settings) {
  const config = {
    ...defaultInitSettings,
    ...(settings || {}),
  };

  if (settings?.pointerlock === null || settings?.pointerlock === false)
  {
    config.pointerlock = null;
  }
  else
  {
    config.pointerlock = {
      ...defaultInitSettings.pointerlock,
      ...(settings?.pointerlock || {}),
    }
  }

  return config;
}