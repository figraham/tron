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

const LOOP: Loop = new Loop(init, update);
const WIDTH = 100;
const HEIGHT = 50;
let socket: SocketIOClient.Socket;

let ready: boolean[] = [false, false];
let lost: boolean = false;

let input: InputTracker;
let cycle: LightCycle;
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
  cycle = new LightCycle(new Vector2(Math.floor(random(WIDTH)), Math.floor(random(HEIGHT))));
  input = userControls(cycle);
  LOOP.running(true);
}

function stopGame() {
  LOOP.running(false);
  term = null;
  cycle = null;
  input = null;
  let oldTerm: HTMLElement = document.getElementById('termtxt-container');
  oldTerm.parentElement.removeChild(oldTerm);
}

function update(): void {
  cycle.checkDestroyed(term);
  cycle.render(term);
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