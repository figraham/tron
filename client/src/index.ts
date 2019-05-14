import {
  Loop,
  InputTracker,
  GraphicsTerminal,
  TerminalConfig,
  CharacterSet,
  Vector2,
  random,
  OutputTerminal,
  getIndex
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
    new CharacterSet(' █─│┌┐└┘║═╔╗╚╝')
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
  cycle.checkDestroyed(term, emitDestroyed);
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
      title.writeln('This is dependent on someone else visiting the site.');
    }
    ready[0] = true;
    // setupGame();
  });
  socket.on('room-ready', (message) => {
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
    let timeToStart = message.gameStartTime - Date.now();
    setTimeout(() => {
      ready[1] = true;
      setupGame();
    }, timeToStart);
    startTime(timeToStart);
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
  socket.on('player-destroyed', (message) => {
    if (ready[2]) {
      for (let xOff: number = -2; xOff <= 2; xOff++) {
        for (let yOff: number = -2; yOff <= 2; yOff++) {
          let x = message.x + xOff;
          let y = message.y + yOff;
          let dist = Math.sqrt(xOff * xOff + yOff * yOff);
          console.log(dist * 10);
          setTimeout(() => {
            // @ts-ignore
            if (term.cellData.getCell(getIndex(x, y, term.cellData)) >= 0 && term.cellData.getCell(getIndex(x, y, term.cellData)) <= 7) { // TODO remove hard coded values
              term.setCell('█', x, y);
              term.update();
              term.setCellColor('white', x, y);
            }
          }, dist * 20)
          setTimeout(() => {
            // @ts-ignore
            if (term.cellData.getCell(getIndex(x, y, term.cellData)) >= 0 && term.cellData.getCell(getIndex(x, y, term.cellData)) <= 7) { // TODO remove hard coded values
              term.setCell(' ', x, y);
              term.update();
            }
          }, dist * 40)
        }
      }
    }
  });
}

function startTime(timeToStart: number): void {
  setTimeout(() => {
    if (timeToStart > 1000) {
      const time: number = Math.floor(timeToStart / 1000);
      title.overwrite(`Game Starting in ${time}`);
      startTime(timeToStart - 1000);
    } else {
      title.writeln('Started!');
    }
  }, 1000);
}

function emitMove(character: string, x: number, y: number) {
  socket.emit('move', {
    character: character,
    x: x,
    y: y,
    color: playerColor,
  })
}

function emitDestroyed(x: number, y: number): void {
  socket.emit('destroyed', {
    x: x,
    y: y,
  });
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
    document.getElementById('game').style.display = 'flex';
  } else {
    document.getElementById('game').style.display = 'none';
  }
}

function titleVisibility(visible: boolean): void {
  if (visible) {
    document.getElementById('title').style.display = 'flex';
  } else {
    document.getElementById('title').style.display = 'none';
  }
}