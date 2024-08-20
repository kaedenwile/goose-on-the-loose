import { UNIT } from "./const.ts";
import { doPhysics } from "./physics.ts";
import { GameMap } from "./map.ts";

export class Dude {

  dudeType: number;
  position: {x: number, y: number};
  action?: {
    direction: number;
    speed: number;
    cooldown: number;
  } = undefined;

  constructor(dudeType: 0 | 1, position: {x: number, y: number}) {
    this.dudeType = dudeType;
    this.position = position;
  }

  flee(goosePosition: {x: number, y: number}) {
    this.action = {
      direction: Math.atan2(this.position.y - goosePosition.y, this.position.x - goosePosition.x),
      speed: 2,
      cooldown: 2,
    }
  }

  step(gameMap: GameMap, dt: number) {
    if (!this.action || this.action.cooldown < 0) {
      this.action = {
        direction: 2 * Math.PI * Math.random(),
        speed: (Math.random() > 0.75) ? 0 : 0.6 * Math.random(),
        cooldown: 0.5 + 2 * Math.random(),
      }
    }

    this.action.cooldown -= dt;

    const newPos = doPhysics(gameMap, dt, {
      x: this.position.x + 0.5,
      y: this.position.y + 0.5
    }, {
      x: this.action.speed * Math.cos(this.action.direction),
      y: this.action.speed * Math.sin(this.action.direction),
    })
    this.position.x = newPos.x - 0.5;
    this.position.y = newPos.y - 0.5;
  }

  draw(ctx: CanvasRenderingContext2D, offset: {x: number, y: number}) {
    // ctx.fillStyle = "#FF7788";
    // ctx.fillRect(offset.x + this.position.x * UNIT, offset.y + this.position.y * UNIT, UNIT, UNIT);

    ctx.drawImage(document.getElementById("dude")! as HTMLImageElement,
      0,
      256 * this.dudeType,
      256,
      256,
      offset.x + (this.position.x - 0.5) * UNIT,
      offset.y + (this.position.y - 1) * UNIT + 4,
      2 * UNIT,
      2 * UNIT,
    );
  }

}
