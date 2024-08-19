import './style.css'
import { GameMap } from "./map.ts";

let keys: Record<string, boolean> = {};
window.addEventListener("keydown", (ev) => {
  keys[ev.code] = true;
})
window.addEventListener("keyup", (ev) => {
  keys[ev.code] = false;
})

const canvas = document.querySelector<HTMLCanvasElement>('#game')!
const gameMap = new GameMap();
const characterPos = { x: 2.5, y: 2.5 };

const UNIT = 64;

let lastTimestamp: DOMHighResTimeStamp = 0;

function gameLoop(timestamp: DOMHighResTimeStamp) {
  if (!timestamp) {
    lastTimestamp = timestamp;
  }

  const dt = (lastTimestamp - timestamp) / 1000;

  const move = handleInput();
  physics(dt, move);
  draw();
  lastTimestamp = timestamp;

  requestAnimationFrame(gameLoop);
}

function handleInput() {
  const direction = { x: 0, y: 0 };

  if (keys["KeyW"]) {
    direction.y += 1;
  }

  if (keys["KeyS"]) {
    direction.y -= 1;
  }

  if (keys["KeyA"]) {
    direction.x += 1;
  }

  if (keys["KeyD"]) {
    direction.x -= 1;
  }

  // normalize direction
  if (direction.x !== 0 && direction.y !== 0) {
    direction.x *= Math.SQRT1_2;
    direction.y *= Math.SQRT1_2;
  }

  return direction;
}


function physics(dt: number, move: { x: number, y: number }) {
  const speed = gameMap.tileAt(characterPos)?.speed ?? 3;

  const newPos = {
    x: characterPos.x + speed * move.x * dt,
    y: characterPos.y + speed * move.y * dt,
  }

  const bounds = () => ({
    left: newPos.x - 0.5,
    right: newPos.x + 0.5,
    top: newPos.y + 0.5,
    bottom: newPos.y - 0.5,
  });

  // Check if crossed X tile boundary
  if (Math.round(newPos.x) !== Math.round(characterPos.x) || (!!(bounds().left % 1) !== !!((characterPos.x - 0.5) % 1))) {

    // if moved right
    if (newPos.x > characterPos.x) {
      // if hit barrier
      if (gameMap.tileAt({ x: bounds().right, y: characterPos.y - 0.5 })?.barrier
        || (((characterPos.y + 0.5) % 1) && gameMap.tileAt({ x: bounds().right, y: characterPos.y + 0.5 })?.barrier)) {
        console.log("HIT R", Math.ceil(characterPos.x));
        newPos.x = Math.ceil(characterPos.x) - 0.5;
      }
    }

    // if moved left
    else {
      if (gameMap.tileAt({ x: bounds().left, y: characterPos.y - 0.5 })?.barrier
        || (((characterPos.y + 0.5) % 1) && gameMap.tileAt({ x: bounds().left, y: characterPos.y + 0.5 })?.barrier)) {
        console.log("HIT L", Math.ceil(characterPos.x));
        newPos.x = Math.floor(characterPos.x) + 0.5;
      }
    }
  }

  // Check if crossed Y tile boundary
  if (Math.floor(bounds().bottom) !== Math.floor(characterPos.y - 0.5) ||
    (!!(bounds().bottom % 1) !== !!((characterPos.y - 0.5) % 1))) {

    // if moved down
    if (newPos.y > characterPos.y) {
      // if hit barrier
      if (gameMap.tileAt({ x: bounds().left, y: bounds().top })?.barrier
        || ((bounds().right % 1) && gameMap.tileAt({ x: bounds().right, y: bounds().top })?.barrier)) {
        console.log("HIT B");
        newPos.y = Math.ceil(characterPos.y) - 0.5;
      }
    }
    // if moved up
    else {
      if (gameMap.tileAt({ x: bounds().left, y: bounds().bottom })?.barrier
        || ((bounds().right % 1) && gameMap.tileAt({ x: bounds().right, y: bounds().bottom })?.barrier)) {
        console.log("HIT T");
        newPos.y = Math.floor(characterPos.y) + 0.5;
      }
    }

  }

  characterPos.x = newPos.x;
  characterPos.y = newPos.y;
}

function draw() {
  const ctx = canvas.getContext("2d")!;

  // FILL BG
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // DRAW MAP
  for (let r = 0; r < gameMap.tiles.length; r++) {
    for (let c = 0; c < gameMap.tiles[r].length; c++) {
      gameMap.tiles[r][c].draw(ctx,
        (canvas.width - UNIT) / 2 + (c - characterPos.x + 0.5) * UNIT,
        (canvas.height - UNIT) / 2 + (r - characterPos.y + 0.5) * UNIT,
        UNIT, UNIT);
    }
  }

  // DRAW CHARACTER
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect((canvas.width - UNIT) / 2, (canvas.height - UNIT) / 2, UNIT, UNIT);
}

requestAnimationFrame(gameLoop);
