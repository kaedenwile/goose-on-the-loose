
export class Dude {

  dudeType: number;
  position: {x: number, y: number};

  constructor(dudeType: 0 | 1, position: {x: number, y: number}) {
    this.dudeType = dudeType;
    this.position = position;
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.drawImage(document.getElementById("dude")! as HTMLImageElement,
      0,
      128 * this.dudeType,
      128,
      128,
      x,
      y,
      width,
      height
    );
  }

}
