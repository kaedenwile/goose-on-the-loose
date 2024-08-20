import { GameMap } from "./map.ts";

type XY = { x: number; y: number };

export function doPhysics(
  gameMap: GameMap,
  dt: number,
  characterPos: XY,
  move: XY,
): XY {
  const tile = gameMap.tileAt(characterPos);

  const newPos = {
    x: characterPos.x + tile.speed * move.x * dt,
    y: characterPos.y + tile.speed * move.y * dt,
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
        newPos.x = Math.ceil(characterPos.x) - 0.5;
      }
    }

    // if moved left
    else {
      if (gameMap.tileAt({ x: bounds().left, y: characterPos.y - 0.5 })?.barrier
        || (((characterPos.y + 0.5) % 1) && gameMap.tileAt({ x: bounds().left, y: characterPos.y + 0.5 })?.barrier)) {
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
        newPos.y = Math.ceil(characterPos.y) - 0.5;
      }
    }
    // if moved up
    else {
      if (gameMap.tileAt({ x: bounds().left, y: bounds().bottom })?.barrier
        || ((bounds().right % 1) && gameMap.tileAt({ x: bounds().right, y: bounds().bottom })?.barrier)) {
        newPos.y = Math.floor(characterPos.y) + 0.5;
      }
    }
  }

  // round on boundaries
  if ((newPos.x < characterPos.x) && (newPos.x - 0.5) % 1 < 0.01) {
    newPos.x -= ((newPos.x - 0.5) % 1);
  } else if ((newPos.x > characterPos.x) && (newPos.x - 0.5) % 1 > 0.99) {
    newPos.x += 1 - ((newPos.x - 0.5) % 1);
  }

  if ((newPos.y < characterPos.y) && (newPos.y - 0.5) % 1 < 0.01) {
    newPos.y -= ((newPos.y - 0.5) % 1);
  } else if ((newPos.y > characterPos.y) && (newPos.y - 0.5) % 1 > 0.99) {
    newPos.y += 1 - ((newPos.y - 0.5) % 1);
  }



  return newPos;

}
