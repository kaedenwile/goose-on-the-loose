

interface Tile {

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;

}


class GrassTile implements Tile {

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#00FF66";
    ctx.fillRect(x, y, width, height);
  }

}

class WaterTile implements Tile {

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.fillStyle = "#0066FF";
    ctx.fillRect(x, y, width, height);
  }

}

class StoneTile implements Tile {

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
    [ GRASS, GRASS, GRASS, GRASS, STONE, WATER, WATER, WATER, STONE, GRASS ],
    [ GRASS, STONE, GRASS, GRASS, STONE, WATER, WATER, WATER, STONE, GRASS ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, WATER, WATER, WATER, STONE, GRASS ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, STONE, WATER, WATER, STONE, STONE ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, STONE, WATER, WATER, WATER, STONE ],
    [ GRASS, GRASS, STONE, GRASS, STONE, STONE, WATER, WATER, WATER, STONE ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, STONE, WATER, WATER, WATER, STONE ],
    [ GRASS, GRASS, GRASS, GRASS, STONE, STONE, WATER, WATER, WATER, STONE ],
  ]

}
