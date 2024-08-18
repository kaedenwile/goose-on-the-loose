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
const characterPos = { x: 4, y: 4 };
const UNIT = 64;
const speed = 3;

let lastTimestamp: DOMHighResTimeStamp = 0;

function gameLoop(timestamp: DOMHighResTimeStamp) {
  if (!timestamp) {
    lastTimestamp = timestamp;
  }

  const dt = (lastTimestamp - timestamp) / 1000;

  handleInput(dt);
  draw();
  lastTimestamp = timestamp;

  requestAnimationFrame(gameLoop);
}

function handleInput(dt: number) {
  const direction = [0, 0];

  if (keys["KeyW"]) {
    direction[1] += 1;
  }

  if (keys["KeyS"]) {
    direction[1] -= 1;
  }

  if (keys["KeyA"]) {
    direction[0] += 1;
  }

  if (keys["KeyD"]) {
    direction[0] -= 1;
  }

  // normalize direction
  if (direction[0] !== 0 && direction[1] !== 0) {
    direction[0] *= Math.SQRT1_2;
    direction[1] *= Math.SQRT1_2;
  }

  characterPos.x += speed * direction[0] * dt;
  characterPos.y += speed * direction[1] * dt;
}

function draw() {
  const ctx = canvas.getContext("2d")!;

  // FILL BG
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // DRAW MAP
  for (let r = 0; r < gameMap.height; r++) {
    for (let c = 0; c < gameMap.width; c++) {
      gameMap.tiles[r][c].draw(ctx,
        (canvas.width - UNIT) / 2 + (c - characterPos.x) * UNIT,
        (canvas.height - UNIT) / 2 + (r - characterPos.y) * UNIT,
        UNIT, UNIT);
    }
  }

  // DRAW CHARACTER
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect((canvas.width - UNIT) / 2, (canvas.height - UNIT) / 2, UNIT, UNIT);
}

requestAnimationFrame(gameLoop);
