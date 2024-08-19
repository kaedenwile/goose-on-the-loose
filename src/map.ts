const SPEED = 3;

export interface Tile {

  speed: number;
  barrier: boolean;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;

}

class VoidTile implements Tile {

  speed = SPEED;
  barrier = true;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, width, height);
  }

}

class GrassTile implements Tile {

  speed = SPEED;
  barrier = false;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#00FF66";
    ctx.fillRect(x, y, width, height);
  }

}

class WaterTile implements Tile {

  speed = SPEED / 2;
  barrier = false;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#0066FF";
    ctx.fillRect(x, y, width, height);
  }

}


class DeepWaterTile implements Tile {

  speed = SPEED / 2;
  barrier = true;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#0033AA";
    ctx.fillRect(x, y, width, height);
  }

}

class StoneTile implements Tile {

  speed = SPEED;
  barrier = true;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#666666";
    ctx.fillRect(x, y, width, height);
  }

}

const VOID = new VoidTile();
const GRASS = new GrassTile();
const WATER = new WaterTile();
const DEEP = new DeepWaterTile();
const STONE = new StoneTile();

export class GameMap {

  tiles: Tile[][];

  constructor(map: string) {
    this.tiles = map.split(/\r?\n/g).map(row => row.split("").map(tile => ({
      "G": GRASS,
      "W": WATER,
      "D": DEEP,
      "S": STONE,
      " ": VOID,
    }[tile]! as Tile)));

    console.log(map, this.tiles);
  }

  tileAt(pos: {x : number, y: number}): Tile {
    return this.tiles[Math.floor(pos.y)]?.[Math.floor(pos.x)] ?? VOID;
  }

}
