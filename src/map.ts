const SPEED = 3;

export interface Tile {

  speed: number;
  barrier: boolean;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;

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

class StoneTile implements Tile {

  speed = SPEED;
  barrier = true;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#666666";
    ctx.fillRect(x, y, width, height);
  }

}

const GRASS = new GrassTile();
const WATER = new WaterTile();
const STONE = new StoneTile();

export class GameMap {

  width = 10;
  height = 10;

  tiles: Tile[][] = [
    [ GRASS, GRASS, GRASS, GRASS, STONE, STONE, WATER, WATER, STONE, GRASS ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, WATER, WATER, WATER, STONE, GRASS ],
    [ GRASS, GRASS, GRASS, GRASS, GRASS, WATER, WATER, WATER, STONE, GRASS ],
    [ GRASS, STONE, GRASS, GRASS, GRASS, WATER, WATER, WATER, STONE, GRASS ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, WATER, WATER, WATER, STONE, GRASS ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, STONE, WATER, WATER, STONE, STONE ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, STONE, WATER, WATER, WATER, STONE ],
    [ STONE, STONE, STONE, GRASS, STONE, STONE, WATER, WATER, WATER, STONE ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, STONE, WATER, WATER, WATER, STONE ],
    [ GRASS, STONE, GRASS, GRASS, STONE, STONE, WATER, WATER, WATER, STONE ],
  ]

  tileAt(pos: {x : number, y: number}): Tile | undefined {
    return this.tiles[Math.floor(pos.y)]?.[Math.floor(pos.x)];
  }

}
