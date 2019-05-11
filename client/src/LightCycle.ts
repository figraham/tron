import { Vector2, GraphicsTerminal } from "terminaltxt";
import { Direction } from "./Direction";

export class LightCycle {

  public path: Vector2[];

  public nextDirection: Direction | null;
  public direction: Direction;
  public previousDirection: Direction;
  
  public destroyed: boolean;

  constructor(startPosition: Vector2 = new Vector2(), direction: Direction = Direction.RIGHT) {

    // bindings
    this.goUp    = this.goUp.bind(this);
    this.goDown  = this.goDown.bind(this);
    this.goLeft  = this.goLeft.bind(this);
    this.goRight = this.goRight.bind(this);

    // initialization
    this.nextDirection = null;
    this.direction = direction;
    this.previousDirection = this.direction;
    this.destroyed = false;

    this.path = [];
    this.path.push(startPosition);

  }

  public goUp(): void {
    if (this.direction !== Direction.DOWN) {
      this.nextDirection = Direction.UP;
    }
  }

  public goDown(): void {
    if (this.direction !== Direction.UP) {
      this.nextDirection = Direction.DOWN;
    }
  }

  public goLeft(): void {
    if (this.direction !== Direction.RIGHT) {
      this.nextDirection = Direction.LEFT;
    }
  }

  public goRight(): void {
    if (this.direction !== Direction.LEFT) {
      this.nextDirection = Direction.RIGHT;
    }
  }

  public toString(): string {
    return `LightCycle - Direction: ${this.direction} - Path: ${JSON.stringify(this.path)}`;
  }

  public move(): void {
    if (this.destroyed) {
      return;
    }
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

  public checkBoundaries(xMin: number, yMin: number, xMax: number, yMax: number): void {
    if (
      this.path[this.path.length - 1].x <= xMin ||
      this.path[this.path.length - 1].y <= yMin ||
      this.path[this.path.length - 1].x >= xMax ||
      this.path[this.path.length - 1].y >= yMax
    ) {
      this.destroyed = true;
    }
  }

  public render(term: GraphicsTerminal): void {
    if (this.nextDirection !== null) {
      this.previousDirection = this.direction;
      this.direction = this.nextDirection;
      this.nextDirection = null;
    }
    let char = '0';
    switch (this.direction) {
      case Direction.UP:
        switch (this.previousDirection) {
          case Direction.UP:
          char = '│';
            break;
          case Direction.LEFT:
          char = '└';
            break;
          case Direction.RIGHT:
          char = '┘';
            break;
        }
        break;
      case Direction.DOWN:
        switch (this.previousDirection) {
          case Direction.DOWN:
          char = '│';
            break;
          case Direction.LEFT:
          char = '┌';
            break;
          case Direction.RIGHT:
          char = '┐';
            break;
        }
        break;
      case Direction.LEFT:
        switch (this.previousDirection) {
          case Direction.LEFT:
          char = '─';
            break;
          case Direction.UP:
          char = '┐';
            break;
          case Direction.DOWN:
          char = '┘';
            break;
        }
        break;
      case Direction.RIGHT:
        char = '─';
        switch (this.previousDirection) {
          case Direction.UP:
          char = '┌';
            break;
          case Direction.DOWN:
          char = '└';
            break;
        }
        break;
    }
    term.setCell(char, this.path[this.path.length - 1].x, this.path[this.path.length - 1].y);
    term.update();
    this.previousDirection = this.direction;
    this.move();
  }

}