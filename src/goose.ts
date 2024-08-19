
export enum GooseState {
  Standing,
  WalkingLeft,
  WalkingRight,
  Honking
}

const framesByState = {
  [GooseState.Standing]: [0],
  [GooseState.WalkingLeft]: [1,2,3,4,5,6,7],
  [GooseState.WalkingRight]: [1,2,3,4,5,6,7],
  [GooseState.Honking]: [7, 8, 9, 9, 8, 7, 7],
}
const FPS = 150;

export class Goose {

  state: GooseState = GooseState.Standing;
  stateStart: number = 0;

  setState(state: GooseState, timestamp: DOMHighResTimeStamp) {
    if (this.state === state) return;

    this.state = state;
    this.stateStart = timestamp;
  }

  draw(ctx: CanvasRenderingContext2D, timestamp: DOMHighResTimeStamp, x: number, y: number, width: number, height: number) {
    const frames = framesByState[this.state];
    const currentFrame = frames[Math.floor(((timestamp - this.stateStart) / ( FPS))) % frames.length];

    console.log(currentFrame, Math.floor(currentFrame / 2), (currentFrame % 2))

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
  }

}
