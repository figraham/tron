import {
  Loop,
  InputTracker,
  GraphicsTerminal,
  TerminalConfig,
  CharacterSet,
  Vector2,
  OutputTerminal,
  getIndex
} from 'terminaltxt';
import io from 'socket.io-client';
import { LightCycle } from './LightCycle';
import { userControls } from './user-controls';
import { Direction } from './Direction';
import { ObstacleConfiguration } from './ObstacleConfiguration';

const LOOP: Loop = new Loop(init, update);
const WIDTH = 126;
const HEIGHT = 60;

let socket: SocketIOClient.Socket;
let socketsInRoom: string[][] = [];
let socketEstablished: boolean = false;
let gameScreenReady: boolean = false;
let competitorConnected: boolean = false;
let nextLevelStartTime: number;

let startPosition: Vector2;
let startDirection: Direction;
let playerColor: string;

let title: OutputTerminal;

let input: InputTracker;
let cycle: LightCycle;
let term: GraphicsTerminal;

let playerScore: number = 0;
let level: number = 0;
let obstaclesConfigurations: ObstacleConfiguration[] = [];

function init(): void {
  setupTitle();
  setupSocket();
  setupObstacles();
  term = new GraphicsTerminal(
    {
      width: WIDTH,
      height: HEIGHT,
      container: document.getElementById('game-container'),
    } as TerminalConfig,
    new CharacterSet(' █─│┌┐└┘║═╔╗╚╝')
  );
  gameVisibility(false);
  drawBox(0, 0, WIDTH, HEIGHT);
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
  if (!socketEstablished || !competitorConnected) {
    location.reload(true); // Reload page, something went wrong.
    return;
  }
  titleVisibility(false)
  gameVisibility(true);
  obstacles();
  cycle = new LightCycle(Vector2.copy(startPosition), startDirection);
  input = userControls(cycle);
  gameScreenReady = true;
  LOOP.running(true);
}

function stopGame() {
  gameScreenReady = false;
  LOOP.running(false);
  term.fill(' ');
  term.fillColor('white');
  titleVisibility(true);
  gameVisibility(false);
  drawBox(0, 0, WIDTH, HEIGHT);
  cycle = null;
  input = null;
}

function update(): void {
  if (competitorConnected && cycle) { 
    cycle.checkDestroyed(term, emitDestroyed);
    cycle.nextMove(emitMove);
  } else if (!competitorConnected) {
    LOOP.running(false);
    stopGame();
  }
}

function setupSocket(): void {
  socket = io.connect('http://localhost:3000');
  title.writeln('Connecting to server...');

  socket.on('established', () => {
    title.writeln('Connection Established')
    if (!competitorConnected) {
      title.writeln('Waiting for a competitor...');
      title.writeln('This is dependent on someone else visiting the site.');
    }
    socketEstablished = true;
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
    competitorConnected = true;
    socketsInRoom.push(message.socketIDs);
    startTime(timeToStart, socketsInRoom[0]);
  });

  socket.on('connection-lost', () => {
    title.writeln('Your competitor\'s connection was lost!');
    title.writeln('Your score has been reset.');
    title.newLine();
    competitorConnected = false;
    socketsInRoom.shift();
    playerScore = 0;
  });

  socket.on('player-move', (message) => {
    if (gameScreenReady) {
      term.setCell(message.character, message.x, message.y);
      term.update();
      term.setCellColor(message.color, message.x, message.y);
    }
  });

  socket.on('player-destroyed', (message) => {
    if (gameScreenReady) {
      for (let xOff: number = -2; xOff <= 2; xOff++) {
        for (let yOff: number = -2; yOff <= 2; yOff++) {
          let x = message.x + xOff;
          let y = message.y + yOff;
          let dist = Math.sqrt(xOff * xOff + yOff * yOff);
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
    nextLevelStartTime = message.nextLevelTime;
    setTimeout(() => {
      checkScore();
      stopGame();
      nextLevel();
    }, 1000);
  });

}

function startTime(timeToStart: number, socketsAtStart: string[]): void {
  setTimeout(() => {
    if (competitorConnected && socketsAtStart === socketsInRoom[0] && !gameScreenReady) {
      if (timeToStart > 1000) {
        const time: number = Math.floor(timeToStart / 1000);
        title.overwrite(`Game Starting in ${time}`);
        startTime(timeToStart - 1000, socketsAtStart);
      } else {
        title.writeln('Started!');
        title.newLine();
        setupGame();
      }
    }
  }, 1000);
}

function checkScore(): void {
  if (cycle && !cycle.destroyed) {
    playerScore++;
  }
  title.overwrite(`Your score is: ${playerScore}`);
}

function nextLevel() {
  level++;
  startTime(nextLevelStartTime - Date.now(), socketsInRoom[0]);
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

function drawBox(x: number, y: number, width: number, height: number) {
  let x2 = x + width;
  let y2 = y + height;
  for (let col: number = x + 1; col < x2 - 1; col++) {
    term.setCell('═', col, y);
    term.setCell('═', col, y2 - 1);
  }
  for (let row: number = y + 1; row < y2 - 1; row++) {
    term.setCell('║', x, row);
    term.setCell('║', x2 - 1, row);
  }
  term.setCell('╔', x, y);
  term.setCell('╗', x2 - 1, y);
  term.setCell('╚', x, y2 - 1);
  term.setCell('╝', x2 - 1, y2 - 1);
}

function setupObstacles() {
  obstaclesConfigurations.push({x: 60, y: 20, width: 6, height: 20} as ObstacleConfiguration);
  obstaclesConfigurations.push({x: 22, y: 10, width: 32, height: 16} as ObstacleConfiguration);
  obstaclesConfigurations.push({x: 72, y: 10, width: 32, height: 16} as ObstacleConfiguration);
  obstaclesConfigurations.push({x: 22, y: 34, width: 32, height: 16} as ObstacleConfiguration);
  obstaclesConfigurations.push({x: 72, y: 34, width: 32, height: 16} as ObstacleConfiguration);
}

function obstacles() {
  if (!(level === 0)) {
    let start = 0;
    let stop = obstaclesConfigurations.length;
    if (level === 1) {
      stop = 1;
    } if (level === 2) {
      start = 1;
    }
    for (let i: number = start; i < stop; i++) {
      drawBox(obstaclesConfigurations[i].x, obstaclesConfigurations[i].y, obstaclesConfigurations[i].width, obstaclesConfigurations[i].height);
    }
  }
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
