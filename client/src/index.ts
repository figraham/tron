import {
  Loop,
  InputTracker,
  GraphicsTerminal,
  TerminalConfig,
  CharacterSet,
  Vector2
} from 'terminaltxt';
import io from 'socket.io-client';
import { LightCycle } from './LightCycle';
import { userControls } from './user-controls';

const LOOP: Loop = new Loop(init, update);
const WIDTH = 100;
const HEIGHT = 50;
let socket: SocketIOClient.Socket;

let ready: boolean[] = [false, false];
let lost: boolean = false;

let input: InputTracker;
let cycle: LightCycle;
let cycle2: LightCycle;
let term: GraphicsTerminal;

function init(): void {
  setupSocket();
  LOOP.frameRate(10);
  LOOP.running(false);
}

function setupGame(): void {
  if (!ready[0] || !ready[1]) { return; }
  term = new GraphicsTerminal(
    {
      width: WIDTH,
      height: HEIGHT,
    } as TerminalConfig,
    new CharacterSet(' 0─│┌┐└┘╴╵╶╷')
  );
  cycle = new LightCycle(new Vector2(WIDTH / 4, HEIGHT / 2));
  cycle2 = new LightCycle(new Vector2(3* WIDTH / 4, HEIGHT / 2));
  input = userControls(cycle, cycle2);
  LOOP.running(true);
}

function stopGame() {
  LOOP.running(false);
  term = null;
  cycle = null;
  cycle2 = null;
  input = null;
}

function update(): void {
  cycle.checkBoundaries(0, 0, WIDTH, HEIGHT);
  cycle.render(term);
  cycle2.checkBoundaries(0, 0, WIDTH, HEIGHT);
  cycle2.render(term);
  if (lost) { stopGame(); }
  //console.log(cycle.position);
}

function setupSocket(): void {
  socket = io.connect('http://localhost:3000');
  socket.on('established', () => {
    console.log('established');
    ready[0] = true;
    setupGame();
  });
  socket.on('room-ready', () => {
    console.log('room-ready');
    ready[1] = true;
    setupGame();
  });
  socket.on('connection-lost', () => {
    console.log('connection-lost');
    lost = true;
  })
}