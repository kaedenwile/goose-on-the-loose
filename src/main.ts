import './style.css'

let keys: Record<string, boolean> = {};
window.addEventListener("keydown", (ev) => {keys[ev.code] = true;})
window.addEventListener("keyup", (ev) => {keys[ev.code] = false;})

const canvas = document.querySelector<HTMLCanvasElement>('#game')!
const characterPos = { x: 50, y: 50 };
const speed = 200;

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
  ctx.fillStyle = "#00FF66";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(characterPos.x, characterPos.y, 32, 32);
}

requestAnimationFrame(gameLoop);
