import {
  Loop,
  InputTracker,
  GraphicsTerminal,
  TerminalConfig,
  CharacterSet,
  Vector2,
  random
} from 'terminaltxt';
import io from 'socket.io-client';
import { LightCycle } from './LightCycle';
import { userControls } from './user-controls';
import { Direction } from './Direction';

const LOOP: Loop = new Loop(init, update);
const WIDTH = 100;
const HEIGHT = 50;
let socket: SocketIOClient.Socket;

let ready: boolean[] = [false, false, false];
let lost: boolean = false;

let startPosition: Vector2;
let startDirection: Direction;
let playerColor: string;

let input: InputTracker;
let cycle: LightCycle;
let term: GraphicsTerminal;

function init(): void {
  setupSocket();
  term = new GraphicsTerminal(
    {
      width: WIDTH,
      height: HEIGHT,
    } as TerminalConfig,
    new CharacterSet(' 0─│┌┐└┘╴╵╶╷║═╔╗╚╝')
  );
  // @ts-ignore
  term.cellController.container.style.display = 'none';
  border();
  LOOP.frameRate(10);
  LOOP.running(false);
}

function setupGame(): void {
  if (!ready[0] || !ready[1]) { return; }
  // @ts-ignore
  term.cellController.container.style.display = 'block';
  cycle = new LightCycle(startPosition, startDirection);
  input = userControls(cycle);
  ready[2] = true;
  LOOP.running(true);
  lost = false;
}

function stopGame() {
  ready[2] = false;
  LOOP.running(false);
  // @ts-ignore
  term.cellController.container.style.display = 'none';
  term.fill(' ');
  term.fillColor('black');
  border();
  cycle = null;
  input = null;
}

function update(): void {
  cycle.checkDestroyed(term);
  cycle.nextMove(emitMove);
  if (lost) { stopGame(); }
}

function setupSocket(): void {
  socket = io.connect('http://localhost:3000');
  socket.on('established', () => {
    console.log('established');
    ready[0] = true;
    setupGame();
  });
  socket.on('room-ready', (message) => {
    console.log('room-ready');
    if (message.idInRoom === 0) {
      startDirection = Direction.RIGHT;
      startPosition = new Vector2(Math.floor(WIDTH / 4), Math.floor(HEIGHT / 2));
      playerColor = 'orange';
    } else {
      startDirection = Direction.LEFT;
      startPosition = new Vector2(Math.floor(WIDTH * 3 / 4), Math.floor(HEIGHT / 2));
      playerColor = 'blue';
    }
    ready[1] = true;
    setupGame();
  });
  socket.on('connection-lost', () => {
    console.log('connection-lost');
    lost = true;
  });
  socket.on('player-move', (message) => {
    if (ready[2]) {
      term.setCell(message.character, message.x, message.y);
      term.update();
      term.setCellColor(message.color, message.x, message.y);
    }
  });
}

function emitMove(character: string, x: number, y: number) {
  socket.emit('move', {
    character: character,
    x: x,
    y: y,
    color: playerColor,
  })
}

function border() {
  for (let col: number = 1; col < term.getWidth() - 1; col++) {
    term.setCell('═', col, 0);
    term.setCell('═', col, term.getHeight() - 1);
  }
  for (let row: number = 1; row < term.getHeight() - 1; row++) {
    term.setCell('║', 0, row);
    term.setCell('║', term.getWidth() - 1, row);
  }
  term.setCell('╔', 0, 0);
  term.setCell('╗', term.getWidth() - 1, 0);
  term.setCell('╚', 0, term.getHeight() - 1);
  term.setCell('╝', term.getWidth() - 1, term.getHeight() - 1);
}