const SPEED = 3;

export interface Tile {

  speed: number;
  barrier: boolean;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;

}

class EasterEggTile implements Tile {

  speed = SPEED * 2;
  barrier = false;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, width, height);
  }

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

export class DoorTile implements Tile {

  speed = SPEED;
  barrier = false;
  doorId: string;

  constructor(doorId: string) {
    this.doorId = doorId;
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#FF7788";
    ctx.fillRect(x, y, width, height);
  }

}


const VOID = new VoidTile();
const EGG = new EasterEggTile();
const GRASS = new GrassTile();
const WATER = new WaterTile();
const DEEP = new DeepWaterTile();
const STONE = new StoneTile();

const charMap: Record<string, Tile> = {
  "*": GRASS,
  "G": GRASS,
  "W": WATER,
  "D": DEEP,
  "S": STONE,
  " ": VOID,
  "`": EGG,
} as const;

export class GameMap {

  start: { x: number, y: number };
  tiles: Tile[][];
  doorPaths: { [doorId: string]: {
    mapId: string,
    at: { x: number, y: number }
  }};

  constructor(file: string) {
    this.start = { x: 1, y: 1 };

    const [map, paths] = file.split("===");

    this.tiles = map.split(/\r?\n/g).map(((row, rowIdx) => row.split("").map(((tile, colIdx) => {
      if (/\d/.test(tile)) {
        return new DoorTile(tile);
      } else if (tile === "*") {
        this.start = { x: colIdx, y: rowIdx };
      }

      if (!charMap[tile]) {
        throw Error(`Unknown tile: ${tile}`);
      }

      return charMap[tile];
    }))));

    this.doorPaths = Object.fromEntries(
      paths.split(/r?\n/g)
        .map(line => line.replace(/\s/g, ""))
        .filter(a => a) // remove blank lines
        .map(line => {
          const [doorId, mapId, x, y] = line.split(/[-,@]/g);
         return [
           doorId,
           { mapId, at: {x: parseInt(x),y: parseInt(y)}}
         ]
        })
    )
  }

  tileAt(pos: { x: number, y: number }): Tile {
    return this.tiles[Math.floor(pos.y)]?.[Math.floor(pos.x)] ?? VOID;
  }

}
