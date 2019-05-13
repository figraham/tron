import {
  Loop,
  InputTracker,
  GraphicsTerminal,
  TerminalConfig,
  CharacterSet,
  Vector2,
  random,
  OutputTerminal
} from 'terminaltxt';
import io from 'socket.io-client';
import { LightCycle } from './LightCycle';
import { userControls } from './user-controls';
import { Direction } from './Direction';

const LOOP: Loop = new Loop(init, update);
const WIDTH = 126;
const HEIGHT = 60;
let socket: SocketIOClient.Socket;

let ready: boolean[] = [false, false, false];
let lost: boolean = false;

let startPosition: Vector2;
let startDirection: Direction;
let playerColor: string;

let title: OutputTerminal;

let input: InputTracker;
let cycle: LightCycle;
let term: GraphicsTerminal;

function init(): void {
  setupTitle();
  setupSocket();
  term = new GraphicsTerminal(
    {
      width: WIDTH,
      height: HEIGHT,
      container: document.getElementById('game-container'),
    } as TerminalConfig,
    new CharacterSet(' 0─│┌┐└┘╴╵╶╷║═╔╗╚╝')
  );
  gameVisibility(false);
  border();
  LOOP.frameRate(10);
  LOOP.running(false);
}

function setupTitle(): void {
  title = new OutputTerminal(
    {
      width: WIDTH,
      height: HEIGHT,
      container: document.getElementById('title-container'),
    } as TerminalConfig
  );

  title.write(  '┌───────┐┌───────┐┌───────┐┌───┐ ┌─┐');
  title.writeln('│       ││   ┌─┐ ││       ││   └┐│ │');
  title.writeln('└─┐   ┌─┘│   │ │ ││       ││    └┘ │');
  title.writeln('  │   │  │   └─┘┌┘│ ┌─┐   ││       │');
  title.writeln('  │   │  │   ┌┐ └┐│ │ │   ││ ┌┐    │');
  title.writeln('  │   │  │   ││  ││ └─┘   ││ │└┐   │');
  title.writeln('  └───┘  └───┘└──┘└───────┘└─┘ └───┘');

  title.writeln('<a href="http://createdby.fi">createdby.fi</a>');
  title.writeln('Use arrow keys or wasd to steer.');
  title.writeln('Try not to hit walls or paths.');
}

function setupGame(): void {
  if (!ready[0] || !ready[1]) { return; }
  titleVisibility(false)
  gameVisibility(true);
  cycle = new LightCycle(startPosition, startDirection);
  input = userControls(cycle);
  ready[2] = true;
  LOOP.running(true);
  lost = false;
}

function stopGame() {
  ready[2] = false;
  LOOP.running(false);
  titleVisibility(true);
  gameVisibility(false);
  term.fill(' ');
  term.fillColor('white');
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
  title.writeln('Connecting to server...');
  socket.on('established', () => {
    title.writeln('Connection Established')
    if (!ready[1]) {
      title.writeln('Waiting for a competitor...');
    }
    ready[0] = true;
    setupGame();
  });
  socket.on('room-ready', (message) => {
    console.log('room-ready');
    if (message.idInRoom === 0) {
      startDirection = Direction.RIGHT;
      startPosition = new Vector2(Math.floor(WIDTH / 4), Math.floor(HEIGHT / 2));
      playerColor = 'cyan';
      title.writeln('You are <span style="color:cyan">blue</span>.');
    } else {
      startDirection = Direction.LEFT;
      startPosition = new Vector2(Math.floor(WIDTH * 3 / 4), Math.floor(HEIGHT / 2));
      playerColor = 'goldenrod';
      title.writeln('You are <span style="color:goldenrod">gold</span>.');
    }
    ready[1] = true;
    setupGame();
  });
  socket.on('connection-lost', () => {
    title.writeln('Your competitor\'s connection was lost!');
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

function gameVisibility(visible: boolean): void {
  if (visible) {
    // @ts-ignore
    term.cellController.container.style.display = 'block';
  } else {
    // @ts-ignore
    term.cellController.container.style.display = 'none';
  }
}

function titleVisibility(visible: boolean): void {
  if (visible) {
    // @ts-ignore
    title.lineController.container.style.display = 'block';
  } else {
    // @ts-ignore
    title.lineController.container.style.display = 'none';
  }
}