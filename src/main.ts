import './style.css'
import { DoorTile, GameMap } from "./map.ts";

import { FPS, framesByState, Goose, GooseDirection, GooseState } from "./goose.ts";
import { Dude } from "./dude.ts";
import { UNIT } from "./const.ts";
import { doPhysics } from "./physics.ts";

const Maps = Object.fromEntries(await Promise.all([
  "MAP1_1",
  "MAP1_2",
  "MAP1_3",
  "MAP2",
].map(async (map) => [map, new GameMap(await (await fetch(`/levels/${map}.txt`)).text())])));

let keys: Record<string, boolean> = {};
let pressed: Record<string, boolean> = {};
window.addEventListener("keydown", (ev) => {
  if (!keys[ev.code]) pressed[ev.code] = true;
  keys[ev.code] = true;
})
window.addEventListener("keyup", (ev) => {
  keys[ev.code] = false;
})

const canvas = document.querySelector<HTMLCanvasElement>('#game')!
// let gameMap: GameMap = Maps.MAP2;
let gameMap: GameMap = Maps.MAP1_1;
let characterPos = { x: gameMap.start.x + 0.5, y: gameMap.start.y + 0.5 };
const goose = new Goose();
let  dudes = gameMap.dudeSpawns.map(pos => new Dude(Math.floor(Math.random() * 2) as 0 | 1, pos))

let lastTimestamp: DOMHighResTimeStamp = 0;
function gameLoop(timestamp: DOMHighResTimeStamp) {
  if (!timestamp) {
    lastTimestamp = timestamp;
  }

  const dt = (timestamp - lastTimestamp) / 1000;

  dudes.forEach(dude => dude.step(gameMap, dt));

  const move = handleInput(timestamp);
  physics(dt, move);
  draw(timestamp);
  lastTimestamp = timestamp;

  requestAnimationFrame(gameLoop);
}

function handleInput(timestamp: DOMHighResTimeStamp) {
  const direction = { x: 0, y: 0 };

  if (keys["KeyW"]) {
    direction.y -= 1;
  }

  if (keys["KeyS"]) {
    direction.y += 1;
  }

  if (keys["KeyA"]) {
    direction.x -= 1;
  }

  if (keys["KeyD"]) {
    direction.x += 1;
  }

  // normalize direction
  if (direction.x !== 0 && direction.y !== 0) {
    direction.x *= Math.SQRT1_2;
    direction.y *= Math.SQRT1_2;
  }

  if (direction.x < 0) {
    goose.facing = GooseDirection.Left;
  } else if (direction.x > 0) {
    goose.facing = GooseDirection.Right;
  }

  if (pressed["Space"]) {
    goose.setState(GooseState.HonkingStart, timestamp, true);
    direction.x = 0;
    direction.y = 0;
    dudes.forEach(dude => dude.flee(characterPos));
  } else if ([GooseState.HonkingStart, GooseState.Honking, GooseState.HonkingEnd].includes(goose.state)) {
    direction.x = 0;
    direction.y = 0;

    if (goose.state === GooseState.HonkingStart && timestamp - goose.stateStart > FPS * framesByState[GooseState.HonkingStart].length - 1) {
      goose.setState(GooseState.Honking, timestamp);
    } else if (goose.state === GooseState.Honking && !keys["Space"]) {
      goose.setState(GooseState.HonkingEnd, timestamp);
    } else if (goose.state === GooseState.HonkingEnd && timestamp - goose.stateStart > FPS * framesByState[GooseState.HonkingEnd].length - 1) {
      goose.setState(GooseState.Standing, timestamp);
    }
  } else if (direction.x || direction.y) {
    goose.setState(GooseState.Walking, timestamp);
  } else {
    goose.setState(GooseState.Standing, timestamp);
  }

  pressed = {};
  return direction;
}


function physics(dt: number, move: { x: number, y: number }) {
  const tile = gameMap.tileAt(characterPos);
  const newPos = doPhysics(gameMap, dt, characterPos, move);

  characterPos.x = newPos.x;
  characterPos.y = newPos.y;

  // Try and go through doors
  if (tile instanceof DoorTile) {
    const { mapId, at: {x, y} } = gameMap.doorPaths[tile.doorId]
    gameMap = Maps[mapId];
    characterPos = { x: x + 0.5, y: y + 0.5 };
    dudes = gameMap.dudeSpawns.map(pos => new Dude(Math.floor(Math.random() * 2) as 0 | 1, pos))
  }
}

function draw(timestamp: DOMHighResTimeStamp) {
  const ctx = canvas.getContext("2d")!;

  // FILL BG
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const offset = {
    x: (canvas.width - UNIT) / 2 - (characterPos.x - 0.5) * UNIT,
    y: (canvas.height - UNIT) / 2 - (characterPos.y - 0.5) * UNIT,
  }

  // DRAW MAP
  for (let r = 0; r < gameMap.tiles.length; r++) {
    for (let c = 0; c < gameMap.tiles[r].length; c++) {
      gameMap.tiles[r][c].draw(ctx,
        Math.round(offset.x + c * UNIT),
        Math.round(offset.y + r * UNIT),
        UNIT, UNIT);
    }
  }

  // DRAW DUDES THAT ARE BEHIND
  dudes
    .filter(dude => dude.position.y + 0.5 < characterPos.y)
    .forEach(dude => dude.draw(ctx, offset));

  // DRAW CHARACTER
  goose.draw(ctx, timestamp, canvas);

  // DRAW DUDES THAT ARE IN FRONT
  dudes
    .filter(dude => dude.position.y + 0.5 >= characterPos.y)
    .forEach(dude => dude.draw(ctx, offset));
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
requestAnimationFrame(gameLoop);
