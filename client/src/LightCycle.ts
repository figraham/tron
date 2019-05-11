import { Vector2 } from "terminaltxt";
import { Direction } from "./Direction";

export class LightCycle {

  public path: Vector2[];

  public direction: Direction;

  constructor(startPosition: Vector2 = new Vector2(), direction: Direction = Direction.RIGHT) {

    // bindings
    this.goUp    = this.goUp.bind(this);
    this.goDown  = this.goDown.bind(this);
    this.goLeft  = this.goLeft.bind(this);
    this.goRight = this.goRight.bind(this);

    // initialization
    this.direction = direction;

    this.path = [];
    this.path.push(startPosition);

  }

  public goUp(): void {
    if (this.direction !== Direction.DOWN) {
      this.direction = Direction.UP;
    }
  }

  public goDown(): void {
    if (this.direction !== Direction.UP) {
      this.direction = Direction.DOWN;
    }
  }

  public goLeft(): void {
    if (this.direction !== Direction.RIGHT) {
      this.direction = Direction.LEFT;
    }
  }

  public goRight(): void {
    if (this.direction !== Direction.LEFT) {
      this.direction = Direction.RIGHT;
    }
  }

  public toString(): string {
    return `LightCycle - Direction: ${this.direction} - Path: ${JSON.stringify(this.path)}`;
  }

  public move(): void {
    let next: Vector2 = Vector2.copy(this.path[this.path.length - 1]);
    // TODO change add when Vector2 is fixed.
    switch (this.direction) {
      case Direction.UP:
        next.add(new Vector2(0, -1));
        break;
      case Direction.DOWN:
        next.add(new Vector2(0, 1));
        break;
      case Direction.LEFT:
        next.add(new Vector2(-1, 0));
        break;
      case Direction.RIGHT:
        next.add(new Vector2(1, 0));
        break;
    }
    this.path.push(next);
  }

}