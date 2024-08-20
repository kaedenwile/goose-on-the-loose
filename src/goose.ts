export enum GooseDirection {
  Left,
  Right
}

export enum GooseState {
  Standing,
  Walking,
  HonkingStart,
  Honking,
  HonkingEnd,
}
export const framesByState = {
  [GooseState.Standing]: [0],
  [GooseState.Walking]: [1,1,2,2,3,3,4,4,5,5,6,6,7,7],
  [GooseState.HonkingStart]: [8],
  [GooseState.Honking]: [9],
  [GooseState.HonkingEnd]: [8],
}
export const FPS = 75;

export class Goose {

  state: GooseState = GooseState.Standing;
  stateStart: number = 0;

  facing: GooseDirection = GooseDirection.Left;

  setState(state: GooseState, timestamp: DOMHighResTimeStamp, override = false) {
    if (!override && this.state === state) return;

    this.state = state;
    this.stateStart = timestamp;
  }

  draw(ctx: CanvasRenderingContext2D, timestamp: DOMHighResTimeStamp, x: number, y: number, width: number, height: number) {
    const frames = framesByState[this.state];
    const currentFrame = frames[Math.floor(((timestamp - this.stateStart) / ( FPS))) % frames.length];

    ctx.save();

    if (this.facing === GooseDirection.Right) {
      ctx.scale(-1, 1);
      width *= -1;
      x *= -1;
    }

    ctx.drawImage(document.getElementById("goose")! as HTMLImageElement,
      128 * (currentFrame % 2),
      128 * Math.floor(currentFrame / 2),
      128,
      128,
      x,
      y,
      width,
      height
    );

    ctx.restore();
  }

}
