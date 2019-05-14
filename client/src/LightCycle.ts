import { Vector2, GraphicsTerminal, getIndex } from "terminaltxt";
import { Direction } from "./Direction";

export class LightCycle {

  public position: Vector2;

  protected direction: Direction[];
  
  public destroyed: boolean;

  constructor(position: Vector2 = new Vector2(), direction: Direction = Direction.RIGHT) {

    // bindings
    this.goUp    = this.goUp.bind(this);
    this.goDown  = this.goDown.bind(this);
    this.goLeft  = this.goLeft.bind(this);
    this.goRight = this.goRight.bind(this);

    // initialization
    this.direction = [];
    this.direction.push(direction);
    this.destroyed = false;
    this.position = position;

  }

  public goUp(): void {
    if (this.direction[this.direction.length - 1] !== Direction.DOWN) {
      this.direction.push(Direction.UP);
    }
  }

  public goDown(): void {
    if (this.direction[this.direction.length - 1] !== Direction.UP) {
      this.direction.push(Direction.DOWN);
    }
  }

  public goLeft(): void {
    if (this.direction[this.direction.length - 1] !== Direction.RIGHT) {
      this.direction.push(Direction.LEFT);
    }
  }

  public goRight(): void {
    if (this.direction[this.direction.length - 1] !== Direction.LEFT) {
      this.direction.push(Direction.RIGHT);
    }
  }

  protected move(): void {
    // TODO change add when Vector2 is fixed.
    switch (this.direction[0]) {
      case Direction.UP:
        this.position.add(new Vector2(0, -1));
        break;
      case Direction.DOWN:
        this.position.add(new Vector2(0, 1));
        break;
      case Direction.LEFT:
        this.position.add(new Vector2(-1, 0));
        break;
      case Direction.RIGHT:
        this.position.add(new Vector2(1, 0));
        break;
    }
  }

  public checkDestroyed(term: GraphicsTerminal, whenDestroyed: Function): void {
    if (this.destroyed) { return; }
    if (
      this.position.x <= 0                ||
      this.position.y <= 0                ||
      this.position.x >= term.getWidth()  ||
      this.position.y >= term.getHeight()
    ) {
      this.destroyed = true;
      whenDestroyed(this.position.x, this.position.y);
    }
    // @ts-ignore
    if (term.cellData.getCell(getIndex(this.position.x, this.position.y, term.cellController)) !== 0) {
      this.destroyed = true;
      whenDestroyed(this.position.x, this.position.y);
    }
  }

  public nextMove(callback: Function): void { // todo function type
    if (this.destroyed) {
      return;
    }
    callback(this.getCharacter(), this.position.x, this.position.y);
    while(this.direction.length > 1) {
      this.direction.shift();
    };
    this.move();
  }

  protected getCharacter(): string {
    if (this.direction.length < 1) {
      throw new Error(`LightCycle direction array is empty! ${JSON.stringify(this)}`);
    }
    if (this.direction.length > 1) {
      if (
        this.direction[0] === Direction.LEFT  && this.direction[1] === Direction.UP    ||
        this.direction[0] === Direction.DOWN  && this.direction[1] === Direction.RIGHT
      ) { return '└'; }
      else if (
        this.direction[0] === Direction.RIGHT && this.direction[1] === Direction.UP    ||
        this.direction[0] === Direction.DOWN  && this.direction[1] === Direction.LEFT
      ) { return '┘'; }
      else if (
        this.direction[0] === Direction.LEFT  && this.direction[1] === Direction.DOWN  ||
        this.direction[0] === Direction.UP    && this.direction[1] === Direction.RIGHT
      ) { return '┌'; }
      else if (
        this.direction[0] === Direction.RIGHT && this.direction[1] === Direction.DOWN  ||
        this.direction[0] === Direction.UP    && this.direction[1] === Direction.LEFT
      ) { return '┐'; }
    }
    if (this.direction[0] === Direction.UP || this.direction[0] === Direction.DOWN) {
      return '│';
    }
    return '─';
  }

}